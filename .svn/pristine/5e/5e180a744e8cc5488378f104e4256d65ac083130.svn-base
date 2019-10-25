<template>
  <div class="login" ref="login">
    <div class="w block-center relative">
      <div class="login-panel">
        <h5 class="text-center">账号密码登录</h5>
        <el-form :model="uiData" :rules="rules" ref="uiData">
          <el-alert v-if="alert.visible" :title="alert.message" :type="alert.type" show-icon></el-alert>
          <el-form-item label prop="userName">
            <el-autocomplete v-model="uiData.userName" prefix-icon="el-icon-phone" placeholder="账号/用户名/手机号" :fetch-suggestions="queryUserName" @keyup.enter.native="login"></el-autocomplete>
          </el-form-item>
          <el-form-item label prop="password">
            <el-input v-model="uiData.password" prefix-icon="el-icon-tickets" placeholder="密码" type="password" @keyup.enter.native="login"></el-input>
          </el-form-item>
        </el-form>
        <div class="relative">
          <el-checkbox v-model="checked" @click.native="ClearUserName">记住账号</el-checkbox>
          <router-link class="right absolute" to="resetpwd">忘记密码?</router-link>
        </div>
        <button id="login" @click="login">登录</button>
        <div class="relative">
          <router-link :to="{path:'/register',query:{type:0}}">普通用户注册</router-link>
          <router-link class="right absolute" :to="{path:'/register',query:{type:1}}">VIP用户注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
	data() {
		return {
			checked: false,
			uiData: {
				userName: '',
				password: '',
				autoLogin: false
			},
			//登录过的用户列表
			loginUserList: [],
			alert: {
				visible: false,
				message: '',
				type: 'info'
			},
			rules: {
				userName: [{required: true, message: '请输入用户名', trigger: 'blur'}],
				password: [{required: true, message: '请输入用户密码', trigger: 'blur'}]
			}
		};
	},
	methods: {
		//处理用户名自动完成逻辑
		queryUserName(queryString, cb) {
			var loginUserList = this.loginUserList;
			var results = queryString ? this._.filter(loginUserList, o => o.indexOf(queryString) >= 0) : loginUserList;
			results = this._.chain(results)
				.map(o => Object.create({}, {value: {value: o}}))
				.value();
			cb(results);
		},

		//点击登录
		login: function() {
			let t = this;
			this.alert.message = '正在登录……';
			this.$refs['uiData'].validate(valid => {
				if (valid) {
					t.authService
						.login({
							userName: t.uiData.userName,
							password: t.uiData.password,
							//任何post参数中都可以携带这个参数来干预Loading配置
							loadingOption: {
								target: '.login-rightbox',
								text: '正在登录……'
							}
						})
						.then(data => {
							t.alert.visible = true;
							t.alert.message = '登录成功……';
							t.loginUserList = t._.chain(t.loginUserList)
								.pull(t.uiData.userName)
								.concat(t.uiData.userName)
								.value();
							t.$localStorage.set('loginUserList', JSON.stringify(t.loginUserList || []));
							if (t.checked) {
								t.$localStorage.set('userName', t.uiData.userName);
							}
							let redirect = this.$store.state.pageStatus.history;
							t.$router.push({
								path: t.comm.IsNullOrEmpty(redirect) ? '/home' : redirect
							});
						})
						.catch(error => {
							var resp = error.response;
							if (resp && resp.data && resp.data.responseStatus) {
								t.alert.message = resp.data.responseStatus.message;
							} else {
								t.alert.message = '网络连接超时，请重试';
							}
							t.alert.type = 'error';
							t.alert.visible = true;
							console.log(error);
						});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		ClearUserName: function() {
			if (this.checked) {
				this.$localStorage.remove('userName');
			}
		}
	},
	mounted() {
		let w = document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight;
		w = w - 172 > 760 ? 760 : w - 172;
		this.$refs.login.style.height = Math.max(w, 534) + 'px';
		this.checked = this.$localStorage.get('userName') ? !0 : !1;
		this.uiData.userName = this.$localStorage.get('userName');
		this.loginUserList = JSON.parse(this.$localStorage.get('loginUserList') || '[]');
		this.$store.commit('header', {caption: '欢迎登录左右手下单系统'});
		this.$store.commit('userCtx', {
			company: {},
			userToken: '',
			isLoggedIn: false
		});
	},
	dependencies: ['authService']
};
</script>

<style lang="scss">
.login {
	height: 534px;
	background: url(../assets/images/login_bg1.png) center -121px;
	min-width: 1200px;
	h1 {
		color: #0086e4;
		padding-top: 200px;
		font-size: 72px;
		font-weight: bold;
	}
	h3 {
		color: #0086e4;
		padding-top: 20px;
		font-size: 36px;
		font-weight: normal;
	}
	.login-panel {
		width: 290px;
		height: 290px;
		padding: 33px;
		background: rgba(255, 255, 255, 0.4);
		position: absolute;
		left: 50%;
		top: 89px;
		margin-left: 299px;
		h5 {
			font-size: 18px;
			font-weight: normal;
			margin: 5px;
		}
		a {
			color: #0086e4;
			font-size: 14px;
			text-decoration: none;
			&:hover {
				text-decoration: underline;
			}
		}
		.el-autocomplete {
			width: 100%;
		}
		button {
			width: 100%;
			height: 42px;
			background: #0086e4;
			color: #fff;
			font-size: 16px;
			border-radius: 4px;
			margin: 15px 0;
		}
	}
}
</style>