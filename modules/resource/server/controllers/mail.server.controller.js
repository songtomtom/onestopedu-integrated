/**
 * Module Dependencies
 */
const path = require('path');
const mongoose = require('mongoose');
const config = require(path.resolve('./config/config'));
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const nodemailer = require('nodemailer');
const swig = require('swig');
const fs = require('fs');
const smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Send to email leveltest assessment
 */
exports.sendToTemplateByAssessment = function(req, res) {
  const user = req.profile;

  if (user) {

    fs.readFile(path.resolve(
      './modules/resource/server/templates/mail/',
      // user.providers[0] + '-assessment-mail.server.view.html'
      'duksung-assessment-mail.server.view.html'
    ), {
      encoding: 'utf-8'
    }, (fsErr, html) => {
      if (fsErr) {
        return res.status(400)
          .send(fsErr);
      }

      smtpTransport.sendMail({
        to: user.email,
        from: user.providers[0].toUpperCase() + config.mailer.from,
        subject: '레벨테스트 평가가 완료 되었습니다.',
        html: swig.compile(html)({
          userId: user._id
        })
      }, (sendErr, sendResponse) => {
        if (sendErr) {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }

        return res.json(sendResponse);
      });
    });

  } else {
    return res.status(401).send({
      message: 'User is not signed up'
    });
  }
};
