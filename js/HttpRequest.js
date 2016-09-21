export default class HttpRequest {

	static post(...setting){
		this._ajax("POST", ...setting);
	}

	static get(...setting){
		this._ajax("GET", ...setting);
	}

	static _ajax(methodType='GET', ...setting){
		let option = setting.length>1?setting[1]:setting[0];
		let optionOriginal = Object.assign({},option);
		Object.assign(option, {
			contentType:'application/json;charset=utf-8',
			dataType:'json',
			method:methodType,
			statusCode:{
				200:(data)=> {
					console.log('success receive:'+data);
				},
				405:(error)=> {
					console.error('error message:'+error);
				}
			}
		},optionOriginal);
		console.log(setting);
		$.ajax(...setting);
	}

}
