<template>
  <div class="register block-center">
    <div>
     <Agreement title="商户注册服务协议" :visible.sync="visible" show="register"></Agreement>
      <el-dialog :visible.sync="registerVisible" title="注册选项" :close-on-press-escape="false" :show-close="false" :close-on-click-modal="false">
        <span>您是否有企业注册码？</span>
        <div slot="footer" class="text-center">
          <el-button @click="usertype=1;registerVisible=!1">是</el-button>
          <el-button @click="usertype=0;registerVisible=!1">否</el-button>
        </div>
      </el-dialog>
      <el-form :rules="rules" :model="form" label-width="100px" class="block-center" ref="form">
        <el-form-item label="手机号" prop="phone" is-required>
          <el-input v-model="form.phone" placeholder="请填写注册手机号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifCode" is-required>
          <el-input v-model="form.verifCode" placeholder="请填写验证码" size="small" class="i5"></el-input>
          <el-button @click="OtherClick('getVerifCode')" :disabled="codeDisabled" size="small" class="i5">{{codeMessage}}</el-button>
        </el-form-item>
        <!-- vip用户 -->
        <div v-if="usertype===1">
          <el-form-item label="注册类型" prop="merchantVal">
            <el-select v-model="form.merchantVal" placeholder="请选择注册类型" size="small">
              <el-option v-for="item in merchant" :key="item.a" :label="item.b" :value="item.a"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务性质" prop="serverNature" size="small">
            <el-select v-model="form.serverNature" placeholder="请选择服务性质">
              <el-option v-for="item in serverN" :key="item.a" :label="item.b" :value="item.a"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业代码" prop="joinEnterpriseId">
            <el-input v-model="form.joinEnterpriseId" placeholder="请填写注册企业代码" size="small"></el-input>
          </el-form-item>
          <el-form-item label="商家名称" prop="merchantName">
            <el-input v-model="form.merchantName" placeholder="请填写商家名称" size="small"></el-input>
          </el-form-item>
          <el-form-item label="商家联系人" prop="merchantContact">
            <el-input v-model="form.merchantContact" placeholder="请填写商家联系人" size="small"></el-input>
          </el-form-item>
          <el-form-item label="所在地" prop="city.fcity" is-required>
            <City v-model="city" size="small"></City>
          </el-form-item>
        </div>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请填写密码" size="small"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input type="password" v-model="form.password2" placeholder="请再次填写密码" size="small"></el-input>
        </el-form-item>
        <el-form-item label-width="0" class="text-center">
          <el-checkbox label="我同意" v-model="agreementBoll"></el-checkbox>
          <a @click="visible =!0" href="javascript:void(0)">《商户注册服务协议》</a>
        </el-form-item>
        <el-form-item label-width="0" class="text-center">
          <el-button type="primary" @click="OtherClick('register')" size="small">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			registerVisible: !0,
			usertype: 0, //用户注册类型 0普通用户 1VIP用户
			visible: !1, //协议窗口控制
			codeDisabled: !0,
			codeMessage: '获取验证码',
			agreementBoll: !1,
			merchant: [
				//商家类型选项
				{
					a: 'merchant_type01',
					b: '商家'
				},
				{
					a: 'merchant_type02',
					b: '厂家'
				},
				{
					a: 'merchant_type03',
					b: '电商'
				},
				{
					a: 'merchant_type04',
					b: '装修公司'
				},
				{
					a: 'merchant_type05',
					b: '个人'
				}
			],
			serverN: [
				{
					a: 'merchant_servernature01',
					b: '全屋整装'
				},
				{
					a: 'merchant_servernature02',
					b: '定制家具'
				},
				{
					a: 'merchant_servernature03',
					b: '橱柜'
				},
				{
					a: 'merchant_servernature04',
					b: '门窗'
				},
				{
					a: 'merchant_servernature05',
					b: '成品柜类'
				}
			],
			city: [],
			form: {
				verifCode: '',
				phone: '',
				password: '', //密码
				password2: '', //确认密码
				merchantVal: '',
				serverNature: '', //服务性质
				joinEnterpriseId: '', //企业代码
				merchantName: '', //商家名称
				merchantContact: '', //商家联系人
				city: {
					fprovince: '',
					fcity: '',
					fregion: ''
				}
			},
			rules: {
				phone: [
					{
						validator: (a, b, c) => {
							if (!/^((\+?86)|(\(\+86\)))?1[3-9][0-9]{9}$/.test(b)) {
								this.codeDisabled = !0;
								return c(new Error('请输入正确的手机号'));
							}
							this.codeDisabled = !1;
							c();
						},
						trigger: 'blur'
					}
				],
				verifCode: [
					{
						validator: (a, b, c) => {
							if (!/^\d{4}$/.test(b)) {
								c(new Error('验证码必须为四位数字'));
							} else {
								c();
							}
						},
						trigger: 'blur'
					}
				],
				merchantVal: [{required: true, message: '请选择注册类型', trigger: 'blur'}],
				serverNature: [{required: true, message: '请选择服务性质', trigger: 'blur'}],
				joinEnterpriseId: [{required: true, message: '请输入注册企业代码', trigger: 'blur'}],
				merchantName: [{required: true, message: '请输入商家名称', trigger: 'blur'}],
				merchantContact: [{required: true, message: '请输入商家联系人', trigger: 'blur'}],
				'city.fcity': [{required: true, message: '请至少选择至市', trigger: 'change'}],
				password: [
					{required: true, message: '请输入密码', trigger: 'blur'},
					{
						validator: (a, b, c) => {
							if (!/^\S{6,16}$/.test(b)) {
								return c(new Error('请输入6到16位长度的密码'));
							}
							c();
						},
						trigger: 'blur'
					}
				],
				password2: [
					{required: true, message: '请再次输入密码', trigger: 'blur'},
					{
						validator: (a, b, c) => {
							if (!/^\S{6,16}$/.test(b)) {
								return c(new Error('请输入6到16位长度的密码'));
							}
							if (b !== this.password && !b == this.password) {
								return c(new Error('两次输入密码不一致'));
							}
							c();
						},
						trigger: 'blur'
					}
				]
			}
		};
	},
	methods: {
		OtherClick(a) {
			let t = this;
			switch (a) {
				case 'getVerifCode':
					var timer;
					let times = 60;
					t.axios.get('/sms/code?format=json&mobilePhone=' + t.form.phone.trim(), {}).then(res => {
						if (res.data.operationResult.isSuccess === true) {
							t.codeDisabled = true;
							t.codeMessage = '60秒后重试';
							timer = setInterval(function() {
								--times;
								if (times == 0) {
									t.codeDisabled = false;
									t.codeMessage = '获取验证码';
									clearInterval(timer);
								} else {
									t.codeMessage = times + '秒后重试';
								}
							}, 1000);
						} else {
							t.$message({
								message: '验证码发送失败',
								type: 'error'
							});
						}
					});
					break;
				case 'register':
					t.$refs['form'].validate(valid => {
						if (!valid) {
							return false;
            }
            if(!t.agreementBoll)
            {
              	t.$message({
								message: '您必须同意注册协议',
								type: 'warning'
              });
              return false;
            }
						t.axios.get('/sms/code/validate.json?mobilePhone=' + t.form.phone.trim() + '&authCode=' + t.form.verifCode, {}).then(res => {
							if (res.data.operationResult.isSuccess === true) {
								t.active = 1;
							} else {
								t.$message.error('验证码错误');
							}
						});
						t.axios
							.post('/reguser', {
								activeCode: t.form.verifCode,
								company: '',
								joinCode: t.form.verifCode,
								phoneNumber: t.form.phone,
								userName: t.form.phone,
								userType: '32768',
								passWord: t.form.password,
								rePassword: t.form.password2,
								meta: {
									registerRole: '商户通用户',
									merchant_type: t.usertype == 0 ? 'merchant_type05' : t.form.merchantVal,
									joinEnterpriseId: t.usertype == 0 ? t.$route.query.companyid: t.form.joinEnterpriseId,
									fname: t.usertype == 0 ? t.form.phone : t.form.merchantName,
									fduty: t.usertype == 0 ? t.form.phone : t.form.merchantContact,
									fservernature: t.form.serverNature,
									fphone: t.form.phone,
									fprovince: t.form.city.fprovince,
									fcity: t.form.city.fcity,
									fregion: t.form.city.fregion,
                  faddress: '',
                  // companyid:'91440300349878211L',
                  // masterid:'442277257441054720'
                  companyid:t.$route.query.companyid,
                  masterid:t.$route.query.masterid

								}
							})
							.then(res => {
								if (res && res.status == '200') {
                  t.$alert("您已注册成功，请登录电脑端进行下单！")
								}
							});
					});
					break;
			}
		}
	},
	watch: {
		city(v) {
			this.form.city.fprovince = v[0] || '';
			this.form.city.fcity = v[1] || '';
			this.form.city.fregion = v[2] || '';
		}
	},
	created() {
		this.usertype = this.$route.query.type || 0;
		this.$store.commit('header', {caption: '欢迎注册左右手下单系统'});
	},
	dependencies: ['authService']
};
</script>

