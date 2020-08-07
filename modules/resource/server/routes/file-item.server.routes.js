/**
 * Module Dependencies
 */
const fileItem = require('../controllers/file-item.server.controller');
const fileItemPolicy = require('../policies/file-item.server.policy');

/** Module Exports */
module.exports = function(app) {
  // File collection routes
  app.route('/api/file-item')
    .get(fileItemPolicy.isAllowed, fileItem.list)
    .post(fileItemPolicy.isAllowed, fileItem.create);

  app.route('/api/file-item/upload')
    .post(fileItemPolicy.isAllowed, fileItem.upload);

  app.route('/api/file-item/download/:fileItemId')
    .get(fileItemPolicy.isAllowed, fileItem.download);

  // Single File routes
  app.route('/api/file-item/:fileItemId')
    .get(fileItemPolicy.isAllowed, fileItem.read)
    .delete(fileItemPolicy.isAllowed, fileItem.remove);

  app.route('/api/file-item/many/remove')
    .post(fileItemPolicy.isAllowed, fileItem.removeMany);

  // Finish by binding the File middleware
  app.param('fileItemId', fileItem.fileItemById);
};
