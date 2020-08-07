/**
 * Module Dependencies
 */
const path = require('path');
const errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const mongoose = require('mongoose');
const passport = require('passport');
const fs = require('fs');
const multer = require('multer');
const config = require(path.resolve('./config/config'));
const User = mongoose.model('User');

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      res.status(422).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      req.login(user, (err) => {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Show the current user
 */
exports.read = function(req, res) {
  const profile = req.profile ? req.profile.toJSON() : {};
  res.json(profile);
};

/**
 * Change Password
 */
exports.changePassword = function(req, res, next) {
  // Init Variables
  const passwordDetails = req.body;
  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, (err, user) => {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;
              user.save((err, user) => {
                if (err) {
                  return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, (err) => {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(422).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(422).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(422).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(401).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update user details
 */
exports.update = function update(req, res) {
  // Merge existing user
  const user = _.extend(req.user, req.body);
  if (user) {
    user.updated = Date.now();
    user.save((err) => {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, (err) => {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function(req, res) {
  const user = req.user;
  const upload = multer({
    storage: multer.diskStorage({
      destination: config.uploads[req.body.uploadType].dest
    })
  }).single('newProfilePicture');
  upload.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;

  if (user) {
    upload(req, res, (uploadError) => {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading image files'
        });
      }
      const existingImage = `./public/${user.profileImage}`;

      if (fs.existsSync(existingImage)) {
        fs.unlinkSync(existingImage);
      }

      user.profileImage = `uploads/profiles/${req.file.filename}`;
      user.save((err) => {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          req.login(user, (err) => {
            if (err) {
              res.status(400).send(err);
            } else {
              res.json(user);
            }
          });
        }
      });

    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

/**
 * User middleware
 */
exports.userById = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) {
        return next(err);
      } else if (!user) {
        return next(new Error(`Failed to load User ${id}`));
      }

      req.profile = user;
      next();
    });
};
