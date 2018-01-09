const Comment = function(){
  this.comment = {};
};

Comment.prototype.addComment = function(name,comment){
  this.comment.name = name;
  this.comment.comment = comment;
  this.comment.date = new Date().toDateString();
  this.comment.time = new Date().toLocaleTimeString();
};

Comment.prototype.getComment = function(){
  return this.comment;
}

module.exports = Comment;
