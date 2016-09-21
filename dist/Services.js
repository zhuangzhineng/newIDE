"use strict";
var $__HttpRequest_46_js__,
    $__common_46_js__;
var HttpRequest = ($__HttpRequest_46_js__ = require("./HttpRequest.js"), $__HttpRequest_46_js__ && $__HttpRequest_46_js__.__esModule && $__HttpRequest_46_js__ || {default: $__HttpRequest_46_js__}).default;
var Common = ($__common_46_js__ = require("./common.js"), $__common_46_js__ && $__common_46_js__.__esModule && $__common_46_js__ || {default: $__common_46_js__}).default;
var Services = function() {
  function Services() {}
  return ($traceurRuntime.createClass)(Services, {}, {
    getTables: function(successFn, errorFn) {
      HttpRequest.get("api/tableList?appid=" + Common.getAppid(), {
        success: successFn,
        error: errorFn
      });
    },
    getTable: function(tableName, successFn, errorFn) {
      HttpRequest.get('api/tableDetail?tableName=' + tableName, {
        success: successFn,
        error: errorFn
      });
    },
    getFiles: function(Folder, successFn, errorFn) {
      var path = (Folder === undefined) ? '' : '&path=' + Folder;
      var token = '&accessToken=' + Common.getAccessToken();
      HttpRequest.get('api/fileList?appid=' + Common.getAppid() + path + token, {
        success: successFn,
        error: errorFn
      });
    },
    getFileContent: function(path, successFn, errorFn) {
      var filePath = (path === undefined) ? '' : '&path=' + path;
      var token = '&accessToken=' + Common.getAccessToken();
      var url = 'api/file?appid=' + Common.getAppid() + filePath + token;
      HttpRequest.get(url, {
        dataType: 'text',
        success: successFn,
        error: errorFn
      });
    },
    saveFile: function(filePath, fileContent, successFn, errorFn) {
      var token = '&accessToken=' + Common.getAccessToken();
      HttpRequest.post('api/updateFile?appid=' + Common.getAppid() + '&path=' + filePath + token, {
        data: fileContent,
        success: successFn,
        error: errorFn
      });
    },
    deleteFile: function(filePah, successFn, errorFn) {
      HttpRequest.post('api/deleteFile?&accessToken=' + Common.getAccessToken(), {
        data: JSON.stringify({
          appid: Common.getAppid(),
          path: filePah
        }),
        success: successFn,
        error: errorFn
      });
    },
    createFile: function(folderPath, successFn, errorFn) {
      HttpRequest.post('api/createFile?&accessToken=' + Common.getAccessToken(), {
        data: JSON.stringify({
          appid: Common.getAppid(),
          path: folderPath
        }),
        success: successFn,
        error: errorFn
      });
    },
    renameFile: function(sourceFile, targetFile, successFn, errorFn) {
      HttpRequest.post('api/renameFile?appid=' + Common.getAppid() + '&src=' + sourceFile + '&dst=' + targetFile + '&accessToken=' + Common.getAccessToken(), {
        success: successFn,
        error: errorFn
      });
    },
    getUserInfo: function(successFn, errorFn) {
      HttpRequest.get('api/getUserInfo?accessToken=' + Common.getAccessToken(), {
        success: successFn,
        error: errorFn
      });
    }
  });
}();
var $__default = Services;
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
