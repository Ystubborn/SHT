<template>
  <div class="resetpwd">
    <div class="w block-center">
      <div class="title relative">请使用注册的手机号找回密码
        <div class="absolute right top">如无法通过手机找回，请拨打客服电话 <span>0755-2655 5944</span> 寻求帮助
        </div>
      </div>
      <el-form :model="block_one" v-if="active===0" :rules="rules" ref="block_one" label-width="160px" class="block-center">
        <el-form-item label="手机号" prop="phone" is-required>
          <el-input v-model="block_one.phone" placeholder="请填写注册手机号"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verifCode" :rules="comm.rules.code" is-required>
          <Verifcode :value.sync="block_one.verifCode" :phone="block_one.phone"></Verifcode>
        </el-form-item>
        <el-form-item class="text-right">
          <router-link to="login">返回登录</router-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="block_one.nextDisabled" @click="OtherClick('next')">重置密码</el-button>
        </el-form-item>
      </el-form>
      <el-form :model="block_two" v-if="active===1" :rules="rules" ref="block_two" label-width="160px" class="block-center">
        <el-form-item label="密码" prop="password" :rules="comm.rules.pwd" is-required>
          <el-input type="password" v-model="block_two.password" placeholder="请填写密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2" is-required>
          <el-input type="password" v-model="block_two.password2" placeholder="请再次填写密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="OtherClick('resetpwd')">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-form class="success text-center" v-if="active===2">
        <i class="el-icon-success"></i>
        <span>密码修改成功</span>
        <p>{{goLoginMessage}}s后自动跳转回登录页</p>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
	data() {
		let checkPhone = (a, b, c) => {
			let t = this;
			if (!this.comm._RegExp.isPhone.test(b)) {
				return c(new Error('请输入正确的手机号'));
			}
			t.axios.get('/authuser/userexist/' + b, null, {}).then(res => {
				if (res.data != true) {
					t.block_one.nextDisabled = !0;
					t.$message({
						message: '不存在该手机号,请检查手机号',
						type: 'error'
					});
				} else {
					t.block_one.nextDisabled = !1;
				}
			});
			c();
		};
		return {
			active: 0, //步骤状态
			goLoginMessage: 5,
			block_one: {
				phone: '',
				verifCode: '',
				nextDisabled: false //下一步按钮
			},
			block_two: {
				password: '', //密码
				password2: '' //确认密码
			},
			//验证表单
			rules: {
				phone: [{validator: checkPhone, trigger: 'blur'}],
				password2: [
					{
						validator: (a, b, c) => {
							if (!this.comm._RegExp.isPwd.test(b)) {
								return c(new Error('请输入6到16位长度的密码'));
							}
							if (b !== this.block_two.password) {
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
				case 'next':
					t.$refs['block_one'].validate(valid => {
						if (!valid) {
							return false;
						}
						t.axios.get('/sms/code/validate.json?mobilePhone=' + t.block_one.phone.trim() + '&authCode=' + t.block_one.verifCode, {}).then(res => {
							if (res.data.operationResult.isSuccess === true) {
								t.active = 1;
							} else {
								t.$message.error('验证码错误');
							}
						});
					});
					break;
				case 'resetpwd':
					t.$refs['block_two'].validate(valid => {
						if (!valid) {
							return false;
						}
						t.axios
							.post('/authuser/update', {
								loadingOption: {target: '.element-loading'},
								mobilePhone: t.block_one.phone.trim(),
								password: t.block_two.password.trim(),
								confirmPassword: t.block_two.password2.trim(),
								activeCode: t.block_one.verifCode.trim()
							})
							.then(res => {
								if (res && res.status == '200') {
									t.active = 2;
									var timer,
										times = 5;
									timer = setInterval(function() {
										--times;
										if (times == 0) {
											clearInterval(timer);
											t.$router.push({path: '/login'});
										} else {
											t.goLoginMessage = times;
										}
									}, 1000);
								}
							});
					});
					break;
			}
		}
	},
	created() {
		this.$store.commit('header', {caption: '重置密码'});
	}
};
</script>

<style lang="scss">
.resetpwd {
	padding-top: 20px;
	> div {
		width: 1120px;
		border-top: 2px #409eff solid;
		min-height: 700px;
		background: #fff;
		padding: 40px;
	}
	.title {
		height: 60px;
		line-height: 60px;
		font-size: 24px;
		border-bottom: 1px #cacccd solid;
		margin-bottom: 80px;
		> div {
			position: absolute;
			font-size: 14px;
		}
		span {
			color: #ff313b;
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
		p {
			font-size: 16px;
			height: 80px;
			line-height: 80px;
			text-indent: 60px;
		}
	}
	.el-form {
		width: 540px;
		a {
			color: #0086e4;
		}
		button.el-button--primary,
		.el-select {
			width: 380px;
		}
	}
}
</style>