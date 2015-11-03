import $ from "jquery";
import _ from "lodash";
import Backbone from "backbone";
import React from "react";
import classnames from "classnames";
import utils from "../../shared/utils";
import env from "../../shared/env";
import ga from "../../shared/ga";
import webviewRoot from "../../shared/webview";
import "../../shared/showTitle";
import Comments from "../models/comment";
import CommentList from "./comment_list";

if (webviewRoot && webviewRoot.isLogin) {
  let userinfo = webviewRoot.isLogin();
  let params = {
    reportId: $("body").data("reportid")
  };
  if (userinfo) {
    let user = JSON.parse(userinfo);
    _.extend(params, {
      userId: user.userId,
      token: user.userToken
    });
  }
  let comments = new Comments();
  comments.setParams(params);

  class Main extends React.Component {
    constructor(props) {
      super(props);
      this.state = {write: false};
    }
    componentDidMount() {
      this._boundForceUpdate = this.forceUpdate.bind(this, null);
      this.props.model.on("sync comment:add", this._boundForceUpdate, this);
      this.props.model.on("comment:add", this.scrollTop, this);
      $(window).on("scroll.comment", _.debounce(this.onPageScroll, 50).bind(this));
      window.setUserInfo = this.setUserInfo.bind(this);
      this.fetchData();
    }
    componentWillUnmount() {
      this.props.model.off("sync comment:add", this._boundForceUpdate);
      this.props.model.off("comment:add", this.scrollTop);
      $(window).off("scroll.comment");
    }
    componentDidUpdate() {
      this.fetchData();
    }
    scrollTop() {
      window.scrollTo(0, 0);
      React.findDOMNode(this.refs.comment).value = "";
    }
    writeComment() {
      this.setState({write: true}, () => {
        React.findDOMNode(this.refs.comment).focus();
      });
    }
    addComment(e) {
      e.preventDefault();
      webviewRoot._get_user();
    }
    submitComment(user) {
      this.props.model.setParams({
        userId: user.userId,
        token: user.userToken
      });
      let comment = React.findDOMNode(this.refs.comment).value;
      if (comment) {
        this.props.model.addComment(comment);
        ga.trackEvent(["图文详情页|发布评论"]);
      }
    }
    setUserInfo(userinfo) {
      let user = JSON.parse(userinfo);
      this.submitComment(user);
    }
    onPageScroll() {
      this.fetchData();
    }
    fetchData() {
      let waitingNode = React.findDOMNode(this.refs.loading);
      if (!$(waitingNode).hasClass("hide") && utils.insideViewport(waitingNode)) {
        this.props.model.fetchData();
      }
    }
    render() {
      let model = this.props.model;
      let data = this.props.model.toJSON();

      return (
        <div>
          <CommentList model={this.props.model} />
          <p className={classnames({
            "t-none": true,
            "hide": !(model.index === 1 && model.list.length === 0)
          })}>
            暂无评论，赶紧写下第一条评论吧
          </p>
          <div
            ref="loading"
            className={classnames({
              "t-loading": true,
              "hide": data.list && data.list.length === 0
            })}
          >
            <em></em>
          </div>
          <form
            method="post"
            className={classnames({
              "t-footer": true,
              "t-editable": this.state.write
            })}
            onSubmit={this.addComment.bind(this)}
          >
            <div className="t-focus">
              <input
                type="text"
                name="comment"
                ref="comment"
                autoComplete="off"
              /><span
                className="t-add"
                onClick={this.addComment.bind(this)}
              >
                评论
              </span>
            </div>
            <div
              className="t-blur"
              onClick={this.writeComment.bind(this)}
            >
              <div className="t-write"><em></em></div>
              <span>立即评论...</span>
            </div>
          </form>
        </div>
      );
    }
  }

  React.render(
    <Main model={comments} />,
    $(".t-main")[0]
  );
}
