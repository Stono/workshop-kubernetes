'use strict';
const async = require('async');
const util = require('./util');
const debug = require('debug')('ideaboard:vmb');

const ViewModelBuilder = function(options) {
  /* jshint maxstatements: 35 */
  util.enforceArgs(options, ['dal', 'req'], true);
  const req = options.req;

  let model = {
    page: {
      version: require('../package.json').version
    }
  };
  const queued = [];
  const called = [];

  const addToQueue = (name, dependencies, handler) => {
    const wrapHandler = function(done) {
      if(called.indexOf(name) > -1) { return done(); }
      async.forEach(dependencies, (dep, next) => {
        if(called.indexOf(dep) === -1) {
          return next(new Error('Missing Dependency: ' + dep + ' when calling: ' + name));
        }
        next();
      }, err => {
        if(err) { return done(err); }
        debug(name, 'calling');
        called.push(name);
        handler(done);
      });
    };
    const wrapped = wrapHandler;
    queued.push(wrapped);
  };
  let self = {};

  self.withUser = function() {
    addToQueue('withUser', [], next => {
      if(util.isEmpty(req.user)) {
        return next(new Error('No user found in request'));
      }
      model.user = req.user.profile;
      model.oauth = req.user.oauth;
      next();
    });
    return self;
  };

  self.withTitle = function(title, subTitle) {
    addToQueue('withTitle', [], next => {
      if(typeof title === 'function') {
        title(model, (title, subTitle) => {
          model.page.title = title;
          model.page.subTitle = subTitle;
          next();
        });
      } else {
        model.page.title = title;
        model.page.subTitle = subTitle;
        next();
      }
    });
    return self;
  };

  self.build = function(done) {
    async.series(queued, err => {
      return done(err, model);
    });
  };

  return Object.freeze(self);
};

module.exports = function(options) {
  util.enforceArgs(options, ['dal'], true);
  return function(req) {
    util.enforceNotEmpty(req, 'You must pass the request object');
    return new ViewModelBuilder({
      dal: options.dal,
      req: req
    });
  };
};
