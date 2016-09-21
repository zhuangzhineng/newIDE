"use strict";
var $__Constant_46_js__,
    $__common_46_js__;
var CONST = ($__Constant_46_js__ = require("./Constant.js"), $__Constant_46_js__ && $__Constant_46_js__.__esModule && $__Constant_46_js__ || {default: $__Constant_46_js__}).default;
var Common = ($__common_46_js__ = require("./common.js"), $__common_46_js__ && $__common_46_js__.__esModule && $__common_46_js__ || {default: $__common_46_js__}).default;
var connect;
function initConnect() {
  connect = new WebSocket(CONST.WS_PACKAGE_HOST, 'play_protocol');
  connect.onopen = function() {
    console.log('connect open');
  };
  connect.onmessage = function(message) {
    console.log('receive: ' + message.data + ' from server.');
    echoResult(message.data + "");
  };
  connect.onerror = function(error) {
    console.log(error);
  };
  return connect;
}
$('.btn-package-go').on('click', function(e) {
  var targetPlatform = $(e.target).attr('data');
  var userName = common.getUserName();
  var appid = common.getAppid();
  var accessToken = common.getAccessToken();
  var appType = common.getAppType();
  connect.send(JSON.stringify({
    method: 'package',
    appid: appid,
    user: userName,
    accessToken: accessToken,
    platform: targetPlatform,
    appType: appType
  }));
});
function echoResult(result) {
  terminal.echo(result);
}
var terminal;
function initTerminal() {
  terminal = $('#termDiv').terminal(function(command, term) {
    if (command !== '') {
      var result = window.eval(command);
      if (result != undefined) {
        term.echo(String(result));
      }
    }
  }, {
    greetings: 'Javascript Interpreter',
    name: 'js_demo',
    height: 400,
    width: 550,
    prompt: 'js> '
  });
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
