import $ from "jquery";
import _ from "lodash";

let env = {};
let mockHost = "http://" + window.location.hostname + ":8000";
let ValidIpAddressRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

env.services = {
  main: "http://www.hipac.cn",
	cms: "http://cmsproxy.lingshijia.com",
	basePath: $("#basePath").val()
};

env.apis = {
	price: {
		queryBatchPriceLog: "/admin/mall/batchPrice/queryBatchModifyPriceLog",
		findPreference: "/admin/preference/preference/findPreference.json",
		findAllCates: "/admin/goods/goodscate/findAllCates.json",
		goodsCateToBrand: "/admin/goods/brand/goodsCateToBrand.json",
		itemWhenLink: "/admin/item/item/itemWhenLinkOnsale.json"
	},
	zhuanti: {
		getZanComment: "/reportFeedback.do",
		addFav: "/addFav.do",
		deleteFav: "/deleteFav.do"
	},
	comment: {
		getComment: "/findCommentByPid.do",
		addComment: "/saveComment.do"
	},
	cipher: {
		addCount: "/addAnHaoCount.do"
	},
	agentApply:{
		addApplyInfo:"/addSellerInfo.do",
		getApplyInfo:"/getSellerInfo.do"
	}
};

if ((["localhost", "127.0.0.1", "localhost.com", "0.0.0.0"].indexOf(window.location.hostname) !== -1 ||
  window.location.hostname.match(ValidIpAddressRegex)) ) {
  // mock data
  if (document.location.search.indexOf("mock") !== -1) {
    _.each(env.services, (value, key) => {
      env.services[key] = mockHost;
    });
    env.mock = true;
  }
  // debug data
  if (document.location.search.indexOf("debug") !== -1) {
    _.extend(env.services, {
      main: "http://172.16.30.31:9999"
    });
  }
}

export default env;
