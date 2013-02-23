var marked = require('marked')
  , form = require('express-form')

var updateForm = form(
  form.field('name').trim().required(),
  form.field('body').trim().required()
)

exports.updateForm = updateForm

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

  app.db.query("SELECT * FROM akademiska.course c ORDER BY c.id")
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
  res.render('course/edit', { course: req.course })
}

exports.update = function(req, res) {
  if (!req.form.isValid) {
    return res.format({
      html: function() {
        res.send(400)
      },
      json: function() {
        res.send(400, req.form.errors)
      }
    })
  } else {
    req.app.db.query('UPDATE akademiska.course SET name = $1 WHERE id = $2', [req.form.name, req.course.id], function(err, r) {
      if (err) { console.log(err); return res.send(500) }

      req.app.db.query('UPDATE akademiska.course_page SET body = $1 WHERE course_id = $2', [req.form.body, req.course.id], function(err, r) {
        if (err) { console.log(err); return res.send(500) }
        res.redirect('courses/' + req.course.id)
      })
    })
  }
}

exports.load = function(req, res, next) {
  var id = req.param('id')

  var db = req.app.db
  db.query(
    "SELECT * FROM akademiska.course c INNER JOIN akademiska.course_page cp ON c.id = cp.course_id WHERE c.id = $1 LIMIT 1", [id], function(err, res) {
      if (err || !res.rows.length) { return next(404) }

      var r = res.rows[0]
      var contributions = []

      db.query("SELECT u.id, u.name, c.contribution FROM akademiska.course_contribution c INNER JOIN akademiska.\"user\" u ON c.user_id = u.id WHERE c.course_id = $1", [r.id])
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
    }
  )
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
