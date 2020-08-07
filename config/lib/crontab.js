/**
 * Module Dependencies
 */
const util = require('util');
const _ = require('lodash');
const config = require('../config');
const mongoose = require('mongoose');
const chalk = require('chalk');
const cron = require('node-cron');
const moment = require('moment');
const Orchestrator = require('orchestrator');
const crontab = new Orchestrator();

/**
 * Crontab seed check start
 */
exports.start = function() {

  const Course = mongoose.model('Course');
  const Lesson = mongoose.model('Lesson');
  const today = moment();

  /**
   * 4: 3 + 1 day
   * 6: 3 + 1 + 2(holiday) day
   */
  // const addDay = (today.day() >= 1 && today.day() < 6) ? 6 : 4;

  const compared = today.clone().add(2, 'days');

  Course.find({
      state: {
        $in: ['scheduled', 'inProgress']
      }
    })
    .select('endLesson')
    .populate({
      path: 'endLesson',
      select: 'started'
    })
    .exec((err, courses) => {
      console.log(courses);
      courses.forEach((item) => {
        console.log(item._id);
      });


      Lesson.find({
          _id: {
            $in: ['5e24f55e6de0b669b47185d4']
          }
        })
        .exec((err, lessons) => {
          if (err) {
            console.log(err);
          } else {
            console.log(lessons);
          }
        });

      //
      // process.exit();

      // if (err) {
      //   console.log(err);
      // } else {
      //   const lessonIds = courses.map((course) => {
      //     return course.lessons[0]._id;
      //   });
      //
      //   const Lesson = mongoose.model('Lesson');
      //   Lesson.find({
      //       _id: {
      //         $in: lessonIds
      //       },
      //       category: 'lesson',
      //       started: {
      //         $gte: today.toDate(),
      //         $lte: compared.toDate()
      //       }
      //     })
      //     .populate({
      //       path: 'tutor',
      //       select: '-password -salt'
      //     })
      //     .populate({
      //       path: 'user',
      //       select: '-password -salt'
      //     })
      //     .populate({
      //       path: 'course',
      //       populate: {
      //         path: 'payment user'
      //       }
      //     })
      //     .exec((err, lessons) => {
      //       if (err) {
      //         console.log(err);
      //       } else {
      //         console.log(lessons);
      //       }
      //     });
      // }
    });
  // Lesson.aggregate([{
  //     $match: {
  //       scheduleType: 'lesson',
  //       started: {
  //         $gte: moment().toDate(),
  //         $lte: compared.toDate()
  //       }
  //     }
  //   }, {
  //     $group: {
  //       _id: {
  //         course: '$course'
  //       }
  //     }
  //   }])
  //   .exec((err, results) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //
  //     console.log(results);
  //   });

  // crontab.start('mongoose-cron', (err) => {
  //   console.log(err);
  // });
};


crontab.add('mongoose-cron', () => {
  const options = {
    scheduled: true
  };

  // cron.schedule('*/1 * * * * *', courseJob, options);
  cron.schedule('*/1 * * * * *', finishingJob, options);

  function finishingJob() {

  }

  function courseJob() {

    const Course = mongoose.model('Course');
    const Lesson = mongoose.model('Lesson');
    const today = moment();

    /**
     * 4: 3 + 1 day
     * 6: 3 + 1 + 2(holiday) day
     */
    const addDay = (today.day() >= 3 && today.day() < 6) ? 6 : 4;

    const compared = moment().add(addDay, 'days');

    Lesson.aggregate([{
        $match: {
          scheduleTyp: 'lesson',
          started: {
            $gte: today,
            $lte: compared
          }
        }
      }, {
        $group: {
          _id: {
            course: '$course'
          }
        }
      }, {
        $project: {
          _id: 0,
          started: 1
        }
      }])
      .exec((err, results) => {
        if (err) {
          console.log(err);
        }

        console.log(results);
      });

    // Course.find({
    //     state: 'scheduled'
    //   })
    //   .select('lessons')
    //   .populate({
    //     path: 'lessons',
    //     match: {
    //       state: 'onStandby'
    //     },
    //     options: {
    //       sort: {
    //         started: -1
    //       },
    //       limit: 1
    //     }
    //   })
    //   .sort('-created')
    //   .exec((err, courses) => {
    //     if (err) {
    //       return res.status(422).send({
    //         message: errorHandler.getErrorMessage(err)
    //       });
    //     } else if (!courses) {
    //       return res.status(404).send({
    //         message: 'No courses with that identifier has been found'
    //       });
    //     } else {
    //       const lessonIds = courses.map((course) => {
    //         return course.lessons[0]._id;
    //       });
    //
    //       const Lesson = mongoose.model('Lesson');
    //       Lesson.find({
    //           _id: {
    //             $in: lessonIds
    //           },
    //           category: 'lesson',
    //           started: {
    //             $gte: today.toDate(),
    //             $lte: compared.toDate()
    //           }
    //         })
    //         .populate({
    //           path: 'tutor',
    //           select: '-password -salt'
    //         })
    //         .populate({
    //           path: 'user',
    //           select: '-password -salt'
    //         })
    //         .populate({
    //           path: 'course',
    //           populate: {
    //             path: 'payment user'
    //           }
    //         })
    //         .exec((err, lessons) => {
    //           if (err) {
    //             return res.status(422).send({
    //               message: errorHandler.getErrorMessage(err)
    //             });
    //           } else {
    //             res.json(lessons);
    //           }
    //         });
    //     }
    //   });
  }
});

// function updateCourseState() {
//   cron.schedule('*/1 * * * * *', () => {
//     console.log('stoped task 1', moment());
//   }, {
//     scheduled: true
//   });
// }
