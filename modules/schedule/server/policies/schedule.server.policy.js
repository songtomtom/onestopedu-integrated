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
      resources: '/api/schedule',
      permissions: '*'
    }, {
      resources: '/api/schedule/:scheduleId',
      permissions: '*'
    }, {
      resources: '/api/schedule/day/:day',
      permissions: '*'
    }, {
      resources: '/api/schedule/member/:memberId',
      permissions: '*'
    }, {
      resources: '/api/schedule/tutor/:tutorId',
      permissions: '*'
    }, {
      resources: '/api/schedule/tutor/possible',
      permissions: '*'
    }]
  }]);
};

/**
 * Check if policy allows
 */
exports.isAllowed = function(req, res, next) {
  const roles = (req.user) ? req.user.roles : ['guest'];

  /**
   * Check for user roles
   */
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), (err, isAllowed) => {
    if (err) {

      /**
       * An authorization error occurred
       */
      return res.status(500).send('Unexpected authorization error');
    }

    if (isAllowed) {

      /**
       * Access granted! Invoke next middleware
       */
      return next();
    } else {
      return res.status(403).json({
        message: 'User is not authorized'
      });
    }

  });
};
