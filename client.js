#!/usr/bin/env node

var request = require("request")
  , url = process.argv[2]
  , requestType = process.argv[3]
  , method;

switch (requestType) {
  case 'get':
  case 'post':
  case 'put':
    break;
  case 'delete':
    requestType = 'del';
    break;
  default:
    requestType = 'get';
}

method = request[requestType];

method('http://localhost:3000' + url, function(error, response, body) {
  if (!error) {
    console.log('STATUS:' + response.statusCode);
    console.log('METHOD:' + response.req.method + '\n');
    console.log('BODY:\n' + response.body);
  } else {
    console.log('ERROR:\n' + error.message);
  }
});