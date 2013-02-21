var https = require('https')
  , querystring = require('querystring')

exports.login = function(req, res) {
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
        req.session.user = { id: verified.email }
        return res.redirect('/')
      }

      res.send(403, data)
    })
  }
}

exports.logout = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/')
  })
}
