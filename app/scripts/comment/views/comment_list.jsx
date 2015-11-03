import React from "react";

export default class CommentList extends React.Component {
  render() {
    let comments = this.props.model.list.reduce((accum, comment) => {
      accum.push(
        <li className="t-comment clearfix" key={comment.createTime}>
          <div className="t-left left">
            <img className="t-head" src={comment.userHeadImgUrl} alt=""/>
            <p className="t-floor">{comment.step}楼</p>
          </div>
          <div className="t-right left">
            <p className="t-title clearfix">
              <span className="t-name left">{comment.userName}</span>
              <span className="t-time right">{comment.showTime}</span>
            </p>
            <p className="t-content">
              {comment.content}
            </p>
          </div>
        </li>
      );
      return accum;
    }, []);
    return (
      <ul className="t-comments">
        {comments}
      </ul>
    );
  }
}