<style lang="scss">
.el-dialog {
	width: auto;
}
.el-message-box{width: 300px}
.el-form-item__error {
	top: 34px;
}
.el-input__inner {
	padding: 0 0 0 5px;
}
body {
	font: 12px/1.5 'Microsoft YaHei', NSimSun, SimHei, Verdana, Arial, sans-serif;
	background: #fff;
}
header {
	display: none;
}
footer {
	display: none;
}
.register {
	.el-form-item {
		margin-bottom: 8px;
	}
	> div {
		padding-top: 30px;
	}
	.title {
		height: 10%;
		line-height: 10%;
		font-size: 24px;
		border-bottom: 1px #cacccd solid;
		> div {
			position: absolute;
			font-size: 14px;
		}
		a {
			color: #0086e4;
			text-decoration: none;
			position: relative;
			&:hover {
				text-decoration: underline;
			}
		}
	}
	.success {
		margin: 50px auto;
		i {
			color: #5bc92e;
			font-size: 45px;
			margin-left: 50px;
			display: inline-block;
		}
		> span {
			font-size: 24px;
			margin-left: 20px;
			display: inline-block;
			height: 45px;
			line-height: 45px;
			vertical-align: top;
		}
		button.el-button--primary {
			margin-left: 80px;
			margin-top: 80px;
		}
	}
	.el-form {
		width: 320px;
		a {
			color: #0086e4;
		}
		button.el-button--primary,
		.el-select {
			width: 180px;
		}
		.el-input {
			width: 185px;
		}
		.i5.el-button,
		.i5.el-input {
			width: 90px;
		}
	}
}
</style>
