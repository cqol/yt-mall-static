var fs = require("fs"),
    path = require("path");
var url=require('url');
var loadJSON = function (name) {
  var fp = path.join(__dirname, "../fixtures", name + ".json");
  if(fs.existsSync(fp)) {
    return JSON.parse(fs.readFileSync(fp, "utf8"));
  }
  return {};
};

exports.mock = function (app) {
  app.get("/findCommentByPid.do", function (req, res, next) {
    var path, data,
      requestTime = req.query.requestTime || '';
    if (requestTime === "") {
      path = "comment/findCommentByPid_1";
    } else if (requestTime.indexOf("first") !== -1) {
      path = "comment/findCommentByPid_2";
    } else if (requestTime.indexOf("second") !== -1) {
      path = "comment/findCommentByPid_3";
    }
    data = loadJSON(path);
    res.jsonp(data);
  });
  app.post("/saveComment.do", function (req, res, next) {
    var data = loadJSON("comment/addComment");
    res.set({
      "Access-Control-Allow-Origin": "*"
    });
    res.send(data);
  });
};
