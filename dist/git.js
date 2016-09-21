"use strict";
var $__Constant_46_js__;
var CONST = ($__Constant_46_js__ = require("./Constant.js"), $__Constant_46_js__ && $__Constant_46_js__.__esModule && $__Constant_46_js__ || {default: $__Constant_46_js__}).default;
var connect;
var terminal;
function initConnect() {
  connect = new WebSocket(CONST.WS_GIT_HOST, 'play_protocol');
  connect.onopen = function() {
    console.log('connect open');
  };
  connect.onmessage = function(message) {
    console.log('receive: ' + message.data + ' from server.');
    terminal.echo(String(message.data));
    terminal.resume();
  };
  connect.onerror = function(error) {
    console.log(error);
    terminal.error(String(error));
  };
  return connect;
}
function initTerminal() {
  terminal = $('#termDiv').terminal(function(command, term) {
    if (command !== '') {
      connect.send(JSON.stringify(buildGitCommand(command)));
      this.pause();
    }
  }, {
    greetings: 'Git Client',
    name: 'git',
    height: 550,
    width: 'calc(100% - 1em)',
    prompt: 'git> '
  });
}
function buildGitCommand(message) {
  return {
    method: 'git',
    appid: window.localStorage.appid,
    user: window.localStorage.userName,
    cmd: message
  };
}
Object.defineProperties(module.exports, {
  initConnect: {get: function() {
      return initConnect;
    }},
  initTerminal: {get: function() {
      return initTerminal;
    }},
  __esModule: {value: true}
});
