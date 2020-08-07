/**
 * Module Requirement
 */
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const defaultAssets = require('./config/assets/default');
const testAssets = require('./config/assets/test');
const testConfig = require('./config/env/test');
const glob = require('glob');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const runSequence = require('run-sequence');
const semver = require('semver');
const wiredep = require('wiredep').stream;
const endOfLine = require('os').EOL;
const del = require('del');
const rmdir = require('rimraf');

/**
 * Module variables
 */
const plugins = gulpLoadPlugins({
  rename: {
    'gulp-angular-templatecache': 'templateCache'
  }
});

let changedTestFiles = [];

/**
 * Set NODE_ENV to 'test'
 */
gulp.task('env:test', () => {
  process.env.NODE_ENV = 'test';
});

/**
 * Set NODE_ENV to 'development'
 */
gulp.task('env:dev', () => {
  process.env.NODE_ENV = 'development';
});

/**
 * Set NODE_ENV to 'production'
 */
gulp.task('env:prod', () => {
  process.env.NODE_ENV = 'production';
});

/**
 * Nodemon task
 */
gulp.task('nodemon', () => {

  /**
   * Node.js v7 and newer use different debug argument
   */
  const debugArgument = semver.satisfies(process.versions.node, '>=7.0.0') ? '--inspect' : '--debug';

  return plugins.nodemon({
    script: 'server.js',
    nodeArgs: debugArgument,
    ext: 'js,html',
    verbose: true,
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });

});

/**
 * Nodemon task without verbosity or debugging
 */
