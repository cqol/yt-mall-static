import $ from "jquery";
import FastClick from "fastclick";

$.ajaxSetup({
  cache: false
});
FastClick.attach(document.body);

export default $;
