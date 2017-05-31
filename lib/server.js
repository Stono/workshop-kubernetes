'use strict';
const express = require('express');
const util = require('./util');
const debug = require('debug')('ideaboard:server');

const _ = require('lodash');
const bodyParser = require('body-parser');
module.exports = function Server(options) {
  util.enforceArgs(options, [
    'port',
    'dal'
  ]);

  const messages = options.dal.fifoList('messages');


  const app = express();
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  io.on('connection', socket => {
    socket.on('addMessage', data => {
      messages.push(JSON.stringify(data), () => {});
    });
    messages.all((err, msgs) => {
      msgs.forEach(msg => {
        socket.emit('newMessage', msg);
      });
    });
  });

  const cookieParser = require('cookie-parser')();
  (function expressSetup() {
    app.use(cookieParser);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use('/js', express.static('public/js'));
    app.use('/js', express.static('dist/js'));

    app.use('/css', express.static('public/css'));
    app.use('/css', express.static('dist/css'));

    app.use('/fonts', express.static('public/fonts'));
    app.use('/fonts', express.static('dist/fonts'));

    app.use('/images', express.static('images'));

    app.set('views', __dirname + '/../views');
    app.set('view engine', 'pug');
  })();

  (function applyRoutes() {
    const middleware = {};

    const controllerConfig =  _.pick(options, ['dal']);
    const controllers = {
      index: new require('./controllers/index')(controllerConfig)
    };
    require('./routes/index')(app, middleware, controllers.index);
  })();

  (function customErrors() {
    function notFoundHandler(req, res) {
      res.status(404);
      debug('404', req.path);
      if(req.accepts(['html', 'json']) === 'json') {
        return res.send({ error: 'Not Found' });
      }
      res.render('error', { title: 'Not Found' });
    }

    function errorHandler(err, req, res, next) {
      if (res.headersSent) {
        return next(err);
      }
      res.status(500);
      debug('500', err);
      if(req.accepts(['html', 'json']) === 'json') {
        return res.send({ error: 'Server Error' });
      }
      res.render('error', { title: 'Server Error' });
    }
    app.use(notFoundHandler);
    app.use(errorHandler);
  })();

  let self = {
    app: app
  };
  self.start = function(done) {
    debug(`server started on port ${options.port}`);
    http.listen(options.port, done);
  };
  self.stop = function(done) {
    http.close();
    done();
  };
  return Object.freeze(self);
};
