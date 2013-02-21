#!/usr/bin/env node

/*

SASSE Akademiska -- built on Express and node.js

Uses patterns and ideas from [12factor](http://12factor.net/) and various
other sources. Built in February 2013.

This file is the main entry point, `node server.js` starts the server.
Configuration happens by loading the `settings.default.js` and `settings.local.js`
files -- where the latter is not checked in to the repository and should contain
private configuration.

*/

_ = require('underscore')

var express = require('express')
  , Resource = require('express-resource')

var app = express()

// configure app using settings from settings.default.js and settings.local
// overriding defaults in that order.
var configure = (function(app) {
  var settings = require('./settings.default')
  var settingsLocal

  try {
    settingsLocal = require('./settings.local')
  }
  catch (e) {
    settingsLocal = {}
  }

  return _.extend(app.settings, settings, settingsLocal)
})(app);

app.configure(function() {
  app
    .use(express.logger('dev'))
    .use(express.favicon())
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(app.router)
});

app.configure('development', function() {
  app.use(express.errorHandler())
})

// configure routes
// most routes are resource routes using express-resource.
require('./app/routes')(app)

// run the app if we're not being used for something else.
if (!module.parent) {
  var dbPool = require('any-db').createPool(app.get('dbURL'))
  app.db = dbPool

  var server = app.listen(app.get('port'), app.get('host'), function() {
    console.log('akademiska listening intently on %s:%d in "%s"',
      app.get('host'),
      app.get('port'),
      app.get('env')
    )
    console.log()
  })

  process.on('SIGINT', function() {
    console.log()
    console.log("shutting down akademiska (ctrl+c)")

    dbPool.close()
    server.close()
  })
}

exports.app = app
