'use strict';

var _ = require('lodash');
var request = require('request');
// var through = require('through2');

module.exports = function(message, custom) {
  custom = typeof custom !== 'undefined' ?  custom : false;

  // return through.obj(function(file, enc, cb) {

  if (process.env.SLACK_WEBHOOK_URL === undefined ||
      process.env.SLACK_WEBHOOK_URL === '') {
    return;
  }

  var body = {
    attachments: [
      {
        'fallback': message,
        'pretext': message
      }
    ]
  }

  if (custom) {
    body = _.merge(body, custom);
  }

  request.post({
    json: true,
    url: process.env.SLACK_WEBHOOK_URL,
    body: body
  });

  // });
};
