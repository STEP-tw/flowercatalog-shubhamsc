const http = require('http');
const fs = require('fs');
const webApp = require('./webApp.js');
const logRequest = require('./logRequest').logRequest;
const commentHandler = require('./commentHandler.js');
commentHandler.readComments();
const PORT = 8888;

const registeredUsers = [{
  userName: 'shubham',
  password: 1234
}, {
  userName: 'singh',
  password: 123
}];


let app = webApp();

const loadUser = function (req, res) {
  let sessionId = req.cookie.sessionId;
  let user = registeredUsers.find(regUser => regUser.sessionId == sessionId);
  if (sessionId && user) {
    req.user = user;
  }
};

const sendToHome = function(req,res){
  req.url = '/home.html';
};

const loginUserSendToGuestBook = function (req, res) {
  if (req.url=='/login' && req.user)
    res.redirect('/guestBook');
};

const logoutUserSendToLogin = function (req, res) {
  if (['/guestBook','login'].includes(req.url) && !req.user){
    res.redirect('/login');
  }
};

const getLogin = function (req, res) {
  let error = req.cookie.error || '';
  res.statusCode = 200;
  res.setHeader('content-type', 'text/html');
  if (error)
  res.setHeader('Set-Cookie', [`error=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
  `userName=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`])
  fs.readFile('./public/login.html', 'utf8', (err, data) => {
    if (err) console.log(err);
    data = data.replace(/LOGIN_ERROR/, error);
    res.write(data);
    res.end();
  });
};

const getValidUser = function(req,res){
  return registeredUsers.find(function (regUser) {
    return regUser.userName == req.body.name && regUser.password == req.body.password;
  });
};

const showLoginFailed = function(res){
  res.setHeader('Set-Cookie', `error=Invalid user or password`);
  res.redirect('/login');
};

const postLogin = function (req, res) {
  let user = getValidUser(req,res);
  if (!user) {
    showLoginFailed(res);
    return;
  }
  let sessionId = new Date().getTime();
  res.setHeader('Set-Cookie', [`sessionId=${sessionId}`,`userName=${user.userName}`]);
  user.sessionId = sessionId;
  res.redirect('/guestBook');
};

const getLogout = function (req, res) {
  res.setHeader('Set-Cookie', [`sessionId=0; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
  `userName=''; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`]);
  res.redirect('/')
};

const addComment = function(req,res){
    let comment = req.body;
    comment.name = req.cookie.userName;
    commentHandler.writeComments(comment);
    res.redirect('/guestBook');
};

const getTypes = function(extn){
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

const showContents = function(req,res,data){
  let extn = req.url.split('.').pop();
  let type = getTypes(extn);
  res.statusCode = 200;
  res.setHeader('Content-Type',type);
  res.write(data);
  res.end();
};

const displayPage = function (req, res) {
  if(req.url=='/login') return;
  if(req.url=='/guestBook') return;
  fs.readFile(`./public${req.url}`, (err, data) => {
    if (err) return res.pageNotFound();
    showContents(req,res,data);
  });
};

const ignorePage = function (req, res) {
  res.end();
};

const viewCommnetsOnly = function(req,res){
  let comments = commentHandler.getUserComments();  
  res.statusCode = 200;
  res.setHeader('content-type', 'text/html');
  fs.readFile('./public/viewComments.html', 'utf8', (err, data) => {
    if (err) console.log(err);
    data = data.replace(/USERCOMMENTS/,comments);
    res.write(data);
    res.end();
  });
};


const showAddNewComments = function(req,res,userName){
  let comments = commentHandler.getUserComments();    
  res.statusCode = 200;
  res.setHeader('content-type', 'text/html');
  fs.readFile('./public/guestBook.html', 'utf8', (err, data) => {
    if (err) console.log(err);
    data = data.replace(/user_name/,userName);
    data = data.replace(/USER_NAME/,`Welcome: ${userName}`);
    data = data.replace(/USERCOMMENTS/,comments);    
    res.write(data);
    res.end();
  });
};

const serveGuestBook = function(req,res){
  let userName = req.cookie.userName || '';
  if(userName){
    showAddNewComments(req,res,userName);
    return ;
  } 
  viewCommnetsOnly(req,res);
};

app.use(logRequest);
app.use(loadUser);
app.use(loginUserSendToGuestBook);
// app.use(logoutUserSendToLogin);
app.get('/',sendToHome);
app.get('/fevicon.ico',ignorePage);
app.get('/login', getLogin);
app.post('/login', postLogin);
app.get('/guestBook',serveGuestBook);
app.post('/submitComment',addComment);
app.get('/logout', getLogout);
app.postServe(displayPage);

let server = http.createServer(app);
server.listen(PORT, () => console.log(`listening at ${PORT}`));