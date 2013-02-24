module.exports = {
  port: 3000,
  host: "0.0.0.0",
  "session secret": "keyboard cat",
  views: __dirname + '/app/views',
  "view engine": "jade",

  "browser id audience": "http://0.0.0.0:3000",
  "strict routing": true,

  // override in settings.local.js (any-db format)
  dbURL: null
}
