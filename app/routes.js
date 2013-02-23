
var root = require('./controllers/root')
  , auth = require('./controllers/auth')
  , login = require('connect-ensure-login')
  , form = require('express-form')

var formUpdate = form(
  form.field("name").trim().required(),
  form.field("body").trim().required()
)

module.exports = function(app) {
  app.get('/', root.index)
  app.post('/auth/login', auth.login)
  app.post('/auth/logout', auth.logout)

  // temporary disabled while working on this because the cookie
  // is invalidated on every restart of the server
  // app.all('/courses*', login.ensureLoggedIn('/'))

  var course = require('./controllers/course')
  app.get('/courses', course.index)
  app.get('/courses/:id', course.load, course.show)
  app.get('/courses/:id/edit', course.load, course.edit)

  // because express-resource treats everything after the last period
  // as the format (i.e. 22584@student.hhs.se is "22584@student.hhs" with
  // format "se"), this is manual for now.
  // todo patch express-resource to use express.accept stuff
  var user = require('./controllers/user')
  app.all('/users*', login.ensureLoggedIn('/'))
  app.get('/users/:id', user.load, user.show)
}
