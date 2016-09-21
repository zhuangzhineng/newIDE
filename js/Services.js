import HttpRequest from './HttpRequest.js'
import Common from './common.js'

let updateFileTimer;

export default class Services{

	static getTables(successFn,errorFn){
		HttpRequest.get("api/tableList?appid=" + Common.getAppid(),{
			success:successFn,
			error:errorFn
		});
	}
	static getTable(tableName,successFn,errorFn){
		HttpRequest.get('api/tableDetail?tableName='+tableName,{
			success:successFn,
			error:errorFn
		});
	}

	static getFiles(Folder,successFn,errorFn){
		let path = (Folder===undefined)?'':'&path='+Folder;
		let token = '&accessToken=' + Common.getAccessToken();
		HttpRequest.get('api/fileList?appid=' + Common.getAppid() + path + token, {
			success:successFn,
			error:errorFn
		});
	}

	static getFileContent(path,successFn,errorFn){
		let filePath = (path===undefined)?'':'&path='+path;
		let token = '&accessToken=' + Common.getAccessToken();
		let url = 'api/file?appid=' + Common.getAppid() + filePath + token;
		HttpRequest.get(url, {
			dataType:'text',
			success:successFn,
			error:errorFn
		});
	}

	static saveFile(filePath,fileContent,successFn,errorFn){
		/*let fileContentStream = new Blob([fileContent],{'type':'multipart/form-data'});
		let formData = new FormData();
		formData.append("data",fileContentStream);*/
		let token = '&accessToken=' + Common.getAccessToken();
		let type = '&appType=' + Common.getAppType();
		clearTimeout(updateFileTimer);
		updateFileTimer = setTimeout(function(){
			HttpRequest.post('api/updateFile?appid=' + Common.getAppid() + '&path='+filePath + token + type,{
				data:fileContent,
				success:successFn,
				error:errorFn
			});
		}, 500);
	}

	static deleteFile(filePah,successFn,errorFn){
		HttpRequest.post('api/deleteFile?&accessToken=' + Common.getAccessToken(),{
			data:JSON.stringify({
				appid:Common.getAppid(),
				path:filePah
			}),
			success:successFn,
			error:errorFn
		})
	}


	static createFile(folderPath,successFn,errorFn){
		HttpRequest.post('api/createFile?&accessToken=' + Common.getAccessToken(),{
			data:JSON.stringify({
				appid:Common.getAppid(),
				path:folderPath
			}),
			success:successFn,
			error:errorFn
		})
	}

	static uploadFile(folderPath,successFn,errorFn){
		HttpRequest.post('api/uploadFile?accessToken=' + Common.getAccessToken()+'&appid='+
			Common.getAppid() + '&path='+folderPath,{
			data:null,
			success:successFn,
			error:errorFn
		})
	}


	static renameFile(sourceFile,targetFile,successFn,errorFn){
		HttpRequest.post('api/renameFile?appid=' + Common.getAppid() + '&src='+sourceFile+'&dst='+targetFile + '&accessToken=' + Common.getAccessToken(),{
			success:successFn,
			error:errorFn
		})
	}

	static getUserInfo(successFn,errorFn){
		HttpRequest.get('api/getUserInfo?accessToken=' + Common.getAccessToken(),{
			success:successFn,
			error:errorFn
		})
	}
}