import CONST from './Constant.js'
import Common from './common.js'

let connect;
export function initConnect () {
	connect = new WebSocket(CONST.WS_PACKAGE_HOST,'play_protocol');
	connect.onopen = function () {
		console.log('connect open');
	}
	connect.onmessage = function (message) {
		console.log('receive: '+message.data+' from server.')
		echoResult(message.data+"");
	}
	connect.onerror = function (error) {
		console.log(error);
	}
	return connect;
}


$('.btn-package-go').on('click',function (e) {
	let targetPlatform = $(e.target).attr('data');
	let userName = common.getUserName();
    let appid = common.getAppid();
    let accessToken = common.getAccessToken();
    let appType = common.getAppType();
	connect.send(JSON.stringify({
		method:'package',
		appid:appid,
		user:userName,
		accessToken: accessToken,
		platform:targetPlatform,
		appType:appType
	}));
});


function echoResult (result) {
	terminal.echo(result);
}
let terminal;
export function initTerminal(){
	terminal = $('#termDiv').terminal(function(command, term) {
            if (command !== '') {
                let result = window.eval(command);
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