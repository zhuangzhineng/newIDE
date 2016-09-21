"use strict";
var Tab = function() {
  function Tab(context) {
    this.title = '';
    var uuid = generateUUID();
    var headId = 'bc-head' + uuid;
    this.id = context.id || headId;
    this.context = $.extend(context, {
      id: this.id,
      contentId: 'bc-content' + uuid
    });
    this.baseTabHeaderDom = template('tabHeaderTemplate', context);
    this.baseTabContentDom = template('tabBodyTemplate', context);
    this.$header;
    this.$content;
    this.data = {};
  }
  return ($traceurRuntime.createClass)(Tab, {
    setState: function(state) {},
    getHeaderDom: function() {
      return this.baseTabHeaderDom;
    },
    getContentDom: function() {
      return this.baseTabContentDom;
    },
    active: function() {
      $('#' + this.id).tab('show');
    },
    render: function($tabContainer) {
      var $containerHeader = $('[name="tab-head"]', $tabContainer).append(this.getHeaderDom());
      var $containerContent = $('[name="tab-content"]', $tabContainer).append(this.getContentDom());
      this.$header = $(this.getHeaderDom(), $containerHeader);
      this.$content = $(this.getContentDom(), $containerContent);
    },
    removeSelf: function($tabContainer) {
      $(("[tabId=" + this.id + "]"), $tabContainer).remove();
    },
    setData: function(key, value) {
      this.data[key] = value;
    },
    getData: function(key) {
      return this.data[key];
    }
  }, {});
}();
var $__default = Tab;
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}
;
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
