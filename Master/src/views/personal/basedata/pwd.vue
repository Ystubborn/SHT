<template>
  <div>
    <BreadCrumb :data=" [{a: '修改密码'}]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right">
        <h4 class="title border-bottom-solid margin-bottom">修改密码</h4>
        <el-form :model="simpleData" :rules="rules" ref="simpleData" label-width="100px" class="personal-content" label-position="left">
          <el-form-item label="当前密码" prop="oldpwd" :rules="comm.rules.pwd" is-required>
            <el-input type="password" v-model="simpleData.oldpwd" placeholder="请填写密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpwd" :rules="comm.rules.pwd" is-required>
            <el-input type="password" v-model="simpleData.newpwd" placeholder="请填写密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="newrepwd" is-required>
            <el-input type="password" v-model="simpleData.newrepwd" placeholder="请再次填写密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetPwd">确认修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
	data() {
		return {
			simpleData: {
				oldpwd: '',
				newpwd: '',
				newrepwd: ''
			},
			rules: {
				newrepwd: [
					{
						validator: (a, b, c) => {
							if (!this.comm._RegExp.isPwd.test(b)) {
								return c(new Error('请输入6到16位长度的密码'));
							}
							if (b !== this.simpleData.newpwd) {
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
		resetPwd() {
			let t = this;
			t.$refs['simpleData'].validate(valid => {
				if (!valid) {
					t.$message({
						message: '请完善当前信息',
						type: 'warning'
					});
					return false;
				}
				t.axios
					.post('/dynamic/sys_mainfw?modifypwd', {simpleData: t.simpleData})
					.then(res => {
						let mes = res.data.operationResult.simpleMessage;
						t.$message({
							message: mes,
							type: 'success'
						});
					})
					.catch(() => {});
			});
		}
	}
};
</script>