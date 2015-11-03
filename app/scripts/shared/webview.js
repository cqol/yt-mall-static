import env from "./env";

// 目前只支持android (由于iOS技术原因，跳转评论页webview上全局变量会丢失，屏蔽iOS)
let webviewRoot = window.ttsExtentionObj;
// let webviewRoot = window.ttsExtentionObj ? window.ttsExtentionObj : window.visitJSObj;

// mock
if (env.mock) {
  webviewRoot = {
    isLogin() {
      return JSON.stringify({
        userId: "2222",
        token: "abcdefghijklmn"
      });
    },
    getUserInfo(type) {
      window.setUserInfo(JSON.stringify({
        userId: "9999",
        token: "abcdefghijklmn"
      }), type);
    }
  };
}

if (webviewRoot) {
  webviewRoot._get_user = function() {
    if (webviewRoot.getUserInfo) {
      webviewRoot.getUserInfo(); // android
    } else {
      window.location = "isBtnHit:"; // iOS
    }
  };
}
export default webviewRoot;

