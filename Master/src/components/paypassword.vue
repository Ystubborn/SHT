<template>
  <el-dialog title="输入支付密码" :visible.sync="display" :close-on-press-escape="false" :close-on-click-modal="false" center width="500px" class="pwdpanel">
    <p class="margin-bottom">为了保证您的账户安全，请输入支付密码</p>
    <div class="pwdpanel" ref="pwdpanel">
      支付密码
      <input type="text" maxlength="1" />
      <input type="text" maxlength="1" />
      <input type="text" maxlength="1" />
      <input type="text" maxlength="1" />
      <input type="text" maxlength="1" />
      <input type="text" maxlength="1" />
    </div>
    <div slot="footer">
      <el-button type="orange" @click="$emit('confirm', pwd.join(''))">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
	data() {
		return {
			display: !1,
			pwd: []
		};
	},
	mounted() {
		this.display = this.visible;
	},
	props: {
		visible: {default: !1}
	},
	watch: {
		visible(v) {
			this.display = v;
		},
		display(v) {
			this.$emit('update:visible', v);
			if (v == true) {
				let t = this;
				setTimeout(() => {
					let nl = t.$refs.pwdpanel.children;
					for (let i = 0; i < nl.length; i++) {
						const element = nl[i];
						element.onfocus = () => {
							element.value = '';
						};
						(function(_i) {
							element.onkeyup = () => {
								let code = window.event.keyCode;
								if (code > 47 && code < 58) {
									t.pwd[_i] = nl[_i].value;
									nl[_i].value = '*';
									if (i < 5) {
										nl[_i + 1].focus();
										nl[_i + 1].value = '';
									}
								} else {
									nl[_i].value = '';
								}
							};
							element.onblur = () => {
								if (element.value == '' && !t.comm.IsNullOrEmpty(t.pwd[_i])) {
									element.value = '*';
								}
							};
						})(i);
					}
				}, 20);
			}
		}
	}
};
</script>
<style lang="scss">
.pwdpanel {
	input {
		width: 28px;
		height: 28px;
		line-height: 28px;
		box-sizing: border-box;
		text-align: center;
		font-size: 16px;
		margin-left: 5px;
	}
	.el-button {
		padding: 8px 20px;
	}
}
</style>
