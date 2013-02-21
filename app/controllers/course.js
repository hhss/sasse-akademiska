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

  app.db.query("SELECT * FROM akademiska.course c")
    .on('row', function(row) { courses.push(row) })
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
            url_sse: r.url_sse,
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
