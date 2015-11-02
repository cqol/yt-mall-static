import $ from "jquery";
import _ from "lodash";
let utils = {};

let variables = {
	SCROLLS: 120
};

utils = {

	isBottom(obj) {
		obj = obj || $(".column-wrap");
		var flag = obj.offset().top + obj.get(0).scrollHeight - variables.SCROLLS <= $(window).height() + $(window).scrollTop();
		if (flag) return true;
		return false;
	},

	// 预加载
	preload(a, callback) {
		var img = new Image();
		img.src = $(a).data("origin");
		img.onload = function () {
			if (img.complete === true) {
				$(a).hide();
				$(a).attr("src", $(a).data("origin"));
				$(a).fadeIn(500);
				callback(img.width, img.height);
			}
		};
	},

	setTrans: function (obj, value, speed, type) {
		var type = type || 'y';
		var speed = speed || 0;
		switch (type) {
			case 'x':
				obj.style.webkitTransitionDuration =
					obj.style.transitionDuration = speed + 'ms';

				obj.style.webkitTransform = 'translate(' + value + 'px,0)';
				obj.style.transform = 'translateX(' + value + 'px)';
				break;
			case 'y':
				obj.style.webkitTransitionDuration =
					obj.style.transitionDuration = speed + 'ms';

				obj.style.webkitTransform = 'translate(0px,' + value + 'px)';
				obj.style.transform = 'translateY(' + value + 'px)';
				break;
			case 'a':
				obj.style.webkitTransitionDuration =
					obj.style.transitionDuration = speed + 'ms';

				obj.style.webkitTransform = 'translate(' + value.x + 'px,' + value.y + 'px)';
				obj.style.transform = 'translate(' + value.x + 'px,' + value.y + 'px)';
				break;
		}
	}
}

export default utils;