import Services from './Services.js'
import TabContainer from './views/widgets/TabContainer.js'
import Common from './common.js'
import CONST from './Constant.js'

function customMenu ($node) {
	let tree = $("#projectCodeTree").jstree(true);
	let items = {
        'create_js' : {
            "label" : "Create JS",
            action : function (obj) {
            	$('#createModal').modal();
            	$node = tree.create_node($node);
                tree.edit($node);
                console.log('to create file');
            }
        },
        'create_api' : {
            "label" : "Create API",
            action : function (obj) {

                console.log('to create file');
            }
        },
        'create_folder' : {
            "label" : "Create Folder",
            action : function (obj) { 
            	console.log('to create folder');
            }
        },
        'rename':{
        	'label':'Rename',
        	action:function () {
        		tree.edit($node);
        		console.log('to rename');
        	}
        },
        'delete':{
        	'label':'Delete',
        	action:function () {
        		tree.delete_node($node);
        		console.log('to delete');
        	}
        },
        'import':{
        	'label':'import',
        	action:function () {
        		console.log("import....");
        		window.location.href = "uploadFile.html?appid="+Common.getAppid()+"&accessToken="+Common.getAccessToken()+"&redirect="+window.location;
        	}
        }
    }
    if ($($node).hasClass("folder")) {
        delete items.delete;
    }
    return items;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let selectNodePath;
export function initFileTree () {
	let appId = getParameterByName("appId");
	let accessToken = getParameterByName("accessToken");
	let appType = getParameterByName("appType");
	Common.saveAppid(appId);
	Common.saveAccessToken(accessToken);
	Common.saveAppType(appType);
	Services.getUserInfo((d)=>{
		console.log('getUserInfo success:' + JSON.stringify(d));
		Common.saveUserName(d.name);
	},(errorMessage)=>{
		console.error('getUserInfo fail. because:' + JSON.stringify(errorMessage));
	})

	$('#projectCodeTree').jstree({
		'core':{
			"animation" : 0,
		    "check_callback" : true,
			data:{
				url:"api/fileList",
				data : function (node) {
					let filePath = this.get_path(node,"/");
					return {'accessToken':accessToken, 'appid':appId, 'path' : filePath||""};
				},
				dataFilter: (jsonData,type)=> {
					return dataTransfer(JSON.parse(jsonData));
				}
			}
		},
		'plugins' : [
		    "contextmenu", "dnd", "search","conditionalselect",
		    "state", "types", "wholerow"
		],
		'conditionalselect' : function (node) { 
			return this.is_leaf(node); 
		},
		'contextmenu' : {
	        items : customMenu
	    }
	}).bind('select_node.jstree',(e,data)=>{
		let path = data.instance.get_path(data.node,"/");
		selectNodePath = path;
		openFile(path);
	}).on('delete_node.jstree', function (e, data) {
		let path = data.instance.get_path(data.node,"/");
		Services.deleteFile(path,()=>{
			console.log('delete success.');
		},(errorMessage)=>{
			console.error('delete fail. because:'+errorMessage);
			data.instance.refresh();
		})
	}).on('create_node.jstree', function (e, data) {
		//$('#createModal').modal();
		let path = data.instance.get_path(data.node,"/");
		createHandler(path,data);
		
	}).on('rename_node.jstree', function (e, data) {
		let targetFilePath = data.instance.get_path(data.node,"/");
		let sourceFilePath = targetFilePath.substring(0,targetFilePath.lastIndexOf('/'))+'/'+data.old;
		Services.renameFile(sourceFilePath,targetFilePath,(d)=>{
			console.log('rename success.');
		},(errorMessage)=>{
			console.error('rename file fail. because:'+errorMessage);
			data.instance.refresh();
		});
	});
}

$(document).on('shown.bs.tab', 'a[data-toggle="tab"]',function (e) {
  let activeTab = e.target; // newly activated tab
  selectNodePath = activeTab.innerText;
})

function createHandler (path,data) {
	if (!path) {return;};
	if (path.indexOf('api')===0) {
		Services.createAPI(data.node.text,null,d=>{
			//data.instance.set_id(data.node, d.id);
			console.log('create API success.');
		},errorMessage=>{
			console.error('create API fail. because:'+errorMessage);
			data.instance.refresh();
		})
	}else if(path.indexOf('app')===0){
		Services.createFile(path,d=>{
			//data.instance.set_id(data.node, d.id);
			console.log('create success.');
		},errorMessage=>{
			console.error('create file fail. because:'+errorMessage);
			data.instance.refresh();
		})
	}
}

function dataTransfer (originalDatas) {
	return $.map(originalDatas,(original)=>{
		let fileName = original.name;
		let fileType;
		let fileIcon;
		if (fileName.indexOf('.')<-1) {
			fileType = 'folder';
			fileIcon = 'jstree-folder';
		}else if(fileName.indexOf('.png')>0||fileName.indexOf('.jpg')>0){
			fileType = 'image';
			fileIcon = 'fa fa-file-image-o';
		}else{
			fileType = 'code';
			fileIcon = 'fa fa-code';
		}
		return {
			'text':fileName,
			'children':original.dir==1?true:false,
			'icon':fileIcon,
			'type':fileType
		}
	});
}

let codeEditContainer;
export function initCodeContainer(){
	codeEditContainer = new TabContainer({targetId:'contentArea'});
}
function openFile (filePath) {
	let editor;
	let filePathEncode = filePath.replace(/\//g,"_").replace(/\./g,"_").replace(/\s/g,"_");
	let openedTab = codeEditContainer.findTab(filePathEncode);
	if(openedTab){
		editor = openedTab.getData('editor');
		codeEditContainer.active(filePathEncode);
	}else{
		let tab = codeEditContainer.addTab({tabTitle:filePath,id:filePathEncode});
		editor = initEditor({target:$('#codeArea'+tab.id)[0]});
		tab.setData('editor',editor);
		initEditorHeader({
			dom:$('#toolbar'+tab.id)[0],
			editor:editor
		});
	}
	
	Services.getFileContent(filePath,data=>{
		console.log(data);
		editor.setValue(String(data),1);
	},errorMessage=>{
		console.error(errorMessage);
		//editor.setValue(errorMessage.responseText,1);
	});
	editor.isFirstInit = true;
}

//let editor;
function initEditor (option) {
	let langTools = ace.require("ace/ext/language_tools");
	let editor = ace.edit(option.target);
	editor.setTheme("ace/theme/iplastic");
    editor.getSession().setMode("ace/mode/javascript");
    editor.renderer.setShowPrintMargin(false);
    editor.setOptions({
    	enableBasicAutocompletion:true,
    	enableSnippets:true,
    	enableLiveAutocompletion:true,
    	wrap:"free"
    });
    editor.on("input", function() {
    	if (editor.isFirstInit) {
    		editor.isFirstInit = false;
    		return;
    	};
    	saveFile(editor.getValue());
	});
    let myCompleter = {
        getCompletions: (editor, session, pos, prefix, callback)=>{
        	let customerCompleter = [{
        		name: 'myname', 
        		value: 'enterValue', 
        		score: 'mysocre', 
        		meta: "popMeta"
        	}];
            if (prefix.length === 0) { 
            	callback(null, []); 
            	return;
            }
            callback(null,customerCompleter)
        }
    }
    langTools.addCompleter(myCompleter);
    return editor;
}

function saveFile (content) {
	Services.saveFile(selectNodePath,content,data=>{
		console.log("save success")
	},errorMessage=>console.error(errorMessage));
}

function initEditorHeader (option) {
	$('[name="saveButton"]',option.dom).on('click',e=>{
		saveFile(option.getValue());
	});
}

let previewWin;
export function run(){
	console.log('start running:' + selectNodePath);
	if (selectNodePath.startsWith('api')) {
		if (previewWin && !previewWin.closed) {
			previewWin.close();
		}
		let api = selectNodePath.substring(4, selectNodePath.indexOf('.'));
		let url = "hotapi/" + Common.getUserName() + '/' + Common.getAppid() + '/' + api;
		previewWin = window.open(url, '_blank');
		
		previewWin.focus();
	} else {
		startPackage();
	}
}


let consoleTerminal;
export function initConsoleTerminal(){
	consoleTerminal = $('#consoleDiv').terminal(function(command, term) {
            if (command !== '') {
                let result = window.eval(command);
                if (result != undefined) {
                    term.echo(String(result));
                }
            }
    }, {
        greetings: 'Server console log',
        name: 'consoleLog',
        height: 120,
        width: 'calc(100% - 2em)',
        prompt: '> '
    });
    //consoleTerminal.pause();
}

function echoResult (result) {
	consoleTerminal.echo(result,{
		finalize:function (div) {
			div.css({'color':'green'});
		}
	});
}

let consoleConnect;
export function initConsoleConnect () {
	consoleConnect = new WebSocket(CONST.WS_SERVER_CONSOLE,'play_protocol');
	consoleConnect.onopen = function () {
		console.log('connect open');
		let appid = Common.getAppid();
		let user = Common.getUserName();
		let updateMsg = JSON.stringify({
		    method : 'register',
		    tag: appid + 'WECLOUD!@#' + user,
		    device : 'ide'
		});
		consoleConnect.send(updateMsg);
	}
	consoleConnect.onmessage = function (message) {
		console.log('receive: '+message.data+' from server.')
		echoResult(String(message.data));
	}
	consoleConnect.onerror = function (error) {
		console.log(error);
	}

	initConnect();
	return consoleConnect;
}

let connect;
function initConnect () {
	connect = new WebSocket(CONST.WS_PACKAGE_HOST,'play_protocol');
	connect.onopen = function () {
		console.log('connect open');
	}
	connect.onmessage = function (message) {
		console.log('receive: '+message.data+' from server.')
		try {
			var obj = JSON.parse(message.data);
			echoResult(obj.msg);
			if (obj.publicKey) {
				console.log('got public key, update simulator. key:' + obj.publicKey);
				common.setAppetizePublicKey(obj.publicKey, obj.platform);

				var device = $('#device_select').val();
				var iframe = $('#simulator');
				var url = "https://appetize.io/embed/" + obj.publicKey + "?device=" + device + "&scale=100&autoplay=true&orientation=portrait&deviceColor=black";
				iframe.attr('src', url);
			}
		} catch(e) {
			console.log('packaging exception:' + e);
		}
	}
	connect.onerror = function (error) {
		console.log(error);
	}
	return connect;
}

function startPackage() {
	var device = $('#device_select').val();
	let targetPlatform = common.getPlatformWithDevice(device);
	let userName = common.getUserName();
    let appid = common.getAppid();
    let accessToken = common.getAccessToken();
    let appType = common.getAppType();
    let productType = 'device';
    // when appType is null, it means we are testing locally
    if (appType === 'null') {
    	appType = 'cordova';
    }
    if (targetPlatform == 'ios') {
		productType = 'simulator';
    }
	connect.send(JSON.stringify({
		method:'package',
		appid:appid,
		user:userName,
		accessToken: accessToken,
		platform:targetPlatform,
		appType:appType,
		productType:productType
	}));
}

