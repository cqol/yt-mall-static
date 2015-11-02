$(function(){
	var top = {
		popDialog: null,
		// 修改密码
		editPassword: function(){
			this.popDialog.close().remove();
			var d = dialog({
				content:$("#editPasswordTpl").html(),
				title:"密码修改",
				width:420,
				height:140,
				fixed: true,
				okValue: '确&nbsp;&nbsp;定',
				ok: function () {
					//验证新密码是否符合规则
					var str ="";
					if($.trim($("#formerPwd").val()).length == 0 ||  $.trim($("#formerPwd").val()).length == 0){
						str= "原密码不能为空！";
						$("#formerPwd").select();
					}else if($.trim($("#pwd1").val()).length == 0 ||  $.trim($("#pwd1").val()).length == 0){
						str= "密码不能为空！";
						$("#pwd1").select();
					}else if($.trim($("#pwd1").val()).length < 6 ||  $.trim($("#pwd1").val()).length < 6){
						str= "密码需大于6位！";
					}else if($("#pwd1").val() != $("#pwd2").val()){
						str= "两次输入的密码不一致！";
					}else{
						$.ajax({
							type:"post",
							url: $("#basePath").val()+"/admin/user/user/checkUserPass.json",
							data: {
								userPass:$("#formerPwd").val(),
								userPwd2:$("#pwd2").val()
							},
							dataType: "json",
							success: function(data){
								if(data.success){
									//开始提交表单
									$.ajax({
										type:"post",
										url: $("#basePath").val()+"/admin/user/user/editPwd.json",
										data: {userPass:$("#pwd2").val()},
										dataType: "json",
										success: function(data){
											if(data.success){
												Yt.tips("密码修改成功！请重新登录",function(){
													window.location.href=$("#basePath").val()+"/pub/login/logout.do";
												});
											}
										}
									});
									return true;
								}else{
									if(data.message == "0"){
										str ="新密码不能跟原密码相同！";
									}else{
										str ="原密码不正确！";
									}

									Yt.tips(str);
									$("#pwd1").focus();
									return false;
								}
							}
						});
					}
					if(str.length > 0){
						var d = dialog({
							content: "<span style='color:red'>"+str+"</span>",
							quickClose: true
						});
						d.show(document.getElementById('password2'));
						setTimeout(function () {
							d.close().remove();
						}, 2000);
					}
					return false;
				},
				quickClose: true
			});
			d.showModal();
		},

		// 系统设置
		configs: function(){
			var that = this,
				configWrap = null;

			that.popDialog = dialog({
				align: 'bottom right',
				quickClose: true,
				padding:2,
				width:170,
				content:$("#sysConfigTpl").html()
			});
			that.popDialog.show(document.getElementById('setupBtn'));


			configWrap = $("#configWrap");
			configWrap.find("#editPasswordBtn").click(function(){
				that.editPassword();
			});
			configWrap.find("#setPriceCheckbox").click(function(){
				that.setPriceStutas($(this));
			});

			configWrap.find("#loginOutBtn").click(function(){
				Yt.confirm("您确定要退出系统吗？",function(){
					window.location.href=$("#basePath").val()+"/pub/login/logout.do";
				});
			});
		},

		// 设置价格显示隐藏 0显示 1隐藏
		setPriceStutas: function(target){
			var hidePriceVal = 0,
				priceCheckbox = target;

			if(priceCheckbox.hasClass("active")){
				hidePriceVal = 1;
				priceCheckbox.removeClass("active");
				priceCheckbox.find("i").html("&#xe65e;");
			}else{
				hidePriceVal = 0;
				priceCheckbox.addClass("active");
				priceCheckbox.find("i").html("&#xe65d;");
			}

			Yt.post($("#basePath").val()+"/admin/user/user/togglePriceInfo.json", {hidePriceInfo:hidePriceVal}, function(data){
				window.location.reload();
			});
		}

	};

	$("#sysConfigBtn").click(function(){
		top.configs();
	});

	$("#aboutClose").click(function(){
		$("#aboutWrap").hide();
	});

	$("#aboutBtn").click(function(){
		$("#aboutWrap").show();
	});

	$("#setupBtn").click(function(){
		top.configs();
	});

//	$(document).ready(function(){
//		Yt.get($("#basePath").val()+"/admin/notice/getNewNotice.json",{},function(data){
//			var notice=data.data;
//			if(notice && notice.title){
//				if(notice.title.length > 22){
//					var content='<a href="'+$("#basePath").val()+'/admin/notice/shopNoticeList.do?id='+notice.id+'">'
//					content=content+'<marquee direction="left" behavior="scroll" scrollamount="10" scrolldelay="200">';
//					content=content+notice.title;
//					content=content+'</marquee></a>';
//					$("#topNotice").append(content);
//				}else{
//					$("#topNotice").append('<a href="'+$("#basePath").val()+'/admin/notice/shopNoticeList.do">'+notice.title+'</a>');
//				}
//			}
//
//		});
//	});

});



