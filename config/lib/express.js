/**
 * Module Dependencies
 */
const _ = require('lodash');
const config = require('../config');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const logger = require('./logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const favicon = require('serve-favicon');
const compress = require('compression');
const consolidate = require('consolidate');
const helmet = require('helmet');
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);
const lusca = require('lusca');

/**
 * Initialize local variables
 */
function initLocalVariables(app) {

  /** Setting application local variables */
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.jsFiles = config.files.client.js;
  app.locals.cssFiles = config.files.client.css;
  app.locals.livereload = config.livereload;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;
  app.locals.env = process.env.NODE_ENV;
  app.locals.domain = config.domain;

  /** Passing the request url to environment locals */
  app.use((req, res, next) => {
    res.locals.host = `${req.protocol}://${req.hostname}`;
    res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    next();
  });
}

/**
 * Initialize static directory path
 */
function initStaticDirectory(app) {
  app.use('/', express.static(path.resolve('./public'), {
    maxAge: 86400000
  }));
}

/**
 * Initialize application middleware
 */
function initMiddleware(app) {

  /** Should be placed before express.static */
  app.use(compress({
    filter(req, res) {
      return (/json|text|javascript|css|font|svg/)
        .test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  /** Initialize favicon middleware */
  app.use(favicon(app.locals.favicon));

  /** Enable logger (morgan) if enabled in the configuration file */
  if (_.has(config, 'log.format')) {
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
  }

  /** Environment dependent middleware */
  if (process.env.NODE_ENV === 'development') {

    /** Disable views cache */
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  /** Request body parsing middleware should be above methodOverride */
  app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
  }));

  app.use(bodyParser.json({
    limit: '10mb'
  }));

  app.use(methodOverride());
  // app.use(express.limit('4M'));
  /** Add the cookie parser and flash middleware */
  app.use(cookieParser());
  app.use(flash());

  app.use(cors());
}

/**
 * Configure view engine
 */
function initViewEngine(app) {
  /** Set "Swig" as the template engine */
  app.engine('server.view.html', consolidate[config.templateEngine]);
  /** Set views path and view engine */
  app.set('view engine', 'server.view.html');
  app.set('views', path.resolve('./'));
}

/**
 * Configure Express session
 */
function initSession(app, db) {

  /** Express MongoDB session storage */
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl
    },
    name: config.sessionKey,
    store: new MongoStore({
      db,
      collection: config.sessionCollection
    })
  }));

  /** Add Lusca CSRF Middleware */
  app.use(lusca(config.csrf));
}

/**
 * Initialize Helmet security headers
 */
function initHelmetHeaders(app) {
  /** Six months expiration period specified in seconds */
  const SIX_MONTHS = 15778476;

  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
}

/**
 * Configure error handling
 */
function initErrorRoutes(app) {
  app.use((err, req, res, next) => {

    /** If the error object doesn't exists */
    if (!err) {
      return next();
    }

    console.error(err.stack);
    res.redirect('/server-error');
  });
}

/**
 * Configure the modules static routes
 */
function initModulesClientRoutes(app) {
  config.directories.client.forEach((staticPath) => {
    app.use(staticPath, express.static(path.resolve(`./${staticPath}`)));
  });
}

/**
 * Invoke modules server configuration
 */
function initModulesServerConfigs(app) {
  config.files.server.configs.forEach((configPath) => {
    require(path.resolve(configPath))(app);
  });
}

/**
 * Configure the modules ACL policies
 */
function initModulesServerPolicies() {
  /** Globbing policy files */
  config.files.server.policies.forEach((policyPath) => {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
}

/**
 * Configure the modules server routes
 */
function initModulesServerRoutes(app) {
  config.files.server.routes.forEach((routePath) => {
    require(path.resolve(routePath))(app);
  });
}

/**
 * Configure Socket.io
 */
function configureSocketIO(app, db) {
  /** Load the Socket.io configuration */
  const server = require('./socket.io')(app, db);
  /** Return server object */
  return server;
}

/**
 * Initialize the Express application
 */
module.exports.init = function(db) {

  /** Initialize express app */
  let app = express();
  /** Initialize local variables */
  initLocalVariables(app);
  /** Initialize static directory path */
  initStaticDirectory(app);
  /** Initialize Express middleware */
  initMiddleware(app);
  /** Initialize Express view engine */
  initViewEngine(app);
  /** Initialize Express session */
  initSession(app, db);
  /** Initialize Helmet security headers */
  initHelmetHeaders(app);
  /** Initialize modules static client routes, before session */
  initModulesClientRoutes(app);
  /** Initialize Modules server configuration */
  initModulesServerConfigs(app);
  /** Initialize modules server authorization policies */
  initModulesServerPolicies();
  /** Initialize modules server routes */
  initModulesServerRoutes(app);
  /** Initialize error routes */
  initErrorRoutes(app);
  /** Configure Socket.io */
  app = configureSocketIO(app, db);

  return app;
};
