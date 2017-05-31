'use strict';
const util = require('./util');

module.exports = function App(options) {
  util.enforceArgs(options, ['dal', 'port'], true);
  util.enforceTypes(arguments, ['object', 'number']);

  const server = new require('./server')({
    port: options.port,
    dal: options.dal
  });

  let self = {};
  self.start = function(done) {
    server.start(done);
  };
  self.stop = function(done) {
    server.stop(done);
  };
  return Object.freeze(self);
};
