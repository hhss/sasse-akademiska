module.exports = function(app) {
  app.resource('courses', require('./controllers/course.js'))
}
