const Comments = require('./comments.js');
const fs = require('fs');
let comments = new Comments();

const readComments = function(){
  fs.readFile('./data/comments.json','utf8',(err,data)=>{
    if(err) console.log(err);
    comments.retrive(JSON.parse(data));
  })
}

const getName = function(comment){
  return comment.name;
};

const getComment = function(comment){
  return comment.comment;
};

const getCommentInfo = function(commentInfo){
  let name = getName(commentInfo);
  let comment = getComment(commentInfo)
  comments.addComments(name,comment);
  return comments.getComments();
}

const writeComments = function(comment){
  let commentsInfo = getCommentInfo(comment);
  fs.writeFile('data/comments.json',JSON.stringify(commentsInfo),(err)=>{
    if(err) console.log(err);
  });
  fs.writeFile('./public/js/data.js',"var data = "+JSON.stringify(commentsInfo),(err)=>{if(err)console.log(err)});
};

exports.readComments = readComments;
exports.writeComments = writeComments;
