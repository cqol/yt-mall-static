import $ from "jquery";
import _ from "lodash";
let utils = {};

let variables = {
	SCROLLS: 120
};

utils = {
	// 取url中query string的值
	getUrlParam: function (url, key) {
		var result = new RegExp("[\\?&]" + key + "=([^&#]*)", "i").exec(url);
		return result && decodeURIComponent(result[1]) || "";
	},
	// 获取window和滚动条参数
	getWindowDimensions: function() {
		var documentElement = document.documentElement;

		return ("pageYOffset" in window) ?
		{
			// W3C
			scrollTop: window.pageYOffset,
			scrollLeft: window.pageXOffset,
			height: window.innerHeight,
			width: window.innerWidth
		} : {
			// IE 8 and below
			scrollTop: documentElement.scrollTop,
			scrollLeft: documentElement.scrollLeft,
			height: documentElement.clientHeight,
			width: documentElement.clientWidth
		};
	},
	// 获取元素位置
	getPosition: function(el) {
		var left = 0,
			top = 0;

		while (el && el.offsetParent) {
			left += el.offsetLeft;
			top += el.offsetTop;
			el = el.offsetParent;
		}
		return { top: top, left: left };
	},
	// 判断元素是否在可视范围内
	insideViewport: function(el) {
		var win = this.getWindowDimensions(),
			pos = this.getPosition(el),
			top = pos.top,
			bot = pos.top + el.offsetHeight;

		return bot >= win.scrollTop &&
			top <= win.scrollTop + win.height;
	},
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
