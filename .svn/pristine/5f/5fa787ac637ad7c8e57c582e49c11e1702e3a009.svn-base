import axios from 'axios';
import { Loading, Message, MessageBox } from 'element-ui';
import router from '../routes/index';
import store from '../vuex/global';
import authService from './authservice';

// 超时时间
axios.defaults.timeout = 300000;

// http请求拦截器
let loadinginstace;
let loadingCount=0;

let promptDialog;

function tryCloseLoading()
{
	if (--loadingCount <= 0) {
		if(loadinginstace){
			loadinginstace.close();
			loadinginstace=null;
			loadingCount=0;
		}
	}
}

axios.interceptors.request.use(config => {
	// element ui Loading方法
	//console.log(config);
	var loadingOption= {
		fullscreen:true
	};
	if(config.data) {
		if(!config.data.simpleData){
			config.data.simpleData={};
		}
		if(config.data.simpleData.appId==='Other')
		{

		}else{
			config.data.simpleData.appId='SHT';
		 }
		
	}
	config.headers['X-AppId']='SHT';
	var companyId='';
	if(store.state && store.state.userCtx && store.state.userCtx.company){
		companyId=store.state.userCtx.company.companyId||'';
	}
	config.headers['X-CompanyId']=companyId;

	var tokenId='';
	if(store.state && store.state.userCtx && store.state.userCtx.userToken){
		tokenId=store.state.userCtx.userToken;
	}
	config.headers['X-TokenId']=tokenId;

	if(config.data && config.data.loadingOption){
		if(config.data.loadingOption.target){
			loadingOption.fullscreen=false;
		}
		loadingOption=Object.assign(loadingOption, config.data.loadingOption);    
	}
	if(!loadinginstace){
		loadinginstace = Loading.service(loadingOption);
	}
	loadingCount++;
	return config;
}, error => {  
	tryCloseLoading();
	Message.error({
		message: '加载超时'
	});
	return Promise.reject(error);
});
// http响应拦截器
axios.interceptors.response.use(data => {
	// 响应成功关闭loading
	tryCloseLoading();
	var result=data.data;
	
var messages=[];
	if(result && result.operationResult&& result.operationResult.simpleMessage){
		messages.push(result.operationResult.simpleMessage);
	}
	if(result && result.operationResult&&result.operationResult.complexMessage && result.operationResult.complexMessage.hasMessage){
		messages=messages.concat(result.operationResult.complexMessage.errorMessages)
			.concat(result.operationResult.complexMessage.warningMessages)
			.concat(result.operationResult.complexMessage.successMessages);
	}
	if(result && result.operationResult && result.operationResult.isSuccess===true){
		if(messages.length>0){//操作成功的消息提示
			Message.success({
				message: messages.join('\r\n')
			});
		}
	}
	
	if(result && result.operationResult && result.operationResult.isSuccess===false){
		if(messages.length>0){//操作失败的消息提示
			Message.error({
				message: messages.join('\r\n')
			});
		}
		
		throw new Error( messages.join('\r\n'));
	}


	return data;
}, error => {
	tryCloseLoading();

	if (error.response && error.response.status===401) {
		if( ! promptDialog){
			promptDialog=MessageBox.prompt;
			// 服务请求返回401错误时，弹出窗口输入密码重新登录
			return promptDialog('请输入密码', '会话过期', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /[\w@!#$%&'*+/=?^_`{|}~\-\.\[\]:;|"<>()]{6,16}/,
				inputErrorMessage: '密码格式不正确(必须是6-16位字母符号或数字组合）',
				inputType:'password'
			})
			.then(({ value }) => {        
				return authService.login({
						userName: store.state.userCtx.userName, 
						password: value,
						//任何post参数中都可以携带这个参数来干预Loading配置
						loadingOption:{
							target:'.el-message-box',
							text:'正在登录……'
						}
					})
					.then(resp=>{
						promptDialog=null;
						window.location.reload();
						return Promise.resolve(resp);
					});
			})
			.catch((err) => {
				router.replace({name:'login'})
			});
		}
		return;
	}

	var errorMessage=error.message;
	if(error.response && error.response.data && error.response.data.responseStatus){
		errorMessage=error.response.data.responseStatus.message;    
	}
	if(!errorMessage 
		&& error.response.data
		&& error.response.headers 
		&& error.response.headers['content-type']
	&&  error.response.headers['content-type'].indexOf('text/html')>=0)
	{
		errorMessage=error.response.data;
	}
	if(errorMessage){
		Message.error({
			message: errorMessage
		});
	}
	return Promise.reject(error);
});

export default axios;