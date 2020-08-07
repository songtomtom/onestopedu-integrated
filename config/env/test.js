/**
 * Module Dependencies
 */
const defaultEnv = require('./default');

/**
 * Module Exports
 */
module.exports = {
  app: {
    title: `${defaultEnv.app.title} - Test Environment`
  },
  port: process.env.PORT || 3001,
  db: {
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost'}/test`,
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || `${defaultEnv.db.test.user}:${defaultEnv.db.test.password}@${defaultEnv.db.host}`}/test`,
    options: {},
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    format: 'dev',
    fileLogger: {
      directoryPath: `${process.cwd()}/logs`,
      fileName: 'app-test.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  mailer: {
    from: process.env.MAILER_FROM || 'onestopedu',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'kevin@1stopasia.com',
        pass: process.env.MAILER_PASSWORD || 'qw9982asdqw!@'
      }
    }
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'true'
    },
    collections: [{
      model: 'User',
      docs: [{
        overwrite: true,
        data: {
          username: 'seedadmin',
          email: 'admin@localhost.com',
          firstName: 'Admin',
          lastName: 'Local',
          roles: ['admin', 'user']
        }
      }, {
        overwrite: true,
        data: {
          username: 'seeduser',
          email: 'user@localhost.com',
          firstName: 'User',
          lastName: 'Local',
          roles: ['user']
        }
      }]
    }, {
      model: 'Article',
      docs: [{
        overwrite: true,
        data: {
          title: 'Test Article',
          content: 'Code coverage test article!'
        }
      }]
    }]
  }
};