gulp.task('nodemon-nodebug', () => {
  return plugins.nodemon({
    script: 'server.js',
    ext: 'js,html',
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

/**
 * Watch Files for change
 */
gulp.task('watch', () => {
  // Start livereload
  plugins.refresh.listen();
  // Add watch rules
  gulp.watch(defaultAssets.server.views).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.server.allJS, ['eslint']).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.client.js, ['eslint']).on('change', plugins.refresh.changed);
  gulp.watch(defaultAssets.client.css, ['csslint']).on('change', plugins.refresh.changed);

  if (process.env.NODE_ENV === 'production') {
    gulp.watch(defaultAssets.server.gulpConfig, ['templatecache', 'eslint']);
    gulp.watch(defaultAssets.client.views, ['templatecache']).on('change', plugins.refresh.changed);
  } else {
    gulp.watch(defaultAssets.server.gulpConfigConfig, ['eslint']);
    gulp.watch(defaultAssets.client.views).on('change', plugins.refresh.changed);
  }
});

/**
 * Watch server test files
 */
gulp.task('watch:server:run-tests', () => {

  // Start livereload
  plugins.refresh.listen();

  // Add Server Test file rules
  gulp.watch([testAssets.tests.server, defaultAssets.server.allJS], ['test:server']).on('change', (file) => {
    changedTestFiles = [];

    // iterate through server test glob patterns
    _.forEach(testAssets.tests.server, (pattern) => {
      // determine if the changed (watched) file is a server test
      _.forEach(glob.sync(pattern), (f) => {
        const filePath = path.resolve(f);

        if (filePath === path.resolve(file.path)) {
          changedTestFiles.push(f);
          plugins.refresh.changed(f);
        }
      });
    });
  });
});

/**
 * CSS linting task
 */
gulp.task('csslint', () => {
  return gulp.src(defaultAssets.client.css)
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.formatter());
  // Don't fail CSS issues yet
  // .pipe(plugins.csslint.failFormatter());
});


/**
 * ESLint JS linting task
 */
gulp.task('eslint', () => {
  const assets = _.union(
    defaultAssets.server.gulpConfig,
    defaultAssets.server.allJS,
    defaultAssets.client.js,
    testAssets.tests.server,
    testAssets.tests.client,
    testAssets.tests.e2e
  );

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

/**
 * JS minifying task
 */
gulp.task('uglify', () => {
  const assets = _.union(defaultAssets.client.js, defaultAssets.client.templates);
  del(['public/dist/*']);

  return gulp.src(assets)
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    // .pipe(plugins.ngAnnotate())
    .pipe(plugins.uglify({
      mangle: true
    }).on('error', (err) => {
      console.log('Uglify error : ', err.toString());
    }))
    .pipe(plugins.concat('application.min.js'))
    .pipe(plugins.rev())
    .pipe(gulp.dest('public/dist'));
});

/**
 * CSS minifying task
 */
gulp.task('cssmin', () => {
  return gulp.src(defaultAssets.client.css)
    .pipe(plugins.csso())
    .pipe(plugins.concat('application.min.css'))
    .pipe(plugins.rev())
    .pipe(gulp.dest('public/dist'));
});

/**
 * Sass task
 */
gulp.task('sass', () => {
  return gulp.src(defaultAssets.client.sass)
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.rename((file) => {
      file.dirname = file.dirname.replace(`${path.sep}scss`, `${path.sep}css`);
    }))
    .pipe(gulp.dest('./modules/'));
});

/**
 * Less task
 */
gulp.task('less', () => {
  return gulp.src(defaultAssets.client.less)
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.rename((file) => {
      file.dirname = file.dirname.replace(`${path.sep}less`, `${path.sep}css`);
    }))
    .pipe(gulp.dest('./modules/'));
});


/**
 * Wiredep task to default
 */
gulp.task('wiredep', () => {
  return gulp.src('config/assets/default.js')
    .pipe(wiredep({
      ignorePath: '../../'
    }))
    .pipe(gulp.dest('config/assets/'));
});

/**
 * wiredep task to production
 */
gulp.task('wiredep:prod', () => {
  return gulp.src('config/assets/production.js')
    .pipe(wiredep({
      ignorePath: '../../',
      fileTypes: {
        js: {
          replace: {
            css: (filePath) => {
              const minFilePath = filePath.replace('.css', '.min.css');
              const fullPath = path.join(process.cwd(), minFilePath);
              if (!fs.existsSync(fullPath)) {
                return `'${filePath}',`;
              } else {
                return `'${minFilePath}',`;
              }
            },
            js: (filePath) => {
              const minFilePath = filePath.replace('.js', '.min.js');
              const fullPath = path.join(process.cwd(), minFilePath);
              if (!fs.existsSync(fullPath)) {
                return `'${filePath}',`;
              } else {
                return `'${minFilePath}',`;
              }
            }
          }
        }
      }
    }))
    .pipe(gulp.dest('config/assets/'));
});

/**
 * Copy local development environment config example
 */
gulp.task('copyLocalEnvConfig', () => {
  const src = [];
  const renameTo = 'local-development.js';

  // only add the copy source if our destination file doesn't already exist
  if (!fs.existsSync(`config/env/${renameTo}`)) {
    src.push('config/env/local.example.js');
  }

  return gulp.src(src)
    .pipe(plugins.rename(renameTo))
    .pipe(gulp.dest('config/env'));
});

/**
 * Make sure profiles directory exists
 */
gulp.task('makeDir', (done) => {
  return fs.mkdir('public/uploads', (err) => {
    if (err && err.code !== 'EEXIST') {
      return done(err);
    }
    return done();
  });

});

/**
 * Drops the MongoDB database, used in e2e testing
 */
gulp.task('dropdb', (done) => {
  // Use mongoose configuration
  const mongooseService = require('./config/lib/mongoose');

  mongooseService.connect((db) => {
    db.dropDatabase((err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Successfully dropped db: ', db.databaseName);
      }

      mongooseService.disconnect(done);
    });
  });
});

/**
 * Delete upload files
 */
gulp.task('dropdir', (done) => {
  rmdir('./public/uploads', (err) => {
    if (err) {
      console.error(err);
      return done(err);
    }
    return done();
  });
});

/**
 * Angular template cache task
 */
gulp.task('templatecache', () => {
  return gulp.src(defaultAssets.client.views)
    .pipe(plugins.templateCache('templates.js', {
      root: 'modules/',
      module: 'core',
      templateHeader: `(() => {${endOfLine} angular.module('<%= module %>'<%= standalone %>)${endOfLine}    .run(templates);${endOfLine}${endOfLine}   templates.$inject = ['$templateCache'];${endOfLine}${endOfLine}  function templates($templateCache) {${endOfLine}`,
      templateBody: `   $templateCache.put('<%= url %>', '<%= contents %>');`,
      templateFooter: ` }${endOfLine}})();${endOfLine}`
    }))
    .pipe(gulp.dest('build'));
});

/**
 * Mocha tests task
 */
