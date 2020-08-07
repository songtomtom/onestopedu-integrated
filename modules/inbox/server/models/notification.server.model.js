/**
 * Module Dependencies
 */
const mongoose = require('mongoose');

/**
 * Schema
 */
const NotificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  readUsers: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  permissionRoles: {
    type: [{
      type: String,
      enum: ['tutor', 'tutor-manager', 'cs-manager', 'admin', 'creator']
    }],
    default: ['creator', 'admin']
  },
  notificationType: {
    type: String,
    enum: ['success', 'info', 'error', 'warning']
  },
  stateName: {
    type: String
  },
  params: {},
  message: {
    type: String,
    default: '',
    required: 'Messages cannot be blank'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Schema Compile
 */
mongoose.model('Notification', NotificationSchema, 'inboxs.notifications');
