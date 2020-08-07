/**
 * Module Exports
 */
module.exports = {
  app: {
    title: 'INTEGRATED',
    description: 'Education integrated administrator application'
  },
  host: process.env.HOST || '0.0.0.0',
  // host: process.env.HOST || '52.79.99.28',
  domain: process.env.DOMAIN || 'www.1-stopedu.com',
  templateEngine: 'swig',
  sessionCookie: {
    maxAge: 24 * (60 * 60 * 1000),
    httpOnly: true,
    secure: false
  },
  sessionSecret: process.env.SESSION_SECRET || 'INTEGRATED-SESSION-SECRET',
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  aws: {
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET
    }
  },
  illegalUsernames: [
    'integrated',
    '1-stopedu', '1stopedu', 'urichina', 'hinihao', 'chinihao',
    'administrator', 'admin',
    'user', 'anonymous', 'unknown',
    'tutor', 'guest', 'csm',
    'kevin',
    'password',
    'null', 'undefined',
    'api'
  ],
  db: {
    promise: global.Promise,
    host: '52.78.12.231',
    dev: {
      user: 'dev',
      password: 'fs7704dev11!#$'
    },
    test: {
      user: 'test',
      password: 'fs7704test11!#$'
    }
  },
  uploads: {
    dest: './public/uploads/',
    limits: {
      fileSize: 20 * 1024 * 1024
    }
  },
  shared: {
    owasp: {
      allowPassphrases: true,
      maxLength: 128,
      minLength: 10,
      minPhraseLength: 20,
      minOptionalTestsToPass: 4
    }
  },
  providers: ['onestopedu', 'urichina', 'duksung'],
  productType: ['telephone', 'skype', 'screenBoard', 'kakaoTalk'],
  surem: {
    usercode: 'k21inc',
    deptcode: '2L-O52-VB',
    url: {
      SMS: 'https://rest.surem.com/sms/v1/json',
      LMS: 'https://rest.surem.com/lms/v1/json'
    },
    providerName: {
      onestopedu: '원스탑에듀',
      urichina: '우리차이나'
    },
    from: '01021236383'
  },
  talkDream: {
    options: {
      method: 'POST',

      /**
       * dev: 'https://devtalkapi.lgcns.com/request/kakaoBudal.json'
       * prod: 'https://talkapi.lgcns.com/request/kakaoBudal.json'
       */
      url: 'https://devtalkapi.lgcns.com/request/kakaoBudal.json',
      headers: {
        authToken: 'FO8Nq+QoQOLrQKTVVKp2Rg==',
        serverName: 'edutalk21'
      },
      body: {
        service: 1910029603,
        callbackNo: '01021236383',

        /**
         * SMS: '000'
         * LMS: '001'
         * EXIT: '003'
         */
        backupProcessCode: '001'
      },
      json: true
    },
    shopName: {
      onestopedu: '원스탑에듀',
      urichina: '우리차이나'
    }
  }
};
