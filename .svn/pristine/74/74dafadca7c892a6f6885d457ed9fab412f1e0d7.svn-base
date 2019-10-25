<template>
  <div>
    <BreadCrumb :data="[{a: '我的钱包', b: {path: '/settle'}}, {a: '密码管理'}]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right walletpwd">
        <h4 class="title border-bottom-solid margin-bottom">钱包密码 <span class="color-red font12">如果您未设置过支付密码，初始密码为888888</span></h4>
        <el-form :model="simpleData" :rules="rules" ref="simpleData" label-width="120px" class="personal-content" label-position="right">
          <el-form-item label="旧密码" prop="oldPayPwd" :rules="comm.rules.paypwd" is-required>
            <el-input type="password" v-model="simpleData.oldPayPwd" placeholder="请填写旧密码/初始密码"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" :rules="comm.rules.phone" is-required>
            <el-input type="text" v-model="simpleData.phone" placeholder="请填写手机号"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code" :rules="comm.rules.code" is-required>
            <Verifcode :value.sync="simpleData.code" :phone="simpleData.phone"></Verifcode>
          </el-form-item>
          <el-form-item label="新密码" prop="newPayPwd" :rules="comm.rules.paypwd" is-required>
            <el-input type="password" v-model="simpleData.newPayPwd" placeholder="请填写密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="repeatPayPwd" is-required>
            <el-input type="password" v-model="simpleData.repeatPayPwd" placeholder="请再次填写密码"></el-input>
          </el-form-item>
        </el-form>
        <div class="pay-button-panel">
          <button class="button" @click="confirm">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
	data() {
		return {
			simpleData: {
				phone: '',
				code: '',
				oldPayPwd: '',
				newPayPwd: '',
				repeatPayPwd: ''
			},
			rules: {
				repeatPayPwd: [
					{
						validator: (a, b, c) => {
							if (!this.comm._RegExp.isPayPwd.test(b)) {
								return c(new Error('请输入6位数字密码'));
							}
							if (b !== this.simpleData.newPayPwd) {
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
		confirm() {
			let t = this;
			t.axios.get('/sms/code/validate.json?mobilePhone=' + t.simpleData.phone + '&authCode=' + t.simpleData.code, {}).then(res => {
				if (res.data.operationResult.isSuccess === true) {
					delete t.simpleData.phone;
					delete t.simpleData.code;
					t.axios.post('/dynamic/ydj_customer?operationno=updatepaypwd', {loadingOption: {target: '.element-loading'}, simpleData: t.simpleData, selectedRows: [{pkValue: t.$store.state.userCtx.linkIdentity.id}]}).then(res => {
						t.$alert('恭喜您，支付密码修改成功', '温馨提示', {
							confirmButtonText: '确定',
							callback: action => {
								t.$router.push({
									path: '/settle',								 
								});
							}
						});
					});
				} else {
					t.$message.error('验证码错误');
				}
			});
		}
	}
};
</script>
<style lang="scss">
.walletpwd {
	.el-input {
		width: 280px;
	}
	.pay-button-panel {
		padding-left: 120px;
	}
}
</style>
