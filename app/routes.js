
var root = require('./controllers/root')
  , auth = require('./controllers/auth')

module.exports = function(app) {
  app.get('/', root.index)
  app.post('/auth/login', auth.login)
  app.post('/auth/logout', auth.logout)

  app.resource('courses', require('./controllers/course.js'))
}