gulp.task('mocha', (done) => {

  const mongooseService = require('./config/lib/mongoose');
  const testSuites = changedTestFiles.length ? changedTestFiles : testAssets.tests.server;
  let error;

  // Connect mongoose
  mongooseService.connect((db) => {
    // Load mongoose models
    mongooseService.loadModels();
    gulp.src(testSuites)
      .pipe(plugins.mocha({
        reporter: 'spec',
        timeout: 10000
      }))
      .on('error', (err) => {
        // If an error occurs, save it
        error = err;
      })
      .on('end', () => {
        // Disconnect mongoose
        mongooseService.disconnect((err) => {
          if (err) {
            console.log('Error disconnecting from database');
            console.log(err);
          }

          return done(error);
        });
      });
  });
});

/**
 * Mongo Seed tests task
 */
gulp.task('mongo-seed', (done) => {

  const mongooseService = require('./config/lib/mongoose');
  const seed = require('./config/lib/mongo-seed');
  // Open mongoose database connection
  mongooseService.connect((db) => {
    mongooseService.loadModels();

    seed.start({
        options: {
          logResults: true
        }
      })
      .then(() => {
        // Disconnect and finish task
        mongooseService.disconnect(done);
      })
      .catch((err) => {
        mongooseService.disconnect((disconnectError) => {
          if (disconnectError) {
            console.log('Error disconnecting from the database, but was preceded by a Mongo Seed error.');
          }
          // Finish task with error
          done(err);
        });
      });
  });
});

/**
 * Karma test runner task
 */
gulp.task('karma', (done) => {
  const KarmaServer = require('karma').Server;
  new KarmaServer({
    configFile: `${__dirname}/karma.conf.js`
  }, done).start();
});

/**
 * Run karma with coverage options set and write report
 */
gulp.task('karma:coverage', (done) => {
  const KarmaServer = require('karma').Server;
  new KarmaServer({
    configFile: `${__dirname}/karma.conf.js`,
    preprocessors: {
      'modules/*/client/views/**/*.html': ['ng-html2js'],
      'modules/core/client/app/config.js': ['coverage'],
      'modules/core/client/app/init.js': ['coverage'],
      'modules/*/client/*.js': ['coverage'],
      'modules/*/client/config/*.js': ['coverage'],
      'modules/*/client/controllers/*.js': ['coverage'],
      'modules/*/client/directives/*.js': ['coverage'],
      'modules/*/client/services/*.js': ['coverage']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage/client',
      reporters: [{
          type: 'lcov',
          subdir: '.'
        }
        // printing summary to console currently weirdly causes gulp to hang so disabled for now
        // https://github.com/karma-runner/karma-coverage/issues/209
        // { type: 'text-summary' }
      ]
    }
  }, done).start();
});

/**
 * Lint CSS and JavaScript files.
 */
gulp.task('lint', (done) => {
  // runSequence(['csslint', 'eslint'], done);
  runSequence(['eslint'], done);
});

/**
 * Lint project files and minify them into two production files.
 */
gulp.task('build', (done) => {
  runSequence('env:dev', 'wiredep:prod', 'lint', ['uglify', 'cssmin'], done);
});

/**
 * Run Mongo Seed with development environment config
 */
gulp.task('seed', (done) => {
  runSequence('env:dev', 'mongo-seed', done);
});

/**
 * Run Mongo Seed with production environment config
 */
gulp.task('seed:prod', (done) => {
  runSequence('env:prod', 'mongo-seed', done);
});

/**
 * Run Mongo Seed with test environment config
 */
gulp.task('seed:test', (done) => {
  runSequence('env:test', 'mongo-seed', done);
});

/**
 * Run server test to Mocha
 */
gulp.task('test:server', (done) => {
  // runSequence('env:test', 'mocha', done);
  runSequence('env:test', 'dropdb', 'lint', 'mocha', done);
});

/**
 * Watch all server files for changes & run server tests (test:server) task on changes
 */
gulp.task('test:server:watch', (done) => {
  runSequence('test:server', 'watch:server:run-tests', done);
});

/**
 * Run client test to Karma
 */
gulp.task('test:client', (done) => {
  runSequence('env:test', 'lint', 'dropdb', 'karma', done);
});

/**
 * Run the project in development mode with node debugger enabled
 */
gulp.task('default', (done) => {
  runSequence('env:dev', ['copyLocalEnvConfig', 'makeDir'], 'lint', ['nodemon', 'watch'], done);
});

/**
 * Run the project in production mode
 */
gulp.task('prod', (done) => {
  runSequence(['copyLocalEnvConfig', 'makeDir', 'templatecache'], 'build', 'env:prod', 'lint', ['nodemon-nodebug', 'watch'], done);
});
