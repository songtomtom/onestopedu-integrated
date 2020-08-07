/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const Product = mongoose.model('Product');

/**
 * Create an Product
 */
exports.create = function(req, res) {
  const product = new Product(req.body);
  product.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function(req, res) {
  const product = req.product ? req.product.toJSON() : {};
  res.json(product);
};

/**
 * Update an Product
 */
exports.update = function(req, res) {
  const product = _.extend(req.product, req.body);
  product.updated = Date.now();
  product.save((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Delete an Product
 */
exports.remove = function(req, res) {
  const product = req.product;
  product.remove((err) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function(req, res) {
  Product.find()
    .sort('-counters')
    .exec((err, products) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(products);
      }
    });
};

/**
 * Product middleware
 */
exports.productById = function productById(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'product is invalid'
    });
  }

  Product.findById(id)
    .exec((err, product) => {
      if (err) {
        return next(err);
      } else if (!product) {
        return res.status(404).send({
          message: 'No Product with that identifier has been found'
        });
      }
      req.product = product;
      next();
    });
};
