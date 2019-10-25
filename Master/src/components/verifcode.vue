<template>
  <div class="verifcode">
    <el-col :span="16" class="margin-right">
      <el-input v-model="code" placeholder="请填写验证码"></el-input>
    </el-col>
    <el-col :span="7">
      <el-button @click="GetVerifCode" :disabled="disabled">{{message}}</el-button>
    </el-col>
  </div>
</template>
<script>
export default {
	data() {
		return {
			code: '',
			disabled: !0,
			islock: !1,
			message: '获取验证码'
		};
	},
	props: {
		phone: {},
		times: {default: 60}
	},
	mounted() {
		if (this.comm._RegExp.isPhone.test(this.phone) && !this.islock) {
			this.disabled = !1;
		} else {
			this.disabled = !0;
		}
	},
	methods: {
		GetVerifCode() {
			let t = this;
			var timer;
			let times = t.times;
			t.axios.get('/sms/code?format=json&mobilePhone=' + t.phone, {}).then(res => {
				if (res.data.operationResult.isSuccess === true) {
					t.disabled = !0;
					t.islock = !0;
					t.message = '60秒后重试';
					timer = setInterval(function() {
						--times;
						if (times == 0) {
							t.disabled = !1;
							t.islock = !1;
							t.message = '获取验证码';
							clearInterval(timer);
						} else {
							t.message = times + '秒后重试';
						}
					}, 1000);
				} else {
					t.$message({
						message: '验证码发送失败',
						type: 'error'
					});
				}
			});
		}
	},
	watch: {
		phone(v) {
			if (this.comm._RegExp.isPhone.test(v) && !this.islock) {
				this.disabled = !1;
			} else {
				this.disabled = !0;
			}
		},
		code(v) {
			this.$emit('update:value', v);
		}
	}
};
</script>