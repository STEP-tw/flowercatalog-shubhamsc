const qs = require('querystring');
const initialize = function () {
  this._appHandlers = {
    GET: {},
    POST: {}
  };
  this._preProcess = [];
  this._postProcess = [];
};

const invoke = function (req, res) {
  let handler = this._appHandlers[req.method][req.url];
  if (handler) handler(req, res);
};

const redirect = function (path) {
  console.log(`redirecting to ${path}`);
  this.statusCode = 302;
  this.setHeader('location', path);
  this.end();
};

const getKeyValue = function (cookies) {
  let data = cookies.split('=');
  return {
    key: data[0],
    value: data[1]
  };
};

const cookieObj = function (obj, cookie) {
  obj[cookie.key] = cookie.value;
  return obj;
};

const parseCookie = function (cookie) {
  return cookie.split(';').map(getKeyValue).reduce(cookieObj, {}) || {};
};

const get = function (url, handler) {
  this._appHandlers.GET[url] = handler;
};

const post = function (url, handler) {
  this._appHandlers.POST[url] = handler;
};

const use = function (handler) {
  this._preProcess.push(handler);
};

const postServe = function(handler){
  this._postProcess.push(handler);
};

const main = function (req, res) {
  console.log(req.method, req.url);
  res.redirect = redirect.bind(res);
  req.cookie = parseCookie(req.headers.cookie || '');
  let contents = '';
  req.on('data', (data) => {
    contents += data.toString();
  });
  req.on('end', () => {
    req.body = qs.parse(contents);
    this._preProcess.forEach(middleware => {    
      if (res.finished) return;
      middleware(req, res);
    });
    if (!res.finished)    
    invoke.call(this, req, res);
    this._postProcess.forEach(lastware=>{
      if(res.finished) return;
      lastware(req,res);
    })
  });
};

const create = function () {
  let reqHandler = function (req, res) {
    main.call(reqHandler, req, res);
  };
  initialize.call(reqHandler);
  reqHandler.get = get;
  reqHandler.post = post;
  reqHandler.use = use;
  reqHandler.postServe = postServe;
  return reqHandler;
};

module.exports = create;