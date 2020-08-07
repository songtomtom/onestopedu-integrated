/**
 * Module Dependencies
 */
const path = require('path');
const config = require(path.resolve('./config/config'));

/**
 * Get unique error field name
 */
function getUniqueErrorMessage(err) {
  let output;

  try {
    const fieldName = err.errmsg.substring(err.errmsg.lastIndexOf('.$') + 2, err.errmsg.lastIndexOf('_1'));
    output = `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)} already exists`;

  } catch (ex) {
    output = 'Unique field already exists';
  }

  return output;
}

/**
 * Get the error message from error object
 */
exports.getErrorMessage = function(err) {
  let message;
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = this.getUniqueErrorMessage(err);
        break;
      case 'UNSUPPORTED_MEDIA_TYPE':
        message = 'Unsupported filetype';
        break;
      case 'LIMIT_FILE_SIZE':
        message = `Image file too large. Maximum size allowed is ${(config.uploads.profile.image.limits.fileSize / (1024 * 1024)).toFixed(2)} Mb files.`;
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Missing `newProfilePicture` field';
        break;
      default:
        message = 'Something went wrong';
    }
  } else if (err.message && !err.errors) {
    message = err.message;
  } else {

    /**
     * Array.forEach(item, index, array)
     */
    err.errors.forEach((errMassage) => {
      if (errMassage) {
        message = errMassage;
      }
    });
  }

  return message;
};
