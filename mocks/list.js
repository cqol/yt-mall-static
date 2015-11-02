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
	app.get("/allProductsKeyword.do", function (req, res, next) {
		var data = loadJSON("price/list");
		res.set({
			"Access-Control-Allow-Origin": "*"
		});
		res.jsonp(data);
	});

	app.get("/admin/goods/goodscate/findAllCates.json", function (req, res, next) {
		var data = loadJSON("price/findAllCates");
		res.set({
			"Access-Control-Allow-Origin": "*"
		});
		res.jsonp(data);
	});



};
