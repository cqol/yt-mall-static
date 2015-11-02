var Yt = Yt || {};
Yt = {
	ajax: function(options) {
		var that = this,
			opts = $.extend({
				url:"",
				data:"",
				type:"GET",
				async : true,
				complete:null,
				success:null,
				fail:null,
				isLayer:true,
				timeout:30000,
				contentType:'application/x-www-form-urlencoded'
			},options),
			layerTimer = null;
		if(opts.isLayer){
			layerTimer = setTimeout(function(){
				that.createOLayer();
			}, 600);

		}


		if(typeof opts.data != "string"){
			opts.data = $.extend({t: new Date().getTime()}, opts.data);
		}else{
			opts.data += "&t="+new Date().getTime();
		}

		var currAjax = $.ajax({
			type: opts.type,
			url: opts.url,
			data: opts.data,
			async : opts.async,
			dataType: 'json',
			timeout:opts.timeout,
			contentType: opts.contentType,
			complete: function(XMLHttpRequest,status){
				if(status=='timeout'){
					currAjax.abort();
					that.alert('网络超时');
				}
				if(opts.isLayer){
					clearTimeout(layerTimer);
					$("#ajaxLoadingLayer").remove();
				}
				if(opts.complete){
					opts.complete();
				}
				//$('#tr_loading_mask').hide();
			},
			success: function(data, textStatus, jqXHR){
				if(!data) return false;
				if(data.success){
					opts.success(data);
				} else{
					if(!opts.fail){
						if(data.code == 500){
							that.tips('<span class="cor-red">后端程序出错, 请联系管理员!</span>');
						}else{
							that.tips('<span class="cor-red">'+data.message+'</span>');
						}

					}else{
						opts.fail(data);
					}
				}

			},
			error: function(xhr, textStatus, errorThrown){
				if(xhr.status == "404"){
					that.tips('<span class="cor-red">网络连接不通或访问地址不存在！</span>');
					return false;
				}

				if(xhr.status == "401" || (xhr.responseText!=null && xhr.responseText=="_INVALID_POST")){
					that.tips("很抱歉,您没有权限访问该页面...");
				}else if(xhr.responseText!=null && xhr.responseText=="_NO_LOGIN_SESSION"){
					that.tips("很抱歉,登录已经超时,即将跳转到登录页面...",function(){
						window.location.href="/pub/login/login.do";
					});
				}else{
					that.tips("很抱歉,提交数据发生了错误,请联系系统管理员...");
				}
			}
		});
	},

	createOLayer: function(){
		if($("#ajaxLoadingLayer").length == 0){
			var layerHtml = '<div id="ajaxLoadingLayer">'+
				'<div class="o-layer" ></div>'+
				'<div class="wait-layer" >请稍等,处理中...</div>'+
				'</div>';
			$("body").append($(layerHtml));
		}

	},

	get: function(url, data, success) {
		this.ajax({
			url:url,
			data:data,
			type:"GET",
			success:success
		});
	},
	post: function(url, data, success, complete, isLayer) {
		this.ajax({
			url:url,
			data:data,
			type:"POST",
			success:success,
			complete:complete,
			isLayer:isLayer
		});
	},

	alert:function(s,callback, height){
		height = height || 40;
		var alertDialog = dialog({
			title: '温馨提示',
			content:s,
			width:350,
			height:height,
			fixed: true,
			okValue:"确定",
			ok: function () {
				if(callback){
					callback();
				}else{
					alertDialog.close().remove();
				}
			}
		});
		alertDialog.showModal();
		// var alertTipTimer = setTimeout(function(){
		// 	if(callback){
		// 		callback();
		// 	}
		// 	alertDialog.close().remove();
		// 	alertTipTimer = null;

		// }, 3000);
	},

	confirm: function(s, callback, height){
		height = height || 40;

		var d = dialog({
			title: '温馨提示',
			content:s,
			width:350,
			height:height,
			fixed: true,
			okValue: '确&nbsp;&nbsp;定',
			cancelValue: '取&nbsp;&nbsp;消',
			cancel: function () {
				d.close().remove();
			},
			ok: function () {
				if(callback){
					callback();
				}
			}
		});

		d.showModal();
	},

	tips:function(s, call, t){
		t = t || 2000;

		var d = dialog({
			content:s
		});
		d.show();

		setTimeout(function () {
			if(call){
				call();
			}
			d.close().remove();
		}, t);
	},

	getBrandCateList: function(options){
		var opts = $.extend({
			wrap: null,
			brandUrl: '',
			cateUrl: '',
			cateData:null,
			goodsUrl: '',
			brandDef : '', //默认选中品牌id
			cateDef : '', //默认分类id
			goodsDef : '', //默认规格id
			isHasGoodsSel: true,
			chageCallback:null,
			detafultTexts:["--请选择类目--", "--请选择品牌--", "--请选择商品--"],
			dataCallback:function() {}
		}, options||{});

		var that = this,
			wrap = opts.wrap,
			firstSel = wrap.find("select:eq(0)"),
			secondSel = wrap.find("select:eq(1)"),
			thirdSel = wrap.find("select:eq(2)"),
			optionStr = "";

		// 生成分类
		that.generateSelect({
			target: firstSel,
			url: opts.cateUrl,
			data: opts.cateData,
			defVal: opts.cateDef,
			defText:opts.detafultTexts[0],
			chageCallback: function(firstSelect){
				secondSel.html('<option value="">'+opts.detafultTexts[1]+'</option>');
				thirdSel.html('<option value="">'+opts.detafultTexts[2]+'</option>');
				that.resetPrice();
				opts.chageCallback && opts.chageCallback(firstSelect, 0);
				// 生成品牌
				that.generateSelect({
					target: secondSel,
					url: opts.brandUrl,
					data: {cateId: firstSel.val()},
					defVal: opts.brandDef,
					defText:opts.detafultTexts[1],
					chageCallback: function(secondSelect){
						opts.chageCallback && opts.chageCallback(secondSelect, 1);
						thirdSel.html('<option value="">'+opts.detafultTexts[2]+'</option>');
						that.resetPrice();

						if(opts.isHasGoodsSel){

							// 生成商品
							that.generateSelect({
								target: thirdSel,
								url: opts.goodsUrl,
								data: {cateId:firstSel.val(), brandId:secondSel.val()},
								field:"stock",
								defVal: opts.goodsDef,
								defText:opts.detafultTexts[2],
								chageCallback: function(me, data){
									opts.chageCallback && opts.chageCallback(me, 2);
									opts.dataCallback.call(thirdSel, data);
									opts.brandDef = "";
									opts.goodsDef = "";
									opts.cateDef = "";
								}
							});
						}

					}
				});
			}
		});

	},

	resetPrice: function(){
		$("#specWrap").html('<a class="b-disable-btn">请先选择商品信息</a>');
		$("#totalPrice").text("0.00");
		$("#singlePrice").text("0.00");
		$("#goodsPicUl").html('<li><div class="b-1 w-100px h-100px lh-100px ta-c cor-c">请选择商品信息</div></li>');
	},

	generateSelect: function(options){
		var opts = $.extend({
				target:null,
				url: '',
				data: '',
				displayField:'name',
				field:"",
				defVal: '',
				defText: null,
				isHasChange: true,
				chageCallback:function() {},
				callback:function() {}
			}, options||{}),
			me = opts.target,
			listData = null,
			optionStr = '',
			dataField = '',
			that = this;

		if(!opts.target) return false;

		this.post(opts.url, opts.data, function(json){
			optionStr = '';
			listData = json.data;
			optionStr += '<option value="">'+opts.defText+'</option>';
			for(var i=0; i< listData.length; i++){
				if(opts.field){
					dataField = 'data-'+opts.field+'='+listData[i][opts.field];
				}
				optionStr += '<option value="'+listData[i].id+'" '+dataField+'>'+listData[i][opts.displayField]+'</option>';
			}
			me.html(optionStr);

			// 绑定change
			me.off("change").on("change", function(){
				opts.chageCallback(me, listData);
			});


			// 选中默认值
			if(opts.defVal){

				//解决ie6 bug
				setTimeout(function(){
					me.val(opts.defVal);

					if(opts.isHasChange){
						me.change();
					}
				},1);
			}

			opts.callback(me, listData);

		});

	},

	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
	// 例子：
	// Yt.formatDate(new Date(),"yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
	// Yt.formatDate(new Date(),"yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
	formatDate: function(date, fmt){
		var o = {
			"M+" : date.getMonth()+1,                 //月份
			"d+" : date.getDate(),                    //日
			"h+" : date.getHours(),                   //小时
			"m+" : date.getMinutes(),                 //分
			"s+" : date.getSeconds(),                 //秒
			"q+" : Math.floor((date.getMonth()+3)/3), //季度
			"S"  : date.getMilliseconds()             //毫秒
		};

		if(/(y+)/.test(fmt)){
			fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
		}

		for(var k in o){
			if(new RegExp("("+ k +")").test(fmt)){
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
			}
		}

		return fmt;
	},

	getDate: function (day){
		var zdate=new Date();
		var sdate=zdate.getTime()+(1*24*60*60*1000);
		var edate = this.formatDate(new Date(sdate-(day*24*60*60*1000)),"yyyy-MM-dd");
		return edate;
	},

	checkboxSelectAll: function(tableList){
		// 全选
		var selectAll = $(".selectAll");
		tableList.on("click", ".jt-checkbox", function(){

			if(tableList.find(".jt-checkbox").length == tableList.find(".jt-checkbox:checked").length){
				selectAll.prop("checked", true);
			}else{
				selectAll.prop("checked", false);
			}

		});

		// 全选
		selectAll.on("click", function(){
			tableList.find(".jt-checkbox").prop("checked", $(this).prop("checked"));
			selectAll.prop("checked", $(this).prop("checked"));
		});
	}


}

$(function(){
	var aboutWrap = $("#aboutWrap");
	aboutWrap.find(".item").hover(function(){
		$(this).find(".item-box").show();
	}, function(){
		$(this).find(".item-box").hide();
	});
});




window.Yt = Yt;

