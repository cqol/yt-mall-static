var server = null,
    express = require("express"),
    path = require("path"),
    fs = require("fs"),
    multipart = require("connect-multiparty"),
    exphbs  = require("express-handlebars");
var expVM = require("express-velocity");

process.on("SIGTERM", function () {
  process.send({
    status: "closed"
  });
  process.exit(0);
});


function startServer(options, callback) {
  var app = express();
  app.use(express.cookieParser("secret cat"));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(multipart());
  app.use(express.static(__dirname, {'index': ['index.html', 'index.htm']}));
  app.engine("vm", expVM({extname: ".vm"}));
  app.set("views", path.join(__dirname, "../../mocks/views"));
  app.set("view engine", "vm");
  app.use(function (req, res, next) {
    var headers = {};
    if(req.method.toUpperCase() === "OPTIONS") {
      headers["Access-Control-Allow-Origin"] = "*";
      headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
      headers["Access-Control-Allow-Credentials"] = true;
      headers["Access-Control-Max-Age"] = '86400'; // 24 hours
      headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";
    } else {
      headers["Access-Control-Allow-Origin"] = "*";
    }
    Object.keys(headers).forEach(function (k) {
      res.setHeader(k, headers[k]);
    });
    res.cookie("mock", "1", {httpOnly: true, maxAge: 900000});
    return next();
  });
  options.files.forEach(function (endpoint) {
    var fp = path.join(process.cwd(), endpoint),
        layer;
        
    if(fs.statSync(fp).isFile()) {
      delete require.cache[fp];
      layer = require(fp);
      if(layer.mock) {
        layer.mock(app);
      }
    }
  });
  app.server = app.listen(options.port, callback);
  return app;
}

process.on("message", function (data) {
  if(data.port && data.files) {
    startServer(data, function () {
      process.send({
        status: "started",
        port: data.port
      });
    });
  }
});

module.exports = startServer;