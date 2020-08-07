/**
 * Module Dependencies
 */
let acl = require('acl');

/**
 * Using the memory backend
 */
acl = new acl(new acl.memoryBackend());

/**
 * Invoke permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['creator', 'admin', 'csManager', 'tutor', 'tutorManager'],
    allows: [{
      resources: '/api/talk-dream',
      permissions: '*'
    }, {

      /** 10003 Sign up member */
      resources: '/api/talk-dream/10003/:memberId',
      permissions: '*'
    }, {

      /** 10004 Apply to leveltest(telephone) */
      resources: '/api/talk-dream/10004/:userId/:leveltestId',
      permissions: '*'
    }, {

      /** 10005 Apply to leveltest(skype) */
      resources: '/api/talk-dream/10005/:userId/:leveltestId',
      permissions: '*'
    }, {

      /** 10006 Apply to leveltest(screen board) */
      resources: '/api/talk-dream/10006/:userId/:leveltestId',
      permissions: '*'
    }, {

      /** 10007 무료체험-10분전 */
      resources: '/api/talk-dream/10007',
      permissions: '*'
    }, {

      /** 10009 수강신청-카드결제 */
      resources: '/api/talk-dream/10009',
      permissions: '*'
    }, {

      /** 10010 수강신청-무통장입금 */
      resources: '/api/talk-dream/10010',
      permissions: '*'
    }, {

      /** 10011 수강신청-ARS결제 */
      resources: '/api/talk-dream/10011',
      permissions: '*'
    }, {

      /** 10012 수강신청-SMS결제 */
      resources: '/api/talk-dream/10012',
      permissions: '*'
    }, {

      /** 10016 수업 10분전 */
      resources: '/api/talk-dream/10016',
      permissions: '*'
    }, {

      /** 10024 무료체험-결과 */
      resources: '/api/talk-dream/10024',
      permissions: '*'
    }, {

      /** 10032 피드백 */
      resources: '/api/talk-dream/10032',
      permissions: '*'
    }, {

      /** 10036 무료체험-N분전 */
      resources: '/api/talk-dream/10036',
      permissions: '*'
    }]
  }]);
};

/**
 * Check if policy allows
 */
exports.isAllowed = function(req, res, next) {
  const roles = (req.user) ? req.user.roles : ['guest'];
  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    }

    if (isAllowed) {
      // Access granted! Invoke next middleware
      return next();
    } else {
      return res.status(403).json({
        message: 'User is not authorized'
      });
    }
  });
};
