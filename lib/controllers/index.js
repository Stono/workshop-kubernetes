'use strict';
const ViewModelBuilder = require('../viewModelBuilder');
const util = require('../util');

module.exports = function Index(options) {
  util.enforceArgs(options, ['dal'], true);
  const builder = new ViewModelBuilder(options);
  let self = {};
  self.read = function(req, res, next) {
    builder(req)
    .withTitle('ideaboard')
    .build((err, model) => {
      if(err) { return next(err); }
      res.render('index', model);
    });
  };
  return Object.freeze(self);
};
