
import axios from './axios';
import store from '../vuex/global';
module.exports = {
	login(args) {
		var that = this;
		return axios.post('/auth/credentials', args)
			.then(res => {
				args.response = res;

				store.commit('userCtx', {
					userId: res.data.userId,
					userName: res.data.userName,
					displayName: res.data.displayName,
					userToken: res.data.meta.usertoken
				});
				that.rememberSessionData(res.data.meta || {});
				return axios.post('/dynamic/sys_mainfw?operationno=getsysinfo', {})
					.then(res2 => {
						var srvData = res2.data.operationResult.srvData;

						var fileInfo = srvData.fileServerInfo;
						//自动补全 fsApiUrl 最后的斜杠
						if (fileInfo && fileInfo.fsApiUrl) {
							if (fileInfo.fsApiUrl[fileInfo.fsApiUrl.length - 1] !== '/') {
								fileInfo.fsApiUrl += '/';
							}
						}
						store.commit('userCtx', { upApi: fileInfo });

						args.sysinfo = res2;
						return Promise.resolve(args);
					})
					.catch(error => {
						return Promise.reject(error);
					});

			})
			.catch(error => {
				return Promise.reject(error);
			});
	},

	logout() {
		return axios.get('/auth/logout');
	},

	rememberSessionData(data) {
		var linkIdInfo = {};
		if (data && data.merchantData) {
			linkIdInfo = JSON.parse(data.merchantData);
			axios.post('/bill/ydj_customer.json?operationno=initbill', { selectedRows: [{ pkValue: linkIdInfo.id }] }).then(a => {
				store.commit('userCtx', { userHead: a.data.operationResult.srvData.uiData.fimage.id, isMonthlyaccount: a.data.operationResult.srvData.uiData.fopenmonthlyaccount })
			})
		}
		var companyInfo = [];
		if (data && data.companys) {
			companyInfo = JSON.parse(data.companys);
		}
		var company = {};
		if (data && data.company) {
			company = JSON.parse(data.company);
		}
		store.commit('userCtx', {
			isLoggedIn: true,
			linkIdentity: linkIdInfo,
			companys: companyInfo,
			company: company,
			isPlatform: store.state.userCtx.platformCode == company.companyId
		});
	}
};