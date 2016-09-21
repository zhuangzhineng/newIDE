"use strict";
window.common = {
  getServerDomainAndPort: function() {
    return this.getServerDomain();
  },
  getServerDomain: function() {
    return '127.0.0.1';
  },
  getQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      return "";
    }
  },
  getAppid: function() {
    if (window.localStorage) {
      return window.localStorage.appid;
    }
    return "";
  },
  saveAppid: function(appid) {
    if (window.localStorage) {
      window.localStorage.appid = appid;
    } else {
      console.log("localStorage not available when saving appid");
    }
  },
  getAccessToken: function() {
    if (window.localStorage) {
      return window.localStorage.accessToken;
    }
    return "";
  },
  saveAccessToken: function(token) {
    if (window.localStorage) {
      window.localStorage.accessToken = token;
    } else {
      console.log("");
    }
  },
  getUserName: function() {
    return window.localStorage.userName;
  },
  saveUserName: function(userName) {
    window.localStorage.userName = userName;
  },
  getAppType: function() {
    return window.localStorage.appType;
  },
  saveAppType: function(appType) {
    window.localStorage.appType = appType;
  }
};
