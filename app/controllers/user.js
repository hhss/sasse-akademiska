exports.show = function(req, res) {
  res.send(req.user)
}

exports.load = function(req, res, next) {
  var id = req.param('id')
  _load(req, id, function(err, obj) {
    if (!obj) { return res.send(404) }
    req.user = obj
    next()
  })
}

// this is according to express-resource semantics, but we're bypassing
// that for this resource (see routes.js)
var _load = function(req, id, fn) {
  var app = req.app

  app.db.query('SELECT * FROM akademiska."user" WHERE id = $1', [id], function(err, res) {
    if (err || !res.rows.length) { return fn(null, null) }
    var r = res.rows[0]

    fn(null, { id: r.id, name: r.name, role: r.role })
  })
}
