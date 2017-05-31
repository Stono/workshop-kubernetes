'use strict';
/* global $ */
/* global ko */
/* global io */
/* global document */

var idea = function() {
  ko.bindingHandlers.enterkey = {
    init: function (element, valueAccessor, allBindings, viewModel) {
      var callback = valueAccessor();
      $(element).keypress(function (event) {
        var keyCode = (event.which ? event.which : event.keyCode);
        if (keyCode === 13) {
          callback.call(viewModel);
          return false;
        }
        return true;
      });
    }
  };

  var socket;
  socket = io();
  var viewModel = {
    name: ko.observable(''),
    message: ko.observable(''),
    messages: ko.observableArray([]),
    addMessageFromSocket: function(msg) {
      this.messages.unshift(msg);
    },
    addMessage: function() {
      var model = {
        name: this.name(),
        message: this.message()
      };
      socket.emit('addMessage', model);
      this.addMessageFromSocket(model);
      this.name('');
      this.message('');
    }
  };
  viewModel.shouldShowEmpty = ko.computed(function() {
    return (this.messages().length === 0);
  }, viewModel);

  ko.applyBindings(viewModel, document.getElementById('idea'));

  socket.on('newMessage', function(msg) {
    viewModel.addMessageFromSocket(JSON.parse(msg));
  });
};

$(document).ready(idea);
