/**
 * Module Dependencies
 */
const config = require('../config');
const _ = require('lodash');
const chalk = require('chalk');
const path = require('path');
const mongoose = require('mongoose');


/**
 * Loading server models
 */
exports.loadModels = function(callback) {
  config.files.server.models.forEach((modelPath) => {
    require(path.resolve(modelPath));
  });

  if (callback) {
    callback();
  }
};

/**
 * Connect MongoDB
 */
exports.connect = function(callback) {
  mongoose.Promise = config.db.promise;

  mongoose.plugin((schema) => {
    schema.options.usePushEach = true;
  });

  const options = _.merge(config.db.options || {}, {
    useMongoClient: true
  });

  mongoose.connect(config.db.uri, options)
    .then((connection) => {

      /** Enabling mongoose debug mode if required */
      mongoose.set('debug', config.db.debug);

      if (callback) {
        callback(connection.db);
      }
    })
    .catch((err) => {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    });
};

/**
 * Disconnect MongoDB
 */
exports.disconnect = function(callback) {
  mongoose.connection.db.close((err) => {
    console.info(chalk.yellow('Disconnected from MongoDB.'));
    return callback(err);
  });
};
