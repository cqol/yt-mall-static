/*global ga*/

import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";

let GA = _.extend({}, Backbone.Events);

GA.init = function () {
  if(GA._init) {//prevent multiple binds
    return;
  }
  GA._init = true;
  $("body").on("click", "[data-ga]", function (e) {
    let $obj = $(e.currentTarget),
        ga = $obj.data("ga"),
        args;
    if(!ga) {//exit if it's not a ga tag
      return;
    }
    args = ga.split("|");//category, action
    if(args[3]) {
      args[3] = parseInt(args[4], 10);
    }
    GA.trackEvent.apply(GA, args);
  });
};

GA._init = false;

GA.trackEvent = function () {
  let args = [].slice.call(arguments, 0).toString();
  ga("send", "event", args);
};

GA.init();

export default GA;
