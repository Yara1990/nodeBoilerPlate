//This file is helping verious tasks
var crypto = require('crypto');
var config = require('./config');
//Containers for helpers
var helper = {};
//creating SHA256 hash
helper.hash = function(str) {
  if (typeof(str) == 'string' && str.length > 0) {
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str),
      digest(hex);
    return hash;
  } else {
    return false;
  }
}


module.exports = helper;