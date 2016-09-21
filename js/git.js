import CONST from './Constant.js'
let connect;
let terminal;
export function initConnect () {
	connect = new WebSocket(CONST.WS_GIT_HOST,'play_protocol');
	connect.onopen = function () {
		console.log('connect open');
	}
	connect.onmessage = function (message) {
		console.log('receive: '+message.data+' from server.');
		terminal.echo(String(message.data));
		terminal.resume();
	}
	connect.onerror = function (error) {
		console.log(error);
		terminal.error(String(error));
	}
	return connect;
}
export function initTerminal(){
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

function buildGitCommand (message) {
	return {
		method:'git',
		appid:window.localStorage.appid,
		user:window.localStorage.userName,
		cmd: message
	};
}


