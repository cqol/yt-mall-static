import $ from "jquery";
import utils from "./utils";
import webviewRoot from "./webview";

let isShowTitle = false;

console.log(utils.getUrlParam);
if (!webviewRoot && utils.getUrlParam(window.location.href, "apk") !== "app") {
  $("#top-bar").css("display", "block");
  isShowTitle = true;
}
export default isShowTitle;
