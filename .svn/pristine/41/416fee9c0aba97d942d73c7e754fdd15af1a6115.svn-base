<template>
  <el-dialog :title="title" :visible.sync="display" :close-on-press-escape="false" :close-on-click-modal="false" center class="paymentbind">
    <el-form label-width="130px" label-position="right" :model="bankData" ref="bankData" :rules="rules" class="margin-top" v-show="cardtype=='cardtype_01'">
      <el-form-item label="开户银行：" is-required>
        <el-select v-model="bank.active">
          <el-option :key="item.a" :label="item.a" :value="item.a" v-for="item in bank.list"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="填写开户行：" prop="bankName" v-if="bank.active==='其它'" is-required>
        <el-input type="text" placeholder="请输入开户行名称" v-model="bankData.bankName"></el-input>
      </el-form-item>
      <el-form-item label="银行卡号：" prop="bankCardId" :rules="comm.rules.bankcard" is-required>
        <el-input type="text" placeholder="请输入您要绑定的银行卡号" v-model="BankFormat"></el-input>
      </el-form-item>
      <el-form-item label="开户网点名称：" prop="bankBranch" is-required>
        <el-input type="text" placeholder="请输入开户网点名称" v-model="bankData.bankBranch"></el-input>
      </el-form-item>
      <el-form-item label="开卡人姓名：" prop="bankUserName" is-required>
        <el-input type="text" placeholder="请输入银行卡对应的户名" v-model="bankData.bankUserName"></el-input>
      </el-form-item>
      <el-form-item label="短信验证码：" prop="code" :rules="comm.rules.code" is-required>
        <Verifcode :value.sync="bankData.code" :phone="bankData.bankMobile"></Verifcode>
        <p class="color-grey">验证短信将发送到您绑定的手机：{{bankData.bankMobile}}，请注意查收</p>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="check" label="已阅读左右手"></el-checkbox><a @click="visible =!0" class="color-red" href="javascript:void(0)">《银行卡绑定协议》</a>
      </el-form-item>
    </el-form>
    <el-form label-width="130px" label-position="right" :model="otherData" ref="otherData" :rules="orules" class="margin-top" v-show="['cardtype_02','cardtype_03'].indexOf(cardtype)>-1">
      <el-form-item label="姓名：" prop="bankUserName" is-required>
        <el-input type="text" placeholder="请输入真实姓名" v-model="otherData.bankUserName"></el-input>
      </el-form-item>
      <el-form-item label="账号：" prop="bankCardId" is-required>
        <el-input type="text" placeholder="请输入您要绑定的账号" v-model="otherData.bankCardId"></el-input>
      </el-form-item>
    </el-form>
    <div class="pay-button-panel">
      <button class="button" @click="Save" :disabled="!check">确定</button>
    </div>
  </el-dialog>
</template>
<script>
export default {
	data() {
		return {
			bank: {
				active: '中国银行',
				list: [{a: '中国进出口银行'}, {a: '中国农业发展银行'}, {a: '中国工商银行'}, {a: '中国农业银行'}, {a: '中国银行'}, {a: '中国建设银行'}, {a: '交通银行'}, {a: '中信银行'}, {a: '中国光大银行'}, {a: '华夏银行'}, {a: '中国民生银行'}, {a: '招商银行'}, {a: '兴业银行'}, {a: '广发银行'}, {a: '平安银行'}, {a: '上海浦东发展银行'}, {a: '恒丰银行'}, {a: '浙商银行'}, {a: '渤海银行'}, {a: '中国邮政储蓄银行'}, {a: '其它'}]
			},
			bankData: {
				bankName: '中国银行',
				bankCardId: '',
				bankBranch: '',
				bankUserName: '',
				bankMobile: this.$store.state.userCtx.userName,
				code: ''
			},
			otherData: {
				bankUserName: '',
				bankMobile: ''
			},
			display: !1,
			check: !1,
			rules: {
				bankName: [{required: true, message: '请填写开户行名称', trigger: 'blur'}],
				city: [
					{
						validator: (a, b, c) => {
							if (b.length != 2) {
								return c(new Error('请选择完整的省市'));
							}
							c();
						}
					}
				],
				bankBranch: [{required: true, message: '请填写开户网点名称', trigger: 'blur'}],
				bankUserName: [{required: true, message: '请填写银行卡对应的户名', trigger: 'blur'}]
			},
			orules: {
				bankUserName: [{required: true, message: '请填写真实姓名', trigger: 'blur'}],
				bankCardId: [{required: true, message: '请填写账号', trigger: 'blur'}]
			}
		};
	},
	methods: {
		Save() {
			let t = this;
			let refs = t.cardtype == 'cardtype_01' ? 'bankData' : 'otherData';
			t.$refs[refs].validate(valid => {
				if (!valid) {
					t.$message({
						message: '请完善当前信息',
						type: 'warning'
					});
					return false;
				}
				if (t.cardtype === 'cardtype_01') {
					t.CodeValidate();
				} else {
					t.Submit(t.otherData);
				}
			});
		},
		Submit(data) {
			let t = this;
			data.cardtype = t.cardtype;
			t.axios
				.post('/bill/ydj_customer?operationno=bindbankcard', {
					simpleData: data,
					selectedRows: [{pkValue: t.$store.state.userCtx.linkIdentity.id}]
				})
				.then(res => {
					t.display = !1;
					this.$emit('success-event');
				});
		},
		CodeValidate() {
			let t = this;
			t.axios.get('/sms/code/validate.json?mobilePhone=' + t.bankData.bankMobile + '&authCode=' + t.bankData.code, {}).then(res => {
				if (res.data.operationResult.isSuccess === true) {
					delete t.bankData.code;
					t.Submit(t.bankData);
				}
			});
		}
	},
	mounted() {
		this.display = this.visible;
	},
	props: {
		title: {default: '绑定银行卡'},
		cardtype: {default: 'cardtype_01'},
		visible: {default: !1}
	},
	computed: {
		bankname() {
			return this.bank.active;
		},
		BankFormat: {
			get() {
				return this.bankData.bankCardId.replace(/(\d{4})(?=\d)/g, '$1 ');
			},
			set(v) {
				this.bankData.bankCardId = v.replace(/\s/g, '');
			}
		}
	},
	watch: {
		bankname(v) {
			if (v != '其他') {
				this.bankData.bankName = v;
			}
		},
		visible(v) {
			this.display = v;
		},
		display(v) {
			this.$emit('update:visible', v);
		},
		cardtype(v) {
			this.check = v == 'cardtype_01' ? false : !['cardtype_02', 'cardtype_03'].indexOf(v) > -1;
		}
	}
};
</script>
<style lang="scss">
.paymentbind {
	.el-form {
		.el-input {
			width: 286px;
		}
	}
	.pay-button-panel {
		padding-left: 130px;
	}
}
</style>
