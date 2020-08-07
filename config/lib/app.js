/**
 * Module Dependencies
 */
const express = require('./express');
const mongooseService = require('./mongoose');
const config = require('../config');
const chalk = require('chalk');
const crontabService = require('./crontab');
const seed = require('./mongo-seed');

/**
 * Mongo-Seed start
 */
function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.red('Warning: Database seeding is turned on'));
    seed.start();
  }
}

/**
 * Application initialize
 */
exports.init = function(callback) {
  mongooseService.connect((db) => {

    /** Initialize Models */
    mongooseService.loadModels(seedDB);

    /** Crontab start */
    // crontabService.start();

    /** Initialize express */
    const app = express.init(db);

    if (callback) {
      callback(app, db, config);
    }
  });
};

/**
 * Application start
 */
exports.start = function() {
  this.init((app, db, config) => {
    /** Start the app by listening on <port> at <host> */
    app.listen(config.port, config.host, () => {
      /** Logging initialization */
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log();
      console.log(chalk.green(`Environment: ${process.env.NODE_ENV}`));
      console.log(chalk.green(`Server: ${(process.env.NODE_ENV === 'secure' ? 'https://' : 'http://')}${config.host}:${config.port}`));
      console.log(chalk.green(`Database: ${config.db.uri}`));
      console.log(chalk.green(`App version: ${config.version}`));
      console.log('--');
    });
  });
};
