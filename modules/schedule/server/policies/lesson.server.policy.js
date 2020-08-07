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
      resources: '/api/lesson',
      permissions: '*'
    }, {
      resources: '/api/lesson/:lessonId',
      permissions: '*'
    }, {
      resources: '/api/lesson/next/:lessonId',
      permissions: '*'
    }, {
      resources: '/api/lesson/previous/:lessonId',
      permissions: '*'
    }, {
      resources: '/api/lesson/recent/:memberId',
      permissions: '*'
    }, {
      resources: '/api/lesson/member/:memberId',
      permissions: '*'
    }, {
      resources: '/api/lesson/course',
      permissions: '*'
    }, {
      resources: '/api/lesson/course/:courseId',
      permissions: '*'
    }, {
      resources: '/api/lesson/course/:courseId/:state',
      permissions: '*'
    }, {
      resources: '/api/lesson/postpone/:lessonId',
      permissions: '*'
    }, {
      resources: '/api/lesson/revert/:lessonId',
      permissions: '*'
    }, {
      resources: '/api/lesson/hold/:lessonId',
      permissions: '*'
    }, {
      resources: '/api/lesson/un-hold/:courseId',
      permissions: '*'
    }, {
      resources: '/api/lesson/date',
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
