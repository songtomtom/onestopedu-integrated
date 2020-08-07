/**
 * Module Dependencies
 */
const defaultEnv = require('./default');

/**
 * Module Exports
 */
module.exports = {
  secure: {
    ssl: false,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem',
    caBundle: './config/sslcerts/cabundle.crt'
  },
  app: {
    title: `${defaultEnv.app.title} - Production Environment`
  },
  port: process.env.PORT || 80,
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost'}/production`,
    options: {},
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    format: process.env.LOG_FORMAT || 'combined',
    fileLogger: {
      directoryPath: process.env.LOG_DIR_PATH || `${process.cwd()}/logs`,
      fileName: process.env.LOG_FILE || 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  mailer: {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
        pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
      }
    }
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false'
    },
    collections: [{
      model: 'Admin',
      docs: [{
        data: {
          username: 'kevin',
          email: 'kevin@1stopasia.com',
          mobile: '010-5541-7548',
          nickName: 'Kevin'
        },
        overwrite: true
      }, {
        data: {
          username: 'unam',
          email: 'unam@1stopasia.com',
          mobile: '010-9479-1898',
          nickName: 'Unam'
        },
        overwrite: true
      }, {
        data: {
          username: 'jisu',
          email: 'jisu@1stopasia.com',
          mobile: '010-4211-7990',
          nickName: 'Jisu'
        },
        overwrite: true
      }, {
        data: {
          username: 'sanghun',
          email: 'sanghun@1stopasia.com',
          mobile: '010-5406-7476',
          nickName: 'Sanghun'
        },
        overwrite: true
      }]
    }, {
      model: 'CSManager',
      docs: [{
        data: {
          username: 'young',
          email: 'young@1stopasia.com',
          mobile: '010-0000-0000',
          nickName: 'Young',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          username: 'alyssa',
          email: 'alyssa@1stopasia.com',
          mobile: '010-7788-5868',
          nickName: 'Alyssa',
          providers: ['onestopedu']
        },
        overwrite: true
      }]
    }, {
      model: 'Tutor',
      docs: [{
        data: {
          username: 'nicole',
          email: 'nicole@1stopasia.com',
          mobile: '010-0000-0000',
          nickName: 'Nicole',
          englishName: 'Nikoletta G',
          providers: ['onestopedu'],
          language: 'english',
          gender: 'female',
          nation: 'europe',
          callcenter: 'europe'
        },
        overwrite: true
      }, {
        data: {
          username: 'may',
          email: 'may@1stopasia.com',
          mobile: '010-0000-0000',
          nickName: 'May',
          englishName: 'May Clair',
          providers: ['onestopedu'],
          language: 'english',
          gender: 'female',
          nation: 'philippines',
          callcenter: 'philippines'
        },
        overwrite: true
      }, {
        data: {
          username: 'doyen',
          email: 'doyen@1stopasia.com',
          mobile: '010-0000-0000',
          nickName: 'Doyen',
          chineseName: '杜艳',
          providers: ['urichina'],
          language: 'chinese',
          gender: 'female',
          nation: 'china',
          callcenter: 'shenyang'
        },
        overwrite: true
      }]
    }, {
      model: 'Member',
      docs: [{
        data: {
          username: 'yeewo2000',
          email: 'yeewo6626@hanmail.net',
          mobile: '010-0000-0000',
          koreanName: '임주영',
          englishName: 'Kelly',
          providers: ['onestopedu'],
          skype: '01022331793'
        },
        overwrite: true
      }, {
        data: {
          username: 'tpgml4569',
          email: 'tpgml4569@naver.com',
          mobile: '010-5715-1793',
          koreanName: '김세희',
          englishName: 'Sarah',
          providers: ['onestopedu'],
          skype: 'itph77'
        },
        overwrite: true
      }, {
        data: {
          username: 'immyeongjin',
          email: 'immyeongjin@naver.com',
          mobile: '010-3465-0214',
          koreanName: '이명진',
          providers: ['urichina']
        },
        overwrite: true
      }]
    }, {
      model: 'ContactUs',
      docs: [{
        data: {
          providers: ['onestopedu'],
          title: 'Lorem ipsumsicing elit sed do eiusmod',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['onestopedu'],
          title: 'consectesadftur adipisicing elit Lorm dolor sit amet, consectetur adipisicing',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['onestopedu'],
          title: 'Lorem ipsuasdfdm dolor sit amet, consectetur adipisicing elit sed do eiusmod',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['urichina'],
          title: 'consectetur adipisicing elor sit amet, consectetur adipisicing',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['urichina'],
          title: 'Lorem ipsum dolor sit amwefet, consectetur adipisicing elit sed do eiusmod',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['urichina'],
          title: 'consectetur adipisicing12 elit Loreddm ipsadipisicing',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['hinihao'],
          title: 'Lorem ipsum doonsectetur adipisicing elvv2it sed do eiusmod',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['chinihao'],
          title: 'adipisicing elit Lorem ip adipisicing elit, sed do eiadipisicing',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }]
    }, {
      model: 'Notice',
      docs: [{
        data: {
          providers: ['onestopedu'],
          title: 'dolor sit amet, consecteturit',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['onestopedu'],
          title: 'consectetur adipisicing elit, Lorem ipsum dolor sit amet, tg elit, sed do eiusmod tempor incidi',
          contents: 'Lorem ipsum dolor sit amet, consectetelitg elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['onestopedu'],
          title: 'Loressm ipsum dolor sit amet, elit consectetur adipisicimod tempor incidid',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['onestopedu'],
          title: 'consectetur adipisicing elit, Lorem ipsum dolor sit amet, ',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['onestopedu'],
          title: 'Loressm ipsum dolor sit amet, conmod tempor incididing elit',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['urichina'],
          title: 'consectetur adipisicing elit, Lorem ipsum dolor sit amet, consectetur',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['urichina'],
          title: 'Loressm ipsum dolor sit amet, consectetur consectetur consectetur elit',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['urichina'],
          title: 'consectetur consectetur elit, Lorem ipsum dolor sit amet, ',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['urichina'],
          title: 'Loressm ipsum dolor sit amet, consectetur adipisicing elit eiusmodeiusmod',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['hinihao'],
          title: 'consectetur adipisicing elit, Lorem eiusmod dolor sit amet, ',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['hinihao'],
          title: 'Loressm ipsum dolor sit amet, consectetur eiusmod elit',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }, {
        data: {
          providers: ['chinihao'],
          title: 'consectetur eiusmod elit, Lorem ipsum dolor sit amet, ',
          contents: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        },
        overwrite: true
      }]
    }, {
      model: 'FAQ',
      docs: [{
        data: {
          question: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
          answer: 'sed do eiusmod tempor incididunt ut labore et dolore magna'
        },
        overwrite: true
      }, {
        data: {
          question: 'sed do eiusmod tempor incididunt ut labore et dolore magna adipisicing elit',
          answer: 'cupidatat non proident, sunt in culpa qui officia deserunt mollit anim'
        },
        overwrite: true
      }]
    }, {
      model: 'CourseReview',
      docs: [{
        data: {
          providers: ['onestopedu'],
          title: 'Lorem iasdasdpsum dolor sit amet, consectetur adipisicing elit',
          contents: 'sed do eiusmod tempor incididunt ut labore et dolore magna'
        },
        overwrite: true
      }, {
        data: {
          providers: ['onestopedu'],
          title: 'sed do eiusmod tempor incididunt ut laborasdasde et dolore magna adipisicing elit',
          contents: 'cupidatat non proident, sunt in culpa qui officia deserunt mollit anim'
        },
        overwrite: true
      }]
    }]
  }
};
