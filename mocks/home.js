var fs = require("fs"),
    path = require("path");

var loadJSON = function (name) {
  var fp = path.join(__dirname, "../fixtures", name + ".json");
  if(fs.existsSync(fp)) {
    return JSON.parse(fs.readFileSync(fp, "utf8"));
  }
  return {};
};

exports.mock = function (app) {
  app.post("/admin/mall/batchPrice/queryBatchModifyPriceLog", function (req, res, next) {
    var data = loadJSON("price/histroySet");
		res.set({
			"Access-Control-Allow-Origin": "*"
		});
    res.jsonp(data);
  });

  app.post("/admin/goods/goodscate/findAllCates.json", function (req, res, next) {
    var data = loadJSON("price/findAllCates");
		res.set({
			"Access-Control-Allow-Origin": "*"
		});
    res.jsonp(data);
  });


  app.post("/admin/goods/brand/goodsCateToBrand.json", function (req, res, next) {
    var data = loadJSON("price/goodsCateToBrand");
		res.set({
			"Access-Control-Allow-Origin": "*"
		});
    res.jsonp(data);
  });


  app.post("/admin/item/item/itemWhenLinkOnsale.json", function (req, res, next) {
    var data = loadJSON("price/itemWhenLink");
		res.set({
			"Access-Control-Allow-Origin": "*"
		});
    res.jsonp(data);
  });

  app.post("/admin/preference/preference/findPreference.json", function (req, res, next) {
    var data = loadJSON("price/findpre");
		res.set({
			"Access-Control-Allow-Origin": "*"
		});
    res.jsonp(data);
  });


};
