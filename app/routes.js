
var root = require('./controllers/root')
  , auth = require('./controllers/auth')
  , login = require('connect-ensure-login')

module.exports = function(app) {
  app.get('/', root.index)
  app.post('/auth/login', auth.login)
  app.post('/auth/logout', auth.logout)

  app.all('/courses*', login.ensureLoggedIn('/'))
  app.resource('courses', require('./controllers/course.js'))

  // because express-resource treats everything after the last period
  // as the format (i.e. 22584@student.hhs.se is "22584@student.hhs" with
  // format "se"), this is manual for now.
  // todo patch express-resource to use express.accept stuff
  var user = require('./controllers/user')
  app.all('/users*', login.ensureLoggedIn('/'))
  app.get('/users/:id', user.load, user.show)
}
