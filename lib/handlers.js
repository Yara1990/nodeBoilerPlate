var _data = require('./data')
var helpers = require('./helpers')
//Define handler
var handlers = {};
handlers.ping = function(data, callback) {
  //callback http status coad and a Payload
  callback(200);
};
//notFound Handler
handlers.notFound = function(data, callback) {
  callback(404);
};

handlers.users = function(data, callback) {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

//container private methods
handlers._users = {};

handlers._users.post = function(data, callback) {

  //Check that all req field are field out
  var firstName = typeof(data.payload.firstname) == 'string' && data.payload.firstname.trim().length > 0 ? data.payload.firstname.trim() : false;
  var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAggreement = typeof(data.payload.tosAggreement) == 'boolean' && data.payload.tosAggreement == true ? true : false;

  if (firstName && lastName && phone && password && tosAggreement) {

    _data.read('user', phone, function(err, data) {

      if (err) {
        var hashPassword = helpers.hash(password);

        if (hashPassword) {
          var userObject = {
            'firstName': firstname,
            'lastName': lastName,
            'phone': phone,
            'hashPassword': hashPassword,
            'tosAggreement': true
          };

          _data.create('user', phone, userObject, function(err) {

            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, {
                'ERROR': 'Could not create the new user'
              });
            }
          });

        } else {
          callback(500, {
            ERROR: 'Could not  hash the password'
          });
        }
      } else {
        callback(400, {
          'Error': 'User alredy exists'
        });
      }

    });

  } else {
    console.log("Missing Fields");
    callback(400, {
      'Error': 'Missing required fields'
    });
  }

};


handlers._users.get = function(data, callback) {

};

handlers._users.put = function(data, callback) {

};

handlers._users.delete = function(data, callback) {

};

module.exports = handlers;