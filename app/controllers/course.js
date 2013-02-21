exports.show = {
  html: function(req, res) {
    res.send("course show");
  },
  json: function(req, res) {
    res.send(req.course);
  }
}

exports.load = function(req, id, fn) {
  fn(null, {
    id: "404",
    name: "Microeconomics",
    url_sse: "http://courseweb.hhs.se",
    page: {
      updated_at: new Date(),
      body: "markdown body"
    },
    authors: [
      { id: "hej@victorandree.se", name: "Victor Andrée", contribution: 100 }
    ]
  });
}
