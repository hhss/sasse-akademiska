var marked = require('marked')
  , form = require('express-form')
  , s = require('../sql')

var formEdit = form(
  form.field('name').trim().required(),
  form.field('page.body').trim().required()
)
form.configure({ autoLocals: false })

exports.formEdit = formEdit

exports.show = function(req, res) {
  res.format({
    html: function() {
      res.locals.md = marked
      res.render('course/show', { course: req.course })
    },
    json: function() { res.send(req.course) }
  })
}

exports.index = function(req, res) {
  var app = req.app
  var courses = []

  app.db.query(s.course.select(s.course.star()).from(s.course).toQuery().text)
    .on('row', function(row) {
      courses.push({
        id: row.id,
        name: row.name,
        url_sse: url_sse(row)
      })
    })
    .on('end', function() {
      res.format({
        html: function() {
          res.render('course/index', { courses: courses })
        },
        json: function() { res.send(courses) }
      })
    })
}

exports.edit = function(req, res) {
  res.render('course/edit', { course: req.course, form: req.course })
}

exports.update = function(req, res) {
  if (!req.form.isValid) {
    return res.format({
      html: function() {
        res.render('course/edit', { course: req.course, form: req.form })
      },
      json: function() {
        res.send(400, req.form.errors)
      }
    })
  } else {
    var tx = req.app.db.begin()
    // todo should be wrapped in once?
    tx.on('error', function(err) { console.log(err); res.send(500) })
    tx.query('UPDATE akademiska.course SET name = $1 WHERE id = $2', [req.form.name, req.course.id])
    tx.query('UPDATE akademiska.course_page SET body = $1 WHERE course_id = $2', [req.form.page.body, req.course.id])

    tx.commit(function(err) {
      if (err) return res.send(500);
      res.redirect('courses/' + req.course.id)
    })
  }
}

exports.load = function(req, res, next) {
  var id = req.param('id')
  var db = req.app.db
  var q = s.course
    .select(s.course.star(), s.course_page.star())
    .from(s.course.join(s.course_page).on(s.course.id.equals(s.course_page.course_id)))
    .where(s.course.id.equals(id))
    .limit(1)
    .toQuery()

  db.query(q.text, q.values, function(err, res) {
    if (err || !res.rows.length) { return next(404) }

    var r = res.rows[0]
    var contributions = []
    var q2 = s.course_contribution
      .select(s.user.id, s.user.name, s.course_contribution.contribution)
      .from(s.course_contribution.join(s.user).on(s.course_contribution.user_id.equals(s.user.id)))
      .where(s.course_contribution.course_id.equals(r.id))
      .toQuery()

    db.query(q2.text, q2.values)
      .on('row', function(row) { contributions.push(row) })
      .on('end', function() {
        req.course = {
          id: r.id,
          name: r.name,
          url_sse: url_sse(r),
          page: {
            updated_at: r.updated_at,
            body: r.body
          },
          contributions: contributions
        }

        next()
      })
  })
}

// url === null -> autodetermine
// url === "" -> no course web available
// else -> use given value
// arguably belongs in our model layer: the database
function url_sse(course) {
  if (course.url_sse === null) {
    return "https://studentweb2.hhs.se/CourseWeb/CourseWebSSE/CWSSE.ASP?WCI=News&CourseNr=" + course.id;
  }
  return course.url_sse;
}
