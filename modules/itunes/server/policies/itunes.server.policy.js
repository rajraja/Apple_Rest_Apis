'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Analytics Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [
      {
        resources: '/itunes',
        permissions: '*'
      },
      ]
    },
    {
      roles: ['superadmin'],
      allows: [
        {
          resources: '/itunes',
          permissions: '*'
        },
      ]
    },
    {
      roles: ['user'],
      allows: [
        {
          resources: '/itunes',
          permissions: '*'
        },
      ]
    },
  ]);
};

/**
 * Check If Analytics Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an analytic is being processed and the current user created it then allow any manipulation
  if (req.analytic && req.user && req.analytic.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        if(!req.user){//If user is not present
          return res.status(401).json({
            message: 'You need to signin to continue'
          });
        }
        else{
          return res.status(403).json({//this means user is present, but he does not have authorization
            message: 'User is not authorized'
          });
        }
      }
    }
  });
};
