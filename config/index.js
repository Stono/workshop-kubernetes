'use strict';
require('colors');

const validateEnv = (key, bomb) => {
  if(!process.env[key]) {
    if(bomb) {
      console.error('Warning'.red + ' ' + key + ' is required!');
      process.exit(1);
    }
    console.error('Warning'.yellow + ' ' + key + ' should really be set!');
    return null;
  }
  return process.env[key];
};

let config = {
  port: 9000,
  dal: {
    redis: {
      host: validateEnv('REDIS_HOST', true),
      port: 6379,
      password: validateEnv('REDIS_PASSWORD', false)
    }
  }
};

module.exports = config;
