/**
 * Module Dependencies
 */
const path = require('path');

/**
 * Render the index
 */
exports.renderIndex = function(req, res) {
  if (req.user) {
    res.render('modules/core/server/views/index', {
      user: req.user || null
    });
  } else {
    res.render('modules/core/server/views/signin');
  }
};

/**
 * 500 Error. Server Error
 */
exports.renderServerError = function(req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: '500 Error.'
  });
};

/**
 * 404 Error. Page not found
 */
exports.renderNotFound = function(req, res) {
  res.status(404).format({
    'text/html': () => {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': () => {
      res.json({
        error: 'Path not found'
      });
    },
    'default': () => {
      res.send('Path not found');
    }
  });
};
