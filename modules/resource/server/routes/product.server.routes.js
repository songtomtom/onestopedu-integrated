/**
 * Module Dependencies
 */
const product = require('../controllers/product.server.controller');
const productPolicy = require('../policies/product.server.policy');

/**
 * Product route configuration
 */
module.exports = function(app) {
  app.route('/api/product')
    .get(productPolicy.isAllowed, product.list)
    .post(productPolicy.isAllowed, product.create);

  app.route('/api/product/:productId')
    .get(productPolicy.isAllowed, product.read)
    .put(productPolicy.isAllowed, product.update)
    .delete(productPolicy.isAllowed, product.remove);

  app.param('productId', product.productById);
};
