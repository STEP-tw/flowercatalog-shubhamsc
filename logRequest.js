const fs = require('fs');

const timeStamp = () => {
  let date = new Date();
  return `${date.toDateString()} ${date.toLocaleTimeString()}`;
};

const getToString = function (data) {
  return JSON.stringify(data, null, 2);
};

const logRequest = function (req, res) {
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS: ${getToString(req.headers)}`,
    `COOKIES: ${getToString(req.cookies)}`,
    `BODY: ${getToString(req.body)}`, ''
  ].join('\n');
  fs.appendFile('request.log', text, () => {});
};

exports.logRequest = logRequest;