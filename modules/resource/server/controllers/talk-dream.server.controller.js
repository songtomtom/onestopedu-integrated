/**
 * Module Dependencies
 */
const _ = require('lodash');
const path = require('path');
const mongoose = require('mongoose');
const config = require(path.resolve('./config/config'));
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const request = require('request');
const fs = require('fs');
const swig = require('swig');
const moment = require('moment');
const TalkDream = mongoose.model('TalkDream');

/**
 * Read and Complie template file
 */
function getMessage(templateOptions) {
  return new Promise((resolve, reject) => {
    fs.readFile('./modules/resource/server/templates/talk-dream/' + templateOptions.templateId + '-talk-dream.server.view.html', {
      encoding: 'utf-8'
    }, (err, html) => {
      if (err) {
        return reject(err);
      }
      templateOptions.message = swig.compile(html)(templateOptions.replacement);
      return resolve(templateOptions);
    });
  });
}

/**
 * Request Talk Dream RESTful API
 */
function requestAPI(templateOptions) {
  return new Promise((resolve, reject) => {

    // Deep copy
    const requestOptions = _.cloneDeep(config.talkDream.options);
    requestOptions.body = _.extend(requestOptions.body, {
      message: templateOptions.message,
      backupMessage: templateOptions.message,
      mobile: '01055417548',
      // mobile: user.mobile,
      template: templateOptions.templateId
    });

    if (templateOptions.buttons) {
      requestOptions.body.buttons = templateOptions.buttons;
    }

    request(requestOptions, (err, apiResponse) => {
      if (err) {
        return reject(err);
      }
      apiResponse.message = templateOptions.message;
      apiResponse.templateId = templateOptions.templateId;
      return resolve(apiResponse);
    });
  });
}

/**
 * Send message to sign up member
 */
exports.sendToTemplateBy10003 = function(req, res, next) {
  const member = req.member;

  if (member) {

    const templateOptions = {
      templateId: 10003,
      replacement: {
        shopName: config.talkDream.shopName[member.providers[0]] || 'K21',
        koreanName: member.koreanName
      },
      buttons: [{
        name: '무료체험 수업 바로가기',
        url: 'https://goo.gl/WNrQk3||https://goo.gl/WNrQk3'
      }, {
        name: '원스탑에듀 홈페이지',
        url: 'http://1stopedu.co.kr||http://1stopedu.co.kr'
      }]
    };

    getMessage(templateOptions)
      .then(requestAPI)
      .then((apiResponse) => {
        req.apiResponse = apiResponse;
        return next();
      })
      .catch((err) => {
        return res.status(422).send(err);
      });
  } else {
    return res.status(401).send({
      message: 'Member is not signed up'
    });
  }
};

/**
 * Send message to apply leveltest(telephone)
 */
exports.sendToTemplateBy10004 = function(req, res, next) {
  const user = req.profile;
  const leveltest = req.leveltest;

  if (user && leveltest) {

    moment.locale('ko');
    const templateOptions = {
      templateId: 10004,
      replacement: {
        shopName: config.talkDream.shopName[user.providers[0]] || 'K21',
        koreanName: user.koreanName,
        date: moment(leveltest.started).format('MMMM D일'),
        time: moment(leveltest.started).format('HH:mm')
      },
      buttons: [{
        name: '원스탑에듀 홈페이지',
        url: 'http://1stopedu.co.kr||http://1stopedu.co.kr'
      }]
    };

    getMessage(templateOptions)
      .then(requestAPI)
      .then((apiResponse) => {
        req.apiResponse = apiResponse;
        return next();
      })
      .catch((err) => {
        return res.status(422).send(err);
      });
  } else {
    return res.status(401).send({
      message: 'User and Leveltest is not signed up'
    });
  }
};

/**
 * Send message to apply leveltest(skype)
 */
