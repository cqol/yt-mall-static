import $ from "jquery";
import _ from "lodash";
import env from "../../shared/env";
import "./serializeJson";

exports.setProduct = {
	init: function () {
		this.render()
	},
	flag: true, //
	render: function () {
		console.log('render init');
		this.setPrice();
		this.setPercent();
		this.setTips();

		this.setSubmit();
		this.initTable();

		//类目联动！
		this.setSelect();

		var replaceInput = function (obj) {
			var str = obj.val();
			str = str.replace(/\D/gi, "");
			obj.val(str)
		}

		this.percentWrap.find('input[type="text"]').on('keyup', function () {
			replaceInput($(this))
		}).on('focus', function () {
			if ($(this).val() == 0) {
				$(this).val('')
			}
		}).on('blur', function () {
			if ($(this).val() == '') {
				$(this).val('0')
			}
		});

		this.priceWrap.find('input[type="text"]').on('keyup', function () {
			replaceInput($(this))
		}).on('focus', function () {
			if ($(this).val() == 0) {
				$(this).val('')
			}
		}).on('blur', function () {
			if ($(this).val() == '') {
				$(this).val('0')
			}
		});
	},

	// 获取商品规格和图片
	generateSpec: function (target, data) {
		var _this = this,
			viewGoodsPrice = $('#viewGoodsPrice');
		var params = {
			itemId: target.val()
		};
		Yt.post(env.services.basePath + env.apis.price.findPreference, params, function (json) {
			var listData = json.preferenceList;

			var optionStr = '';
			optionStr += '<option value="">--全部规格--</option>';

			for (var i = 0; i < listData.length; i++) {
				optionStr += '<option value="' + listData[i].ytPfcId + '">' + listData[i].preferenceDescription + '</option>';
			}

			_this.cateWrap.find("select:eq(3)").html(optionStr);
		});

	},
	setSelect: function () {
		var _this = this,
			viewGoodsPriceLink = $('#viewGoodsPrice'),
			cateBrandWrap = $("#cateBrandWrap"),
			search = '';

		Yt.getBrandCateList({
			detafultTexts: ['--全部类目--', '--全部品牌--', '--全部商品--'],
			wrap: cateBrandWrap,		
			cateUrl: env.services.basePath + env.apis.price.findAllCates,
			brandUrl: env.services.basePath + env.apis.price.goodsCateToBrand,
			goodsUrl: env.services.basePath + env.apis.price.itemWhenLink,
			chageCallback: function(target, index){
				if(index == 0){
					search = '';
					search += '?cateId='+ target.val();
				}else if(index == 1){
					search += '&brandId='+ target.val();
				}else if(index ==2){
					search += '&itemName='+ target.find('option:selected').text();
				}
				
				viewGoodsPriceLink.attr('href', '/admin/mall/item/onsale'+search);
			},
			dataCallback: function (data) {
				_this.generateSpec(this, data);
			}
		});
	},
	from: $('#postSetForm'),
	data: {},
	cateWrap: $('#cateBrandWrap'),
	submitFrom: function () {
		console.log('提交订单');
		var _this = this;
		/*Yt.post($("#basePath").val() + '/admin/mall/item/doBatchModifyPrice', _this.data, function () {
		 Yt.confirm('利润设置成功');
		 });*/

		Yt.ajax({
			url: $("#basePath").val() + '/admin/mall/batchPrice/doBatchModifyPrice',
			data: _this.data,
			type: "POST",
			success: function () {
				Yt.tips('利润设置成功');
				setTimeout(function () {
					window.location.reload(true);
				}, 2000);
			},
			timeout: 300000
		});
	},
	updateSetRadio: function (tag) {
		var _this = this;
		var priceValue = $('input[name="priceValue"]');

		_this.priceValue = priceValue;
		_this._tag = '元';
		if (tag == '0') {
			priceValue.val(_this.priceWrap.find('input[type="text"]').val());
			if (_this.priceWrap.find('input[type="text"]').val() == 0) {
				_this.flag = false;
			} else {
				_this.flag = true;
			}
			_this._tag = '元';

		} else {
			priceValue.val(_this.percentWrap.find('input[type="text"]').val());
			if (_this.percentWrap.find('input[type="text"]').val() == 0) {
				_this.flag = false
			} else {
				_this.flag = true;
			}
			_this._tag = '%';
		}
	},
	/**
	 * 设置按钮
	 */
	setSubmit: function () {
		var _this = this;
		var setPriceBtn = $('#setPriceBtn');
		var resetDefaultBtn = $('#resetDefaultBtn');

		var isPriceRadio = $('.isPriceRadio');
		var isPercentRadio = $('.isPercentRadio');


		var setDisable = function (tag) {
			//var priceValue = $('input[name="priceValue"]');

			if (tag == '0') {
				$('.isPercentCheckbox')[0].disabled = true;
				$('.isPriceCheckbox')[0].disabled = false;
				_this.radioTest = '单件利润额';
			} else {
				$('.isPercentCheckbox')[0].disabled = false;
				$('.isPriceCheckbox')[0].disabled = true;
				_this.radioTest = '利润幅度';
			}
			_this.updateSetRadio(tag);

		}


		isPriceRadio.on('click', function () {
			setDisable(isPriceRadio.val());
			$('.J_setPercent').find('input[type="text"]').val(0);
			$('.isPercentCheckbox')[0].checked = false
		});

		isPercentRadio.on('click', function () {
			setDisable(isPercentRadio.val());
			$('.J_setPrice').find('input[type="text"]').val(0);
			$('.isPriceCheckbox')[0].checked = false
		});


		/*设置提交*/
		setPriceBtn.on('click', function () {
			var profitRado = $('input[name="batchPriceType"]:checked');

			var firstSel = _this.cateWrap.find("select:eq(0) :selected"),
				secondSel = _this.cateWrap.find("select:eq(1) :selected"),
				thirdSel = _this.cateWrap.find("select:eq(2) :selected"),
				fSel = _this.cateWrap.find("select:eq(3) :selected");

			_this.updateSetRadio(profitRado.val());

			if (!profitRado.val() || !_this.flag) {
				Yt.alert('<div style="text-align: center;">您还没有设置需要调整的利润，请选择其中一项，并填写相应数值。</div>')
			} else {

				_this.data = $.extend(_this.data, _this.from.serializeJson(), {
					cateName: encodeURIComponent(firstSel.text()),
					brandName : encodeURIComponent(secondSel.text()),
					itemName: encodeURIComponent(thirdSel.text()),
					preferenceName: encodeURIComponent(fSel.text())
				});

				var confirmStr = '是否设置';

				if (fSel.val()) {
					confirmStr += thirdSel.text() + '规格为' + fSel.text() + '的' + _this.radioTest +
						'设置为';
				} else if (thirdSel.val()) {
					confirmStr += thirdSel.text() + '的' + _this.radioTest +
						'设置为';
				} else if (secondSel.val()) {
					confirmStr += secondSel.text() + '全部商品的' + _this.radioTest +
						'设置为';
				} else if (firstSel.val()) {
					confirmStr += firstSel.text() + '类目全部商品的' + _this.radioTest +
						'设置为';
				} else {
					confirmStr += '全部商品的' + _this.radioTest;
				}

				confirmStr += _this.priceValue.val() + _this._tag;
				console.log(confirmStr);

				Yt.confirm(confirmStr, function () {
					_this.submitFrom();
				});
			}

		});

		/*重置设置*/
		resetDefaultBtn.on('click', function () {

			var firstSel = _this.cateWrap.find("select:eq(0) :selected"),
				secondSel = _this.cateWrap.find("select:eq(1) :selected"),
				thirdSel = _this.cateWrap.find("select:eq(2) :selected"),
				fSel = _this.cateWrap.find("select:eq(3) :selected");


			_this.data = $.extend(_this.data, _this.from.serializeJson(), {
				cateName: encodeURIComponent(firstSel.text()),
				brandName : encodeURIComponent(secondSel.text()),
				itemName: encodeURIComponent(thirdSel.text()),
				preferenceName: encodeURIComponent(fSel.text())
			});

			var confirmStr = '是否重置';

			if (fSel.val()) {
				confirmStr += thirdSel.text() + '规格为' + fSel.text() + '的' + _this.radioTest;
			} else if (thirdSel.val()) {
				confirmStr += thirdSel.text() + '的' + _this.radioTest;
			} else if (secondSel.val()) {
				confirmStr += secondSel.text() + '全部商品的' + _this.radioTest;
			} else if (firstSel.val()) {
				confirmStr += firstSel.text() + '类目全部商品的' + _this.radioTest;
			} else {
				confirmStr += '全部商品';
			}

			confirmStr += '为系统指导价';
			console.log(confirmStr);

			Yt.confirm(confirmStr, function () {

				Yt.ajax({
					url: $("#basePath").val() + '/admin/mall/batchPrice/doBatchResetPrice',
					data: _this.data,
					type: "POST",
					success: function () {
						Yt.tips('重置系统指导价成功');

						setTimeout(function () {
							window.location.reload(true);
						}, 2000);
					},
					timeout: 300000
				});
			});
		});
	},

	/**
	 * 利润价格设置
	 */
	setPrice: function () {
		console.log('init seprice');
		var wrapBox = $('.J_priceWrap'),
			priceInput = wrapBox.find('input[type="text"]'),
			reduceBtn = wrapBox.find('.J_reduce'),
			addBtn = wrapBox.find('.J_add');

		this.priceWrap = wrapBox;

		var num = 0; //默认0

		addBtn.on('click', function () {
			num = priceInput.val();
			num++;
			priceInput.val(num);
		});
		reduceBtn.on('click', function () {
			num = priceInput.val();
			num--;
			if (num < 0) {
				num = 0;
			}
			priceInput.val(num);
		});
	},
	/**
	 * 利润百分比设置
	 */
	setPercent: function () {
		console.log('init setPercent');
		var wrapBox = $('.J_percentWrap'),
			priceInput = wrapBox.find('input[type="text"]'),
			reduceBtn = wrapBox.find('.J_reduce'),
			addBtn = wrapBox.find('.J_add');

		this.percentWrap = wrapBox;
		var num = 0; //默认0

		addBtn.on('click', function () {
			num = priceInput.val();
			num++;
			priceInput.val(num);
		});

		reduceBtn.on('click', function () {
			num = priceInput.val();
			num--;
			if (num < 0) {
				num = 0;
			}
			priceInput.val(num);
		});
	},

	/**
	 * 左侧tips设置！
	 */
	setTips: function () {
		var questionTip = $('.J_qtips');
		questionTip.on('mouseover', function () {
			var popDialog = dialog({
				skin: 'qtip',
				align: 'bottom left',
				quickClose: true,
				padding: 8,
				width: 250,
				content: '说明：利润设置，是将您当前已上架的商品利润，设置在您期待的金额或者幅度。' + '<br/>' +
				'利润=零售价-成本价' + '<br/>' +
				'利润幅度=利润/成本价'
			});
			popDialog.show(questionTip[0]);
		});
	},
	columns: [
		{
			title: '时间',
			field: 'createTime',
			width: '30%'
		},
		{
			title: '设置记录',
			field: 'logDes',
			width: '40%'
		}, {
			title: '操作人',
			field: 'createUser',
			width: '30%'
		}
	],
	initTable: function (curpage) {
		var that = this;
		var tableList = $('#J_table');
		curpage = curpage || 1;
		var params = {
			pageNo: curpage
		};

		Yt.post(env.services.basePath + env.apis.price.queryBatchPriceLog, params, function (json) {
			tableList.jtable({
				columns: that.columns,
				curpage: curpage,
				source: json,
				pageContainer: $("#Pagination"),
				pageCallback: function (pageIndex) {
					that.initTable(pageIndex);
				}
			});
		});
	}
}