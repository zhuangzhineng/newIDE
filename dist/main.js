"use strict";
var $__Services_46_js__,
    $__views_47_widgets_47_TabContainer_46_js__,
    $__common_46_js__;
var Services = ($__Services_46_js__ = require("./Services.js"), $__Services_46_js__ && $__Services_46_js__.__esModule && $__Services_46_js__ || {default: $__Services_46_js__}).default;
var TabContainer = ($__views_47_widgets_47_TabContainer_46_js__ = require("./views/widgets/TabContainer.js"), $__views_47_widgets_47_TabContainer_46_js__ && $__views_47_widgets_47_TabContainer_46_js__.__esModule && $__views_47_widgets_47_TabContainer_46_js__ || {default: $__views_47_widgets_47_TabContainer_46_js__}).default;
var Common = ($__common_46_js__ = require("./common.js"), $__common_46_js__ && $__common_46_js__.__esModule && $__common_46_js__ || {default: $__common_46_js__}).default;
function customMenu($node) {
  var tree = $("#projectCodeTree").jstree(true);
  var items = {
    'create_js': {
      "label": "Create JS",
      action: function(obj) {
        $('#createModal').modal();
        $node = tree.create_node($node);
        tree.edit($node);
        console.log('to create file');
      }
    },
    'create_api': {
      "label": "Create API",
      action: function(obj) {
        console.log('to create file');
      }
    },
    'create_folder': {
      "label": "Create Folder",
      action: function(obj) {
        console.log('to create folder');
      }
    },
    'rename': {
      'label': 'Rename',
      action: function() {
        tree.edit($node);
        console.log('to rename');
      }
    },
    'delete': {
      'label': 'Delete',
      action: function() {
        tree.delete_node($node);
        console.log('to delete');
      }
    }
  };
  if ($($node).hasClass("folder")) {
    delete items.delete;
  }
  return items;
}
function getParameterByName(name, url) {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
var selectNodePath;
function initFileTree() {
  var appId = getParameterByName("appId");
  var accessToken = getParameterByName("accessToken");
  var appType = getParameterByName("appType");
  Common.saveAppid(appId);
  Common.saveAccessToken(accessToken);
  Common.saveAppType(appType);
  Services.getUserInfo(function(d) {
    console.log('getUserInfo success:' + JSON.stringify(d));
    Common.saveUserName(d.name);
  }, function(errorMessage) {
    console.error('getUserInfo fail. because:' + JSON.stringify(errorMessage));
  });
  $('#projectCodeTree').jstree({
    'core': {
      "animation": 0,
      "check_callback": true,
      data: {
        url: "api/fileList",
        data: function(node) {
          var filePath = this.get_path(node, "/");
          return {
            'accessToken': accessToken,
            'appid': appId,
            'path': filePath || ""
          };
        },
        dataFilter: function(jsonData, type) {
          return dataTransfer(JSON.parse(jsonData));
        }
      }
    },
    'plugins': ["contextmenu", "dnd", "search", "conditionalselect", "state", "types", "wholerow"],
    'conditionalselect': function(node) {
      return this.is_leaf(node);
    },
    'contextmenu': {items: customMenu}
  }).bind('select_node.jstree', function(e, data) {
    var path = data.instance.get_path(data.node, "/");
    selectNodePath = path;
    openFile(path);
  }).on('delete_node.jstree', function(e, data) {
    var path = data.instance.get_path(data.node, "/");
    Services.deleteFile(path, function() {
      console.log('delete success.');
    }, function(errorMessage) {
      console.error('delete fail. because:' + errorMessage);
      data.instance.refresh();
    });
  }).on('create_node.jstree', function(e, data) {
    var path = data.instance.get_path(data.node, "/");
    createHandler(path, data);
  }).on('rename_node.jstree', function(e, data) {
    var targetFilePath = data.instance.get_path(data.node, "/");
    var sourceFilePath = targetFilePath.substring(0, targetFilePath.lastIndexOf('/')) + '/' + data.old;
    Services.renameFile(sourceFilePath, targetFilePath, function(d) {
      console.log('rename success.');
    }, function(errorMessage) {
      console.error('rename file fail. because:' + errorMessage);
      data.instance.refresh();
    });
  });
}
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function(e) {
  var activeTab = e.target;
  selectNodePath = activeTab.innerText;
});
function createHandler(path, data) {
  if (!path) {
    return;
  }
  ;
  if (path.indexOf('api') === 0) {
    Services.createAPI(data.node.text, null, function(d) {
      console.log('create API success.');
    }, function(errorMessage) {
      console.error('create API fail. because:' + errorMessage);
      data.instance.refresh();
    });
  } else if (path.indexOf('app') === 0) {
    Services.createFile(path, function(d) {
      console.log('create success.');
    }, function(errorMessage) {
      console.error('create file fail. because:' + errorMessage);
      data.instance.refresh();
    });
  }
}
function dataTransfer(originalDatas) {
  return $.map(originalDatas, function(original) {
    var fileName = original.name;
    var fileType;
    var fileIcon;
    if (fileName.indexOf('.') < -1) {
      fileType = 'folder';
      fileIcon = 'jstree-folder';
    } else if (fileName.indexOf('.png') > 0 || fileName.indexOf('.jpg') > 0) {
      fileType = 'image';
      fileIcon = 'fa fa-file-image-o';
    } else {
      fileType = 'code';
      fileIcon = 'fa fa-code';
    }
    return {
      'text': fileName,
      'children': original.dir == 1 ? true : false,
      'icon': fileIcon,
      'type': fileType
    };
  });
}
var codeEditContainer;
function initCodeContainer() {
  codeEditContainer = new TabContainer({targetId: 'contentArea'});
}
function openFile(filePath) {
  var editor;
  var filePathEncode = filePath.replace(/\//g, "_").replace(/\./g, "_").replace(/\s/g, "_");
  var openedTab = codeEditContainer.findTab(filePathEncode);
  if (openedTab) {
    editor = openedTab.getData('editor');
    codeEditContainer.active(filePathEncode);
  } else {
    var tab = codeEditContainer.addTab({
      tabTitle: filePath,
      id: filePathEncode
    });
    editor = initEditor({target: $('#codeArea' + tab.id)[0]});
    tab.setData('editor', editor);
    initEditorHeader({
      dom: $('#toolbar' + tab.id)[0],
      editor: editor
    });
  }
  Services.getFileContent(filePath, function(data) {
    console.log(data);
    editor.setValue(String(data), 1);
  }, function(errorMessage) {
    console.error(errorMessage);
  });
  editor.isFirstInit = true;
}
function initEditor(option) {
  var langTools = ace.require("ace/ext/language_tools");
  var editor = ace.edit(option.target);
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.renderer.setShowPrintMargin(false);
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    wrap: "free"
  });
  editor.on("input", function() {
    if (editor.isFirstInit) {
      editor.isFirstInit = false;
      return;
    }
    ;
    saveFile(editor.getValue());
  });
  var myCompleter = {getCompletions: function(editor, session, pos, prefix, callback) {
      var customerCompleter = [{
        name: 'myname',
        value: 'enterValue',
        score: 'mysocre',
        meta: "popMeta"
      }];
      if (prefix.length === 0) {
        callback(null, []);
        return;
      }
      callback(null, customerCompleter);
    }};
  langTools.addCompleter(myCompleter);
  return editor;
}
function saveFile(content) {
  Services.saveFile(selectNodePath, content, function(data) {
    console.log("save success");
  }, function(errorMessage) {
    return console.error(errorMessage);
  });
}
function initEditorHeader(option) {
  $('[name="saveButton"]', option.dom).on('click', function(e) {
    saveFile(option.getValue());
  });
}
var previewWin;
function run() {
  console.log('start running:' + selectNodePath);
  if (selectNodePath.startsWith('api')) {
    if (previewWin && !previewWin.closed) {
      previewWin.close();
    }
    var api = selectNodePath.substring(4, selectNodePath.indexOf('.'));
    var url = "hotapi/" + Common.getUserName() + '/' + Common.getAppid() + '/' + api;
    previewWin = window.open(url, '_blank');
    previewWin.focus();
  } else {
    alert('Currently we only support API preview. Please open one of your js file under \'api\' folder and press run again');
  }
}
Object.defineProperties(module.exports, {
  initFileTree: {get: function() {
      return initFileTree;
    }},
  initCodeContainer: {get: function() {
      return initCodeContainer;
    }},
  run: {get: function() {
      return run;
    }},
  __esModule: {value: true}
});
