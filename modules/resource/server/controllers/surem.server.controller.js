/**
 * Module Dependencies
 */
const path = require('path');
const mongoose = require('mongoose');
const config = require(path.resolve('./config/config'));
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const request = require('request');
const fs = require('fs');
const Surem = mongoose.model('Surem');

/**
 * Send to message
 */
exports.sendSMS = function(req, res) {

  const surem = new Surem(req.body);

  request({
    method: 'POST',
    uri: config.surem.url.SMS,
    body: {
      usercode: config.surem.usercode,
      deptcode: config.surem.deptcode,
      messages: [{
        to: surem.mobile
      }],
      text: surem.text,
      from: config.surem.from
    },
    json: true
  }, (err, suremResponse, suremBody) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    surem.response = suremBody;
    surem.save((err, savedSurem) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(savedSurem);
    });

  });
};

/**
 * Send to LMS
 */
exports.sendLMS = function(req, res) {

  const surem = new Surem(req.body);

  request({
    method: 'POST',
    uri: config.surem.url.LMS,
    body: {
      usercode: config.surem.usercode,
      deptcode: config.surem.deptcode,
      messages: [{
        to: surem.mobile
      }],
      text: surem.text,
      from: config.surem.from,
      subject: config.surem.providerName[surem.providers[0]]
    },
    json: true
  }, (err, suremResponse, suremBody) => {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    surem.response = suremBody;
    surem.save((err, savedSurem) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.json(savedSurem);
    });

  });

};

/**
 * List of Surems
 */
exports.list = function(req, res) {

  Surem.find()
    .populate('from')
    .populate('to')
    .sort('-created')
    .exec((err, surem) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(surem);
      }
    });
};
