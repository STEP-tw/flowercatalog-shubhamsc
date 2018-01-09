const Comment = require('./comment.js');
const Comments = function(){
  this.comments = [];
};

Comments.prototype.retrive = function(comments){
  this.comments = comments;
}

Comments.prototype.addComments = function(name,comment){
  let commentInfo = new Comment();
  commentInfo.addComment(name,comment);
  this.comments.unshift(commentInfo.getComment());
};

Comments.prototype.getComments = function(){
  return this.comments;
}

module.exports = Comments;
