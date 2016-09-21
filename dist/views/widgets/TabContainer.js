"use strict";
var $__Tab_46_js__;
var Tab = ($__Tab_46_js__ = require("./Tab.js"), $__Tab_46_js__ && $__Tab_46_js__.__esModule && $__Tab_46_js__ || {default: $__Tab_46_js__}).default;
var TabContainer = function() {
  function TabContainer(option) {
    this.$tabContainer = $('#' + option.targetId);
    this.baseDom = "<div id='tabTemplate'>\n\t\t  <ul class='nav nav-tabs' role='tablist' name='tab-head'>\n\t\t  </ul>\n\t\t  <div class='tab-content' name='tab-content'>\n\t\t  </div>\n\t\t</div>";
    this.$tabContainer.html(this.baseDom);
    this.stateDoms = {
      normal: "<i class = 'fa fa-times' aria-hidden='true'></i>",
      changed: "<i class = 'fa fa-times-circle-o' aria-hidden='true'></i>"
    };
    this.tabFactory = {};
    this.bindCloseIconEvent();
    this.openTabStack = [];
  }
  return ($traceurRuntime.createClass)(TabContainer, {
    addTab: function(option) {
      var tab = new Tab($.extend({stateDoms: this.stateDoms}, option));
      this.tabFactory[tab.id] = tab;
      this.renderTab(tab);
      tab.active();
      this.openTabStack.push(tab.id);
      return tab;
    },
    removeTab: function(tabId) {
      var toRemoveTab = this.tabFactory[tabId];
      toRemoveTab.removeSelf(this.$tabContainer);
      this.openTabStack.splice(this.openTabStack.indexOf(toRemoveTab.id), 1);
      delete this.tabFactory[tabId];
    },
    bindCloseIconEvent: function() {
      var $tabContainer = this.$tabContainer;
      var self = this;
      $(document).on('mouseover mouseout', '[name="closeIcon"]', function(e) {
        $(e.target).toggleClass('whiteColor');
      });
      $(document).on('click', '[name="closeIcon"]', function(e) {
        var tabId = $(e.target).attr('target');
        self.removeTab(tabId);
        self.activeLast();
      });
    },
    active: function(tabId) {
      var tab = this.findTab(tabId);
      tab && tab.active();
    },
    activeLast: function() {
      var lastTab = this.openTabStack[this.openTabStack.length - 1];
      this.active(lastTab);
    },
    renderTab: function(tab) {
      tab.render(this.$tabContainer);
    },
    renderTabs: function() {},
    registState: function(state, stateDom) {
      this.stateDoms[state] = stateDom;
    },
    findTab: function(tabId) {
      return this.tabFactory[tabId];
    }
  }, {});
}();
var $__default = TabContainer;
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
