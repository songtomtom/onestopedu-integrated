/**
 * Module Dependencies
 */
const talkDreamPolicy = require('../policies/talk-dream.server.policy');
const talkDream = require('../controllers/talk-dream.server.controller');

/**
 * Talk Dream route configuration
 */
module.exports = function(app) {
  app.route('/api/talk-dream')
    .get(talkDreamPolicy.isAllowed, talkDream.list);

  /**
   * 10003 Sign up member
   */
  app.route('/api/talk-dream/10003/:memberId')
    .get(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10003, talkDream.create);

  /**
   * 10004 Apply to leveltest(telephone)
   */
  app.route('/api/talk-dream/10004/:userId/:leveltestId')
    .get(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10004, talkDream.create);

  /**
   * 10005 Apply to leveltest(skype)
   */
  app.route('/api/talk-dream/10005/:userId/:leveltestId')
    .get(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10005, talkDream.create);

  /**
   * 10006 Apply to leveltest(screen board)
   */
  app.route('/api/talk-dream/10006/:userId/:leveltestId')
    .get(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10006, talkDream.create);

  /**
   * 10007 무료체험-10분전
   */
  // app.route('/api/talk-dream/10007')
  //   .post(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10007);

  /**
   * 10009 수강신청-카드결제
   */
  // app.route('/api/talk-dream/10009')
  //   .post(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10009);

  /**
   * 10010 수강신청-무통장입금
   */
  // app.route('/api/talk-dream/10010')
  //   .post(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10010);

  /**
   * 10011 수강신청-ARS결제
   */
  // app.route('/api/talk-dream/10011')
  //   .post(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10011);

  /**
   * 10012 수강신청-SMS결제
   */
  // app.route('/api/talk-dream/10012')
  //   .post(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10012);

  /**
   * 10016 수업 10분전
   */
  // app.route('/api/talk-dream/10016')
  //   .post(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10016);

  /*
   * 10024 무료체험-결과
   */
  app.route('/api/talk-dream/10024/:userId/:leveltestId')
    .post(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10024, talkDream.create);

  /**
   * 10032 피드백
   */
  // app.route('/api/talk-dream/10032')
  //   .post(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10032);

  /**
   * 10036 무료체험-N분전
   */
  // app.route('/api/talk-dream/10036')
  //   .post(talkDreamPolicy.isAllowed, talkDream.sendToTemplateBy10036);

};
