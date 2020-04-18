//containers for all the env
var environment = {};
environment.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging'
};

//production object
environment.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production'
};

//Determine which env was passed as a command line arg

var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check current env is defined or not

var environmentToExport = typeof(environment[currentEnv]) == 'object' ? environment[currentEnv] : environment.staging;
module.exports = environmentToExport;