exports.sendToTemplateBy10005 = function(req, res, next) {
  const user = req.profile;
  const leveltest = req.leveltest;

  if (user && leveltest) {

    moment.locale('ko');
    const templateOptions = {
      templateId: 10005,
      replacement: {
        shopName: config.talkDream.shopName[user.providers[0]] || 'K21',
        koreanName: user.koreanName,
        date: moment(leveltest.started).format('MMMM D일'),
        time: moment(leveltest.started).format('HH:mm')
      },
      buttons: [{
        name: '스카이프 설치 안내',
        url: 'http://www.1stopedu.co.kr/onestopedu/sub/help/notice.view.php?idx=95||http://www.1stopedu.co.kr/onestopedu/sub/help/notice.view.php?idx=95'
      }, {
        name: '원스탑에듀 홈페이지',
        url: 'http://1stopedu.co.kr||http://1stopedu.co.kr'
      }]
    };

    getMessage(templateOptions)
      .then(requestAPI)
      .then((apiResponse) => {
        req.apiResponse = apiResponse;
        return next();
      })
      .catch((err) => {
        return res.status(422).send(err);
      });
  } else {
    return res.status(401).send({
      message: 'User and Leveltest is not signed up'
    });
  }
};

/**
 * Send message to apply leveltest(screen board)
 */
exports.sendToTemplateBy10006 = function(req, res, next) {
  const user = req.profile;
  const leveltest = req.leveltest;

  if (user && leveltest) {

    moment.locale('ko');
    const templateOptions = {
      templateId: 10006,
      replacement: {
        shopName: config.talkDream.shopName[user.providers[0]] || 'K21',
        koreanName: user.koreanName,
        date: moment(leveltest.started).format('MMMM D일'),
        time: moment(leveltest.started).format('HH:mm')
      },
      buttons: [{
        name: '화상칠판 설치 안내',
        url: 'http://www.1stopedu.co.kr/onestopedu/sub/help/notice.view.php?idx=94||http://www.1stopedu.co.kr/onestopedu/sub/help/notice.view.php?idx=94'
      }, {
        name: '원스탑에듀 홈페이지',
        url: 'http://1stopedu.co.kr||http://1stopedu.co.kr'
      }]
    };

    getMessage(templateOptions)
      .then(requestAPI)
      .then((apiResponse) => {
        req.apiResponse = apiResponse;
        return next();
      })
      .catch((err) => {
        return res.status(422).send(err);
      });
  } else {
    return res.status(401).send({
      message: 'User and Leveltest is not signed up'
    });
  }
};


/**
 * Send message to apply leveltest(screen board)
 */
exports.sendToTemplateBy10024 = function(req, res, next) {
  const user = req.profile;
  const leveltest = req.leveltest;

  if (user && leveltest) {

    moment.locale('ko');
    const templateOptions = {
      templateId: 10024,
      replacement: {
        shopName: config.talkDream.shopName[user.providers[0]] || 'K21',
        koreanName: user.koreanName,
        date: moment(leveltest.started).format('MMMM D일'),
        time: moment(leveltest.started).format('HH:mm')
      },
      buttons: [{
        name: '무료 체험수업 결과 확인',
        url: 'http://1stopedu.co.kr/onestopedu/sub/' + leveltest._id + '||http://1stopedu.co.kr/onestopedu/sub/' + leveltest._id
      }]
    };

    getMessage(templateOptions)
      .then(requestAPI)
      .then((apiResponse) => {
        req.apiResponse = apiResponse;
        return next();
      })
      .catch((err) => {
        return res.status(422).send(err);
      });
  } else {
    return res.status(401).send({
      message: 'User and Leveltest is not signed up'
    });
  }
};


/**
 * Save an message send logs
 */
exports.create = function(req, res) {
  const user = req.member || req.guest || req.profile || {};
  const apiResponse = req.apiResponse;
  if (user && apiResponse) {

    const talkDream = new TalkDream({
      message: apiResponse.message,
      mobile: user.mobile,
      providers: user.providers,
      templateId: apiResponse.templateId,
      user: user._id
    });

    talkDream.statusErr = apiResponse.body.status || undefined;
    talkDream.statusKakao = apiResponse.body.status1 || undefined;
    talkDream.statusSMS = apiResponse.body.status2 || undefined;

    Object.keys(talkDream).forEach((key) => {
      if (!talkDream[key]) {
        delete talkDream[key];
      }
    });

    talkDream.save((err) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      return res.json(talkDream);
    });

  } else {
    return res.status(404).send({
      message: 'No user with that identifier has been found and api response does not exists'
    });
  }
};


/**
 * List of Talk dream
 */
exports.list = function(req, res) {
  TalkDream.find()
    .populate({
      path: 'user',
      select: '-password -salt'
    })
    .sort('-created')
    .exec((err, talkDreams) => {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(talkDreams);
      }
    });
};
