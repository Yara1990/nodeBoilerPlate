var fs = require('fs');
var path = require('path');

var lib = {};

//base dir of data folder
lib.baseDir = path.join(__dirname, '/../.data/');
lib.check = function() {
  console.log('in data filder');
};

lib.create = function(dir, file, data, callback) {
  //open file for writing
  fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function(err, fileDescriptor) {
    if (!err && fileDescriptor) {
      //convert data to stringi
      var stringData = JSON.stringify(data);

      //write to file and close it
      fs.writeFile(fileDescriptor, stringData, function(err) {
        if (!err) {
          fs.close(fileDescriptor, function(err) {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing new file');
            }
          });
        } else {
          callback('Error writing to a new file');
        }
      });

    } else {
      callback('Could not create new file. it may already exist')
    }
  });
};

//Read data from File
lib.read = function(dir, file, callback) {
  fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data) {
    callback(err, data);
  });

};

lib.update = function(dir, file, data, callback) {
  fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function(err, fileDescriptor) {
    if (!err && fileDescriptor) {
      var stringData = JSON.stringify(data);

      fs.truncate(fileDescriptor, function(err) {
        if (!err) {
          //write to the file and close it
          fs.writeFile(fileDescriptor, stringData, function(err) {
            if (!err) {
              fs.close(fileDescriptor, function(err) {
                if (!err) {
                  callback(false);
                } else {
                  callback('Error closing the file');
                }
              });
            } else {
              callback('Error writing to existing file');
            }
          });
        } else {
          callback('Error truncating the file');
        }
      });
    } else {
      callback('Could not create new file. it may already exist');
    }
  });
};

//Deleting a file

lib.delete = function(dir, file, callback) {
  fs.unlink(lib.baseDir + dir + '/' + file + '.json', function(err) {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting file');
    }
  });
}

module.exports = lib;