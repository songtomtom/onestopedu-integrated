/**
 * Module Dependencies
 */
const defaultEnv = require('./default');
const LoremIpsum = require('lorem-ipsum').LoremIpsum;
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

/**
 * Module Exports
 */
module.exports = {
  app: {
    title: `${defaultEnv.app.title} - Developmenet Environment`
  },
  port: process.env.PORT || 3000,
  db: {
    // uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost'}/development`,
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || `mongodb://${process.env.DB_1_PORT_27017_TCP_ADDR || `${defaultEnv.db.dev.user}:${defaultEnv.db.dev.password}@${defaultEnv.db.host}`}/development`,
    options: {},
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    format: 'dev',
    fileLogger: {
      directoryPath: `${process.cwd()}/logs`,
      fileName: 'app-dev.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  mailer: {
    from: process.env.MAILER_FROM || '<web@k21inc.com>',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'web@k21inc.com',
        pass: process.env.MAILER_PASSWORD || 'onestopkrSA%'
      }
    }
  },
  livereload: false,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false'
    },
    collections: [{
      model: 'Creator',
      docs: [{
        data: {
          username: 'kevin',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          nickName: 'Kevin',
          profileImage: 'modules/user/client/img/tmp-profiles/user-1.jpg',
          displayRole: 'Lead programmer'
        },
        overwrite: true
      }, {
        data: {
          username: 'jisu',
          email: 'jisu@1stopasia.com',
          mobile: '01042117990',
          nickName: 'Jisu',
          profileImage: 'modules/user/client/img/tmp-profiles/user-2.jpg',
          displayRole: 'Web planner'
        },
        overwrite: true
      }, {
        data: {
          username: 'henry',
          email: 'henry@1stopasia.com',
          mobile: '01077059732',
          nickName: 'Henry',
          profileImage: 'modules/user/client/img/tmp-profiles/user-3.jpg',
          displayRole: 'Back-end programmer'
        },
        overwrite: true
      }, {
        data: {
          username: 'rachel',
          email: 'rachel@1stopasia.com',
          mobile: '01093432991',
          nickName: 'Rachel',
          profileImage: 'modules/user/client/img/tmp-profiles/user-4.jpg',
          displayRole: 'Front-end programmer'
        },
        overwrite: true
      }, {
        data: {
          username: 'billy',
          email: 'billy@1stopasia.com',
          mobile: '01055417548',
          nickName: 'Billy',
          profileImage: 'modules/user/client/img/tmp-profiles/user-5.jpg',
          displayRole: 'Web publisher'
        },
        overwrite: true
      }]
    }, {
      model: 'Admin',
      docs: [{
        data: {
          username: 'yoona',
          email: 'yoona@1stopasia.com',
          mobile: '01000000000',
          englishName: 'Yoona kim',
          nickName: 'yoona',
          languages: ['english'],
          profileImage: 'modules/user/client/img/tmp-profiles/user-4.jpg'
        },
        overwrite: true
      }]
    }, {
      model: 'CSManager',
      docs: [{
        data: {
          username: 'young',
          email: 'young@1stopasia.com',
          mobile: '01000000000',
          nickName: 'Young',
          englishName: 'Young Oh',
          providers: ['onestopedu', 'duksung'],
          languages: ['english'],
          profileImage: 'modules/user/client/img/tmp-profiles/user-8.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'jenn',
          email: 'jenn@1stopasia.com',
          mobile: '01000000000',
          nickName: 'Jenn',
          englishName: 'Jenn Lee',
          providers: ['onestopedu', 'duksung'],
          languages: ['english'],
          profileImage: 'modules/user/client/img/tmp-profiles/user-10.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'zqh024',
          email: 'alyssa@1stopasia.com',
          mobile: '01077885868',
          nickName: 'Alyssa',
          englishName: 'Alyssa zheng',
          providers: ['onestopedu', 'duksung'],
          languages: ['english'],
          profileImage: 'modules/user/client/img/tmp-profiles/user-9.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'mariap',
          email: 'mariap@1stopasia.com',
          mobile: '01000000000',
          nickName: 'Maria P',
          englishName: 'Maria P',
          providers: ['onestopedu'],
          languages: ['english'],
          profileImage: 'modules/user/client/img/tmp-profiles/user-1.jpg'
        },
        overwrite: true
      }]
    }, {
      model: 'TutorManager',
      docs: [{
        data: {
          username: 'pump185',
          email: 'kelly@1stopasia.com',
          mobile: '01000000000',
          nickName: 'Kelly',
          englishName: 'Kelly Ham',
          providers: ['onestopedu', 'duksung'],
          languages: ['english'],
          profileImage: 'modules/user/client/img/tmp-profiles/user-10.jpg'
        },
        overwrite: true
      }]
    }, {
      model: 'Tutor',
      docs: [{
        data: {
          username: 'nicole',
          email: 'nicole@1stopasia.com',
          nickName: 'Nicole',
          englishName: 'Nikoletta G',
          languages: ['english'],
          gender: 'female',
          timezone: 'Europe/Sofia',
          nation: 'bulgaria',
          callcenter: 'bulgaria',
          profileImage: 'modules/user/client/img/tmp-profiles/user-4.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'andie',
          email: 'andie@1stopasia.com',
          nickName: 'Andie',
          englishName: 'Andie',
          languages: ['english'],
          gender: 'female',
          timezone: 'Asia/Manila',
          nation: 'philippines',
          callcenter: 'philippines',
          profileImage: 'modules/user/client/img/tmp-profiles/user-3.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'arden',
          email: 'arden@1stopasia.com',
          nickName: 'Arden',
          englishName: 'Arden Uy',
          languages: ['english'],
          timezone: 'Europe/Sofia',
          gender: 'female',
          nation: 'bulgaria',
          callcenter: 'bulgaria',
          profileImage: 'modules/user/client/img/tmp-profiles/user-2.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'astheria',
          email: 'astheria@1stopasia.com',
          nickName: 'Astheria',
          englishName: 'Astheria Rose Panse',
          languages: ['english'],
          gender: 'female',
          timezone: 'Asia/Manila',
          nation: 'philippines',
          callcenter: 'philippines',
          profileImage: 'modules/user/client/img/tmp-profiles/user-1.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'cherry',
          email: 'cherry@1stopasia.com',
          nickName: 'Cherry',
          englishName: 'Cherry Mae Panse',
          languages: ['english'],
          timezone: 'Asia/Manila',
          gender: 'female',
          nation: 'philippines',
          callcenter: 'philippines',
          profileImage: 'modules/user/client/img/tmp-profiles/user-14.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'claire',
          email: 'claire@1stopasia.com',
          nickName: 'Claire',
          englishName: 'Claire Pamoso',
          languages: ['english'],
          gender: 'female',
          nation: 'bulgaria',
          timezone: 'Europe/Sofia',
          callcenter: 'bulgaria',
          profileImage: 'modules/user/client/img/tmp-profiles/user-13.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'denizza',
          email: 'denizza@1stopasia.com',
          nickName: 'Denizza',
          englishName: 'Denizza Sardua',
          languages: ['english'],
          gender: 'female',
          timezone: 'Europe/Sofia',
          nation: 'bulgaria',
          callcenter: 'bulgaria',
          profileImage: 'modules/user/client/img/tmp-profiles/user-12.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'eden',
          email: 'eden@1stopasia.com',
          nickName: 'Eden',
          englishName: 'Eden Enoy',
          languages: ['english'],
          timezone: 'Asia/Manila',
          gender: 'female',
          nation: 'philippines',
          callcenter: 'philippines',
          profileImage: 'modules/user/client/img/tmp-profiles/user-11.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'gabriela',
          email: 'gabriela@1stopasia.com',
          nickName: 'Gabriela',
          englishName: 'Gabriela',
          languages: ['english'],
          gender: 'female',
          timezone: 'Asia/Manila',
          nation: 'philippines',
          callcenter: 'philippines',
          profileImage: 'modules/user/client/img/tmp-profiles/user-10.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'janice',
          email: 'janice@1stopasia.com',
          nickName: 'Janice',
          englishName: 'Janice',
          languages: ['english'],
          timezone: 'Europe/Sofia',
          gender: 'female',
          nation: 'bulgaria',
          callcenter: 'bulgaria',
          profileImage: 'modules/user/client/img/tmp-profiles/user-9.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'jenna',
          email: 'jenna@1stopasia.com',
          nickName: 'Jenna',
          englishName: 'Jenna Sobredo',
          languages: ['english'],
          gender: 'female',
          timezone: 'Asia/Manila',
          nation: 'philippines',
          callcenter: 'philippines',
          profileImage: 'modules/user/client/img/tmp-profiles/user-8.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'katerina',
          email: 'katerina@1stopasia.com',
          nickName: 'Katerina',
          englishName: 'Katerina',
          languages: ['english'],
          gender: 'female',
          timezone: 'Asia/Manila',
          nation: 'philippines',
          callcenter: 'philippines',
          profileImage: 'modules/user/client/img/tmp-profiles/user-7.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'korina',
          email: 'korina@1stopasia.com',
          nickName: 'Korina',
          englishName: 'Korina Montenid',
          languages: ['english'],
          gender: 'female',
          nation: 'philippines',
          timezone: 'Asia/Manila',
          callcenter: 'philippines',
          profileImage: 'modules/user/client/img/tmp-profiles/user-6.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'krisi',
          email: 'krisi@1stopasia.com',
          nickName: 'Krisi',
          englishName: 'Krisi',
          languages: ['english'],
          gender: 'female',
          timezone: 'Asia/Manila',
          nation: 'philippines',
          callcenter: 'philippines',
          profileImage: 'modules/user/client/img/tmp-profiles/user-5.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'liezel',
          email: 'liezel@1stopasia.com',
          nickName: 'Liezel',
          englishName: 'Liezel Porras',
          languages: ['english'],
          gender: 'female',
          timezone: 'Europe/Sofia',
          nation: 'bulgaria',
          callcenter: 'bulgaria',
          profileImage: 'modules/user/client/img/tmp-profiles/user-4.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'maria',
          email: 'maria@1stopasia.com',
          nickName: 'Maria',
          englishName: 'Maria K',
          languages: ['english'],
          gender: 'female',
          timezone: 'Europe/Sofia',
          nation: 'bulgaria',
          callcenter: 'bulgaria',
          profileImage: 'modules/user/client/img/tmp-profiles/user-3.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'may',
          email: 'may@1stopasia.com',
          nickName: 'May',
          englishName: 'May Clair',
          languages: ['english'],
          gender: 'female',
          timezone: 'Asia/Manila',
          nation: 'philippines',
          callcenter: 'philippines',
          profileImage: 'modules/user/client/img/tmp-profiles/user-2.jpg'
        },
        overwrite: true
      }, {
        data: {
          username: 'doyen',
          email: 'doyen@1stopasia.com',
          nickName: 'Doyen',
          chineseName: '杜艳',
          languages: ['chinese'],
          timezone: 'Asia/Shanghai',
          gender: 'female',
          nation: 'china',
          callcenter: 'shenyang',
          profileImage: 'modules/user/client/img/tmp-profiles/user-1.jpg'
        },
        overwrite: true
      }]
    }, {
      model: 'Guest',
      docs: [{
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '박수진',
          englishName: 'Lindsey',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '박수진',
          englishName: 'Lindsey',
          providers: ['duksung']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '박수진',
          englishName: 'Lindsey',
          providers: ['urichina']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '희희',
          englishName: 'Sunny',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '고규환',
          englishName: 'Gue Hwan',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '임주영',
          englishName: 'Kelly',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '장은슬',
          englishName: 'Crystal',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '장은우',
          englishName: 'Kevin',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '양지나',
          englishName: 'Gina',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '김순섭',
          englishName: 'James',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '강효정',
          englishName: 'Hyojung',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '고현우',
          englishName: 'Hyunwoo',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '김경미',
          englishName: 'Kyungmi',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'jisu@1stopasia.com',
          mobile: '01042117990',
          koreanName: '안지수',
          englishName: 'test',
          providers: ['duksung']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '김세희',
          englishName: 'Sarah',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '이명진',
          providers: ['urichina']
        },
        overwrite: true
      }]
    }, {
      model: 'Member',
      docs: [{
        data: {
          username: 'lindsey94',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '박수진',
          englishName: 'Lindsey',
          providers: ['onestopedu']

        },
        overwrite: true
      }, {
        data: {
          username: 'lindsey94',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '박수진',
          englishName: 'Lindsey',
          providers: ['duksung']
        },
        overwrite: true
      }, {
        data: {
          username: 'lindsey94',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '박수진',
          englishName: 'Lindsey',
          providers: ['urichina']
        },
        overwrite: true
      }, {
        data: {
          username: '327111894',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '희희',
          englishName: 'Sunny',
          providers: ['onestopedu'],
          skype: 'live:170df200e33b6e4a'
        },
        overwrite: true
      }, {
        data: {
          username: 'diidlwwl',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '고규환',
          englishName: 'Gue Hwan',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          username: 'yeewo2000',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '임주영',
          englishName: 'Kelly',
          providers: ['onestopedu'],
          skype: '01022331793'
        },
        overwrite: true
      }, {
        data: {
          username: 'crystal',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '장은슬',
          englishName: 'Crystal',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          username: 'kevin22',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '장은우',
          englishName: 'Kevin',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          username: 'gina12',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '양지나',
          englishName: 'Gina',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          username: 'sskim',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '김순섭',
          englishName: 'James',
          providers: ['onestopedu']
        },
        overwrite: true
      }, {
        data: {
          username: 'hyojung',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '강효정',
          englishName: 'Hyojung',
          providers: ['onestopedu'],
          skype: 'live:sakuninoming_1'
        },
        overwrite: true
      }, {
        data: {
          username: 'hyunwoo12',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '고현우',
          englishName: 'Hyunwoo',
          providers: ['onestopedu'],
          skype: 'live:ko1173'
        },
        overwrite: true
      }, {
        data: {
          username: 'kyungmi',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '김경미',
          englishName: 'Kyungmi',
          providers: ['onestopedu'],
          skype: 'live:5a53e70a8a052ba7'
        },
        overwrite: true
      }, {
        data: {
          username: 'test19',
          email: 'jisu@1stopasia.com',
          mobile: '01042117990',
          koreanName: '안지수',
          englishName: 'test',
          providers: ['duksung']
        },
        overwrite: true
      }, {
        data: {
          username: 'tpgml4569',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '김세희',
          englishName: 'Sarah',
          providers: ['onestopedu'],
          skype: 'itph77'
        },
        overwrite: true
      }, {
        data: {
          username: 'immyeongjin',
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          koreanName: '이명진',
          providers: ['urichina']
        },
        overwrite: true
      }]
    }, {
      model: 'ContactUs',
      docs: [{
        // ContactUs-Onestopedu #1
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #2
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #3
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #4
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #5
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #6
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #7
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #8
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #9
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #10
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #11
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #12
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #13
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #14
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #15
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #16
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #17
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #18
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #19
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Onestopedu #20
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Duksung #21
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Duksung #22
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Duksung #23
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Duksung #24
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Duksung #25
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Duksung #26
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Duksung #27
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Duksung #28
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Duksung #29
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Duksung #30
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Urichina #31
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Urichina #32
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Urichina #33
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Urichina #34
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Urichina #35
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Urichina #36
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Urichina #37
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Urichina #38
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // ContactUs-Urichina #39
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7),
          contactUsType: 'private'
        },
        overwrite: true
      }, {
        // ContactUs-Urichina #40
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }]
    }, {

      /**
       * Notice seed datas
       */
      model: 'Notice',
      docs: [{
        // Notice-Onestopedu #1
        data: {
          noticeType: 'top',
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #2
        data: {
          noticeType: 'top',
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #3
        data: {
          noticeType: 'top',
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #4
        data: {
          noticeType: 'top',
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #5
        data: {
          noticeType: 'top',
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #6
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #7
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #8
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #9
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #10
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #11
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #12
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #13
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #14
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #15
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #16
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #17
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #18
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #19
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Onestopedu #20
        data: {
          providers: ['onestopedu'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Duksung #21
        data: {
          providers: ['duksung'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Duksung #22
        data: {
          providers: ['duksung'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Duksung #23
        data: {
          providers: ['duksung'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Duksung #24
        data: {
          providers: ['duksung'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Duksung #25
        data: {
          providers: ['duksung'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Duksung #26
        data: {
          providers: ['duksung'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Duksung #27
        data: {
          providers: ['duksung'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Duksung #28
        data: {
          providers: ['duksung'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Duksung #29
        data: {
          providers: ['duksung'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Duksung #30
        data: {
          providers: ['duksung'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Urichina #31
        data: {
          providers: ['urichina'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Urichina #32
        data: {
          providers: ['urichina'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Urichina #33
        data: {
          providers: ['urichina'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Urichina #34
        data: {
          providers: ['urichina'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Urichina #35
        data: {
          providers: ['urichina'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Urichina #36
        data: {
          providers: ['urichina'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Urichina #37
        data: {
          providers: ['urichina'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Urichina #38
        data: {
          providers: ['urichina'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Urichina #39
        data: {
          providers: ['urichina'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Notice-Urichina #40
        data: {
          providers: ['urichina'],
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }]
    }, {

      /**
       * FAQ seed datas
       */
      model: 'FAQ',
      docs: [{
        // FAQ-Onestopedu #1
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateSentences(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #2
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #3
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #4
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #5
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #6
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #7
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #8
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #9
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #10
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #11
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #12
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #13
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #14
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #15
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #16
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #17
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #18
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #19
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Onestopedu #20
        data: {
          providers: ['onestopedu'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Duksung #21
        data: {
          providers: ['duksung'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Duksung #22
        data: {
          providers: ['duksung'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Duksung #23
        data: {
          providers: ['duksung'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Duksung #24
        data: {
          providers: ['duksung'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Duksung #25
        data: {
          providers: ['duksung'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Duksung #26
        data: {
          providers: ['duksung'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Duksung #27
        data: {
          providers: ['duksung'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Duksung #28
        data: {
          providers: ['duksung'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Duksung #29
        data: {
          providers: ['duksung'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Duksung #30
        data: {
          providers: ['duksung'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Urichina #31
        data: {
          providers: ['urichina'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Urichina #32
        data: {
          providers: ['urichina'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Urichina #33
        data: {
          providers: ['urichina'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Urichina #34
        data: {
          providers: ['urichina'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Urichina #35
        data: {
          providers: ['urichina'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Urichina #36
        data: {
          providers: ['urichina'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Urichina #37
        data: {
          providers: ['urichina'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Urichina #38
        data: {
          providers: ['urichina'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Urichina #39
        data: {
          providers: ['urichina'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // FAQ-Urichina #40
        data: {
          providers: ['urichina'],
          question: lorem.generateSentences(1),
          answer: lorem.generateParagraphs(7)
        },
        overwrite: true
      }]
    }, {


      /**
       * Course Review seed datas
       * Onestopedu x 20
       * Duksung x 10
       * Urichina x 10
       */
      model: 'CourseReview',
      docs: [{
        // CourseReview-Onestopedu #1
        data: {
          courseReviewType: 'top',
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #2
        data: {
          courseReviewType: 'top',
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #3
        data: {
          courseReviewType: 'top',
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #4
        data: {
          courseReviewType: 'top',
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #5
        data: {
          courseReviewType: 'top',
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #6
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #7
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #8
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #9
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #10
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #11
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #12
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #13
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #14
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #15
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #16
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #17
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #18
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #19
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Onestopedu #20
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Duksung #21
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Duksung #22
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Duksung #23
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Duksung #24
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Duksung #25
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Duksung #26
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Duksung #27
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Duksung #28
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Duksung #29
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Duksung #30
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Urichina #31
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Urichina #32
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Urichina #33
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Urichina #34
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Urichina #35
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Urichina #36
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Urichina #37
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Urichina #38
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Urichina #39
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // CourseReview-Urichina #40
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }]
    }, {

      /**
       * Tutor Board seed datas
       * Onestopedu x 20
       * Duksung x 10
       * Urichina x 10
       */
      model: 'TutorBoard',
      docs: [{
        // TutorBoard-Onestopedu #1
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #2
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #3
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #4
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #5
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #6
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #7
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #8
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #9
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #10
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #11
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #12
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #13
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #14
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #15
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #16
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #17
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #18
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #19
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Onestopedu #20
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Duksung #21
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Duksung #22
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Duksung #23
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Duksung #24
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Duksung #25
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Duksung #26
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Duksung #27
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Duksung #28
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Duksung #29
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Duksung #30
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Urichina #31
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Urichina #32
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Urichina #33
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Urichina #34
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Urichina #35
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Urichina #36
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Urichina #37
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Urichina #38
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Urichina #39
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // TutorBoard-Urichina #40
        data: {
          title: lorem.generateSentences(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }]
    }, {

      /**
       * Partnership seed datas
       */
      model: 'Partnership',
      docs: [{
        // Partnership-Onestopedu #1
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #2
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #3
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #4
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #5
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #6
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #7
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #8
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #9
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #10
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #11
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #12
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #13
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #14
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #15
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #16
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #17
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #18
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #19
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Onestopedu #20
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['onestopedu'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Duksung #21
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['duksung'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Duksung #22
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['duksung'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Duksung #23
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['duksung'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Duksung #24
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['duksung'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Duksung #25
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['duksung'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Duksung #26
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['duksung'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Duksung #27
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['duksung'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Duksung #28
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['duksung'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Duksung #29
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['duksung'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Duksung #30
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['duksung'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Urichina #31
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['urichina'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Urichina #32
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['urichina'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Urichina #33
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['urichina'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Urichina #34
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['urichina'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Urichina #35
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['urichina'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Urichina #36
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['urichina'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Urichina #37
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['urichina'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Urichina #38
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['urichina'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Urichina #39
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['urichina'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Partnership-Urichina #40
        data: {
          email: 'kevin@1stopasia.com',
          mobile: '01055417548',
          providers: ['urichina'],
          company: lorem.generateWords(1),
          partnerName: lorem.generateWords(1),
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }]
    }, {

      /**
       * Contact1x1 seed datas
       */
      model: 'Contact1x1',
      docs: [{
        // Contact1x1-Onestopedu #1
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #2
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #3
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #4
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #5
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #6
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #7
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #8
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #9
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #10
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #11
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #12
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #13
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #14
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #15
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #16
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #17
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #18
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #19
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Onestopedu #20
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Duksung #21
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Duksung #22
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Duksung #23
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Duksung #24
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Duksung #25
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Duksung #26
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Duksung #27
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Duksung #28
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Duksung #29
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Duksung #30
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Urichina #31
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Urichina #32
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Urichina #33
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Urichina #34
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Urichina #35
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Urichina #36
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Urichina #37
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Urichina #38
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Urichina #39
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }, {
        // Contact1x1-Urichina #40
        data: {
          contents: lorem.generateParagraphs(7)
        },
        overwrite: true
      }]
    }]
  }
};
