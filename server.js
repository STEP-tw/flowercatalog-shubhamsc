const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const PORT = 8000;
const commentHandler = require('./commentHandler.js');
commentHandler.readComments();

let showError = function(res){
  res.statusCode = 404;
  res.end();
};

let showContents = function(filePath,res,data){
  let extn = filePath.split('.').pop();
  let type = getTypes(extn);
  res.statusCode = 200;
  res.setHeader('Content-Type',type);
  res.write(data);
  res.end();
}

let displayPage = function(filePath,res){
  fs.readFile('./public'+filePath,(err,data)=>{
    if(err) showError(res);
    else showContents(filePath,res,data);
  });
};

let getTypes = function(extn){
  let types = {
    html:'text/html',
    jpg:'image/jpg',
    gif:'image/gif',
    pdf:'application/pdf',
    css:'text/css',
    js:'text/javascript'
  };
  return types[extn];
};

let endResponse = function(res){
  res.end();
  return;
};

let redirectGuestBook = function(req,res){
  res.statusCode = 302;
  res.setHeader('Location','/guestBook.html');
  req.on('data',(data)=>{
    let comment = qs.parse(data.toString());
    commentHandler.writeComments(comment);
  });
  res.end();
  return ;
};

let isFevicon = function(filePath){
  return filePath == '/favicon.ico';
};

let isSubmitComment = function(filePath){
  return filePath == '/submitComment';
};

let requestHandler = function(req,res){
  console.log(req.url);
  debugger;
  let filePath = req.url=='/'?'/home.html':req.url;
  if(isFevicon(filePath)) endResponse(res);
  if(isSubmitComment(filePath)) redirectGuestBook(req,res);
  else displayPage(filePath,res);
};

let server = http.createServer(requestHandler);
server.listen(PORT);
console.log(`listening at :${PORT}`);
