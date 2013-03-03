/*
Defines node-sql constructs for our tables.

Sort of violates DRY because the schema is specified in both schema.sql
and here. A more complete version of node-sql might provide a full Javascript
description of our SQL schema.
*/
var sql = require('sql')

exports.course = sql.define({
  schema: 'akademiska',
  name: 'course',
  columns: ['id', 'name', 'url_sse']
})

exports.user = sql.define({
  schema: 'akademiska',
  name: 'user',
  columns: ['id', 'name', 'role', 'dropbox_access']
})

exports.course_page = sql.define({
  schema: 'akademiska',
  name: 'course_page',
  columns: ['course_id', 'updated_id', 'body']
})

exports.course_contribution = sql.define({
  schema: 'akademiska',
  name: 'course_contribution',
  columns: ['course_id', 'user_id', 'contribution']
})
