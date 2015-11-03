import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import env from "../../shared/env";

export default Backbone.Model.extend({
    params: {},
    list: [],
    index: 0,
    isFetching: false,
    setParams(options) {
        _.extend(this.params, options);
    },
    fetchData(options) {
        if (!this.isFetching) {
            this.setParams(options);
            this.fetch();
            this.isFetching = true;
        }
    },
    url() {
        let requestTime = _.isEmpty(this.toJSON()) ? "" : _.last(this.get("list")).createTime;
        return env.services.cms + env.apis.comment.getComment + "?pageSize=20&type=1&callback=?&" + $.param({
            requestTime: requestTime,
            targetId: this.params.reportId
        });
    },
    parse(resp) {
        this.isFetching = false;
        this.index++;
        this.list = this.list.concat(resp.data.list);
        return resp.data;
    },
    addComment(comment) {
        return $.ajax({
            url: env.services.cms + env.apis.comment.addComment,
            data: $.param({
                type: 1,
                id: this.params.reportId,
                userId: this.params.userId,
                content: encodeURIComponent(comment),
                token: this.params.token
            }),
            type: "POST"
        }).done(rs => {
            if (rs.code === 1000) {
                this.list.unshift(rs.data.comment);
                this.trigger("comment:add");
            }
        });
    }
});