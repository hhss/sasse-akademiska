var https = require('https')
  , querystring = require('querystring')

exports.login = function(req, res) {
  var app = req.app;

  req.session.user = null;

  if (!req.body || !req.body.assertion) {
    return res.send(400)
  }

  var assertion = req.body.assertion;
  var audience = req.app.get('browser id audience')

  var query = querystring.stringify({ assertion: assertion, audience: audience })
  var headers = {}
  headers['Content-Type'] = 'application/x-www-form-urlencoded'
  headers['Content-Length'] = query.length

  var request = https.request({
    host: 'verifier.login.persona.org',
    path: '/verify',
    method: 'POST',
    headers: headers
  }, verify)

  request.write(query)
  request.end()

  function verify(bidres) {
    var data = ""

    bidres.on('data', function(chunk) { data += chunk })
    bidres.on('end', function() {
      var verified = JSON.parse(data)

      if (verified.status == 'okay') {
        if (verified.email.indexOf('@student.hhs.se') === -1) {
          return res.send(403, { status: "failure", reason: "only @student.hhs.se e-mail allowed" })
        }
        else {
          app.db.query('SELECT name, role FROM akademiska."user" WHERE id = $1', [verified.email])
            .on('row', function(row) {
              req.session.user = { id: verified.email, name: row.name, role: row.role }
              res.redirect('/')
            })
        }
      }
      else {
        res.send(403, data)
      }
    })
  }
}

exports.logout = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/')
  })
}
