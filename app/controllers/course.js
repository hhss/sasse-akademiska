var marked = require('marked');

// todo express resource doesn't use req.accepts()/req.accepted but it really should
exports.show = {
  html: function(req, res) {
    res.locals.md = marked
    res.render('course/show', { course: req.course })
  },
  json: function(req, res) {
    res.send(req.course);
  }
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
      switch(req.format) {
        default:
        case 'html':
          res.render('course/index', { courses: courses })
          break;
        case 'json':
          res.send(courses)
          break;
      }
    })
}

exports.edit = function(req, res) {
  res.render('course/edit', { course: req.course })
}

exports.load = function(req, id, fn) {
  var app = req.app

  // todo can run in parallel and handwritten SQL isn't as nice as I thought
  app.db.query(
    "SELECT * FROM akademiska.course c INNER JOIN akademiska.course_page cp ON c.id = cp.course_id WHERE c.id = $1 LIMIT 1", [id], function(err, res) {
      if (err || !res.rows.length) { return fn(null, null); }

      var r = res.rows[0];
      var contributions = [];

      app.db.query("SELECT u.id, u.name, c.contribution FROM akademiska.course_contribution c INNER JOIN akademiska.\"user\" u ON c.user_id = u.id WHERE c.course_id = $1", [r.id])
        .on('row', function(row) { contributions.push(row); })
        .on('end', function() {
          fn(null, {
            id: r.id,
            name: r.name,
            url_sse: url_sse(r),
            page: {
              updated_at: r.updated_at,
              body: r.body
            },
            contributions: contributions
          })
        })
    }
  );
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
