$(function() {
  $("button.login").click( function() { navigator.id.request({
    siteName: "SASSE Akademiska"
  }) })

  $("button.logout").click( function() { navigator.id.logout() })

  navigator.id.watch({
    loggedInUser: user.id || null,
    onlogin: function(assertion) {
      $.post('/auth/login', { assertion: assertion })
        .done(function() { window.location.reload() })
        .fail(function(xhr, status, err) {
          console.log(status + " " + err)
        })
    },
    onlogout: function() {
      $.post('/auth/logout').always(function() { window.location.reload() })
    }
  })
})
