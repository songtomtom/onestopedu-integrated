/**
 * Module Dependencies
 */
const passport = require('passport');
const User = require('mongoose').model('User');
const path = require('path');
const config = require(path.resolve('./config/config'));

/**
 * Passport configuration
 */
module.exports = function(app) {

  /** Serialize sessions */
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  /** Deserialize sessions */
  passport.deserializeUser((id, done) => {
    User.findOne({
        _id: id
      })
      .select('-salt -password')
      .exec((err, user) => {
        done(err, user);
      });

  });

  /** Initialize strategies */
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach((strategy) => {
    require(path.resolve(strategy))(config);
  });

  /** Add passport's middleware */
  app.use(passport.initialize());
  app.use(passport.session());
};
