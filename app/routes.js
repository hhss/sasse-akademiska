
var root = require('./controllers/root')
  , auth = require('./controllers/auth')
  , login = require('connect-ensure-login')

module.exports = function(app) {
  app.get('/', root.index)
  app.post('/auth/login', auth.login)
  app.post('/auth/logout', auth.logout)

  app.all('/courses*', login.ensureLoggedIn('/'))
  app.resource('courses', require('./controllers/course.js'))
}
