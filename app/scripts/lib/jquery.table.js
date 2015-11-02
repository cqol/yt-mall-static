/**
 * This jQuery plugin auto  generate table.
 *
 * This plugin needs at least jQuery 1.8.0
 *
 * @author lumeiqin
 * @version 1.0
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
(function($){
	$.Jtable = function(containers, opts){
		this.containers = containers;
		this.opts = opts;
	};

	$.extend($.Jtable.prototype, {
		generateHeader:function(){
			var columns = this.opts.columns,
				headerHtml = '',
				thHtml = '',
				thText = '';
			if(!columns) return;
			headerHtml += '<thead><tr>';
			for(var i=0; i<columns.length; i++){
				thText = columns[i].isCheckbox?'<input type="checkbox" id="selectAll" />' : columns[i].title;
				headerHtml += '<th width="'+columns[i].width+'" class="'+(columns[i].hcls || "")+'" data-field="'+columns[i].field+'" >'+thText+'</th>';
			}
			headerHtml += '</tr></thead>';
			this.containers.html(headerHtml);
		},

		generateTbody:function(){
			var that = this,
				source = this.opts.source,
				list = source.data,
				columns = this.opts.columns,
				tbodyHtml = "",
				trHtml;

			tbodyHtml += '<tbody>';
			if(list && list.length){
				for(var i=0; i< list.length; i++){
					tbodyHtml += this.generateTr(list[i], i);
				}
			}else{
				tbodyHtml += '<tr><td colspan="'+columns.length+'" align="center">暂无数据</td></tr>';
			}

			tbodyHtml += '</tbody>';
			this.containers.append(tbodyHtml);
			if(list && list.length){
				this.handerRender();
			}

			// 生成分页

			if(this.opts.pageContainer && source){
				if(list && list.length){
					this.opts.curpage = (this.opts.curpage || 1)-1;
					this.opts.pageContainer.pagination(source.totalCount, {
						items_per_page:this.opts.itemsPerPage,
						num_display_entries:8,
						current_page:that.opts.curpage,
						num_edge_entries:1,
						prev_text:"上一页",
						next_text:"下一页",
						jump_page:true,
						callback: function(pageIndex){
							that.opts.curpage = pageIndex;
							that.opts.pageCallback && typeof that.opts.pageCallback == "function" && that.opts.pageCallback(pageIndex);
						}
					});
					this.opts.pageContainer.show();
				}else{
					this.opts.pageContainer.hide();
				}
			}
			// 成功回调
			this.opts.successCallback && typeof this.opts.successCallback == "function" && this.opts.successCallback.call(that.containers);
		},

		generateTr: function(rowData, i){
			if(!rowData) return;
			var trBgClass = i%2 ? "even" : "odd";
			var columns = this.opts.columns,
				trHtml = '<tr class="'+trBgClass+'">',
				tdText = '',
			field = "";
			for(var i=0; i< columns.length; i++){
				field = columns[i].field;
				tdText = columns[i].isCheckbox?'<input type="checkbox" class="jt-checkbox" value="'+rowData[field]+'" />' : (rowData[field] || (rowData[field] === 0?0:""));
				trHtml += '<td class="'+(columns[i].cls || "")+'">'+tdText+'</td>';
			}
			trHtml += '</tr>';

			return trHtml;
		},

		handerRender:function(){
			var columns = this.opts.columns,
				source = this.opts.source,
				renderTd = null;
			this.containers.find("tbody>tr").each(function(index){
				for(var i=0; i< columns.length; i++){
					if(columns[i].render && typeof columns[i].render == "function"){
						renderTd = $(this).children("td:eq("+i+")");
						columns[i].render.call(renderTd, source.data[index]);
					}
				}
			});
		},

		bindEvent:function(){
			var containers = this.containers,
				selectAll = null;

			containers.on("click", ".jt-checkbox", function(){
				selectAll = containers.find("#selectAll");
				if(containers.find(".jt-checkbox").length == containers.find(".jt-checkbox:checked").length){
					selectAll.prop("checked", true);
				}else{
					selectAll.prop("checked", false);
				}

			});

			// 全选
			containers.on("click", "#selectAll", function(){
				containers.find(".jt-checkbox").prop("checked", $(this).prop("checked"));
			});
		}
	});


	// Extend jQuery
	$.fn.jtable = function(options){

		// Initialize options with default values
		//{
		//			width:0,
		//			field:"",
		//			title:"",
		//			cls:"",
		//			isCheckbox:false,
		//			render:null //function
		//		}
		var opts = jQuery.extend({
			columns:null,
			source:null,
			pageContainer:null,
			pageCallback:null,
			curpage:1,
			itemsPerPage:10,
			successCallback:null
		}, options);

		var containers = this,
			tableRender = new $.Jtable(containers, opts);

		tableRender.generateHeader();
		tableRender.generateTbody();
		tableRender.bindEvent();
	};

})(jQuery);
