/**
 * Module Dependencies
 */
const _ = require('lodash');
const config = require('../config');
const mongoose = require('mongoose');
const chalk = require('chalk');

/**
 * MongoDB seed check start
 */
exports.start = function(seedConfig = {}) {
  return new Promise((resolve, reject) => {

    const options = seedConfig.options ||
      (config.seedDB ? _.clone(config.seedDB.options, true) : {});
    const collections = seedConfig.collections ||
      (config.seedDB ? _.clone(config.seedDB.collections, true) : []);

    if (!collections.length) {
      return resolve();
    }

    const seeds = collections.filter((collection) => {
      return collection.model;
    });

    /** Use the reduction pattern to ensure we process seeding in desired order. */
    seeds.reduce((pItem, item) => {
        return pItem.then(() => {
          return seed(item, options);
        });
      }, Promise.resolve())

      /** Start with resolved promise for initial previous (p) item */
      .then(onSuccess)
      .catch(onError);

    /**
     * Local promise success handlers
     */
    function onSuccess() {
      if (options.logResults) {
        console.log();
        console.log(chalk.bold.green('Database Seeding: Mongo Seed complete!'));
        console.log();
      }

      return resolve();
    }

    /**
     * Local promise error handlers
     */
    function onError(err) {
      if (options.logResults) {
        console.log();
        console.log(chalk.bold.red('Database Seeding: Mongo Seed Failed!'));
        console.log(chalk.bold.red(`Database Seeding: ${err}`));
        console.log();
      }

      return reject(err);
    }

  });
};

/**
 * MongoDB seed check
 */
function seed(collection = {}, options = {}) {

  /** Merge options with collection options */
  options = _.merge(options, collection.options);

  return new Promise((resolve, reject) => {

    const Model = mongoose.model(collection.model);
    const docs = collection.docs;
    const skipWhen = collection.skip ?
      collection.skip.when : null;

    if (!Model.seed) {
      return reject(new Error(`Database Seeding: Invalid Model Configuration - ${collection.model}.seed() not implemented`));
    }

    if (!docs || !docs.length) {
      return resolve();
    }

    /**
     * First check if we should skip this collection
     * based on the collection's "skip.when" option.
     * NOTE: If it exists, "skip.when" should be a qualified
     * Mongoose query that will be used with Model.find().
     */
    skipCollection()
      .then(seedDocuments)
      .then(() => {
        return resolve();
      })
      .catch((err) => {
        return reject(err);
      });

    function skipCollection() {
      return new Promise((resolve, reject) => {
        if (!skipWhen) {
          return resolve(false);
        }

        Model.find(skipWhen)
          .exec((err, results) => {
            if (err) {
              return reject(err);
            }

            if (results && results.length) {
              return resolve(true);
            }

            return resolve(false);
          });
      });
    }

    function seedDocuments(skipCollection) {
      return new Promise((resolve, reject) => {

        if (skipCollection) {
          return onSuccess([{
            message: chalk.yellow(`Database Seeding: ${collection.model} collection skipped`)
          }]);
        }

        const workload = docs
          .filter((doc) => {
            return doc.data;
          })
          .map((doc) => {
            return Model.seed(doc.data, {
              overwrite: doc.overwrite
            });
          });

        Promise.all(workload)
          .then(onSuccess)
          .catch(onError);

        /**
         * Local Closures
         */
        function onSuccess(responses) {
          if (options.logResults) {
            responses.forEach((response) => {
              if (response.message) {
                console.log(chalk.magenta(response.message));
              }
            });
          }

          return resolve();
        }

        function onError(err) {
          return reject(err);
        }
      });
    }
  });
}
