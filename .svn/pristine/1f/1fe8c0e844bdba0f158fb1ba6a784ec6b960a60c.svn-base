<template>
  <div>
    <BreadCrumb :data="[{a: '我的钱包', b: {path: '/settle'}}, {a: '账户提现'}]"></BreadCrumb>
    <div class="w block-center withdraw main-content">
      <div class="panel-fe">账户余额：<span class="color-red">{{$route.query.price}}</span>元</div>
      <el-form label-width="100px" label-position="right" class="margin-top">
        <el-form-item label="提现金额：">
          <el-input-number placeholder="0元" class="input-price" :min="0" :controls="false" :max="1000000" v-model="money"></el-input-number>　元
        </el-form-item>
        <el-form-item label="提现到：">
          <Radio v-model="tabActive" class="tab">
            <!-- <div value="0">第三方账户</div> -->
			<div @click.stop="show">
				<div value="1">银行卡</div>
			</div>         
          </Radio>
          <div class="tab-panel">
            <!-- <Radio type="border" class="payoption" v-model="lineActive" v-show="tabActive=='0'">
              <div value="cardtype_02" title="支付宝"></div>
              <div value="cardtype_03" title="微信支付"></div>
            </Radio> -->
            <Radio type="border" class="bankcard" v-model="payment.bank.active" v-show="tabActive=='1'">
              <div v-for="item in payment.bank.list" :key="item.fentryid" :value="item.fentryid">
                <h5 class="relative">{{item.fbankname}}<em class="absolute top">储蓄卡</em></h5>
                <p>{{item.fbankcardid.replace(/(\d{4})(?=[\d,\*])/g, '$1 ')}}</p>
              </div>
              <div @click.stop="payment.title='绑定银行卡';payment.cardtype='cardtype_01',payment.bindVisible=!0">添加银行卡</div>
            </Radio>
          </div>
        </el-form-item>
      </el-form>
      <div class="pay-button-panel">
        <button class="button" @click="Confirm">确认提现</button>
      </div>
      <BindCard :visible.sync="payment.bindVisible" :title="payment.title" :cardtype="payment.cardtype" @success-event="Init"></BindCard>
      <PayPassword :visible.sync="paypwd.visible" @confirm="Submit"></PayPassword>
    </div>
  </div>
</template>
<script>
export default {
	data() {
		return {
			money: '',
			tabActive: '1',
			lineActive: '',
			payment: {bank: {list: [], active: ''}, alipay: {}, wechat: {}, bindVisible: !1, title: '绑定银行卡', cardtype: 'cardtype_01'},
			paypwd: {visible: !1},
			cardid: ''
		};
	},
	methods: {
		Confirm() {
			let t = this;
			if (this.money < 0.01) {
				t.$message({
					message: '提现金额不能小于1分钱',
					type: 'warning'
				});
				return;
			}
			let cardid = '';
			if (t.tabActive === '0') {
				if (t.lineActive === 'cardtype_02') {
					cardid = t.payment.alipay.fentryid;
				}
				if (t.lineActive === 'cardtype_03') {
					cardid = t.payment.wechat.fentryid;
				}
			} else {
				cardid = t.payment.bank.active;
			}
			if (t.comm.IsNullOrEmpty(cardid)) {
				t.$message({
					message: '请选择提现账户',
					type: 'warning'
				});
				return;
			}
			t.cardid = cardid;
			t.paypwd.visible = !0;
		},
		Submit(pwd) {
			let t = this;
			t.axios
				.post('/bill/ydj_customer?operationno=takecash', {
					selectedRows: [{pkValue: t.$store.state.userCtx.linkIdentity.id}],
					simpleData: {
						fentryid: t.cardid,
						cardtype: t.tabActive === '0' ? t.lineActive : 'cardtype_01',
						amount: t.money,
						paypwd: pwd
					}
				})
				.then(res => {
					t.paypwd.visible = !1;
				});
		},
		Init() {
			let t = this;
			t.axios
				.post('/bill/ydj_customer?operationno=getbindbankcards', {
					selectedRows: [{pkValue: t.$store.state.userCtx.linkIdentity.id}]
				})
				.then(res => {
					let data = res.data.operationResult.srvData;
					t.payment.bank.list = data.filter(o => {
						return o.fcardtype == 'cardtype_01';
					});
					t.payment.alipay = data.find(o => {
						return o.fcardtype == 'cardtype_02';
					});
					t.payment.wechat = data.find(o => {
						return o.fcardtype == 'cardtype_03';
					});
				});
		}
	},
	mounted() {
		this.Init();
	},
	watch: {
		lineActive(v) {
			let t = this;
			switch (v) {
				case 'cardtype_02':
					if (t.comm.IsNullOrEmpty(t.payment.alipay)) {
						t.payment.title = '绑定支付宝';
						t.payment.cardtype = v;
						t.payment.bindVisible = !0;
						t.lineActive = '';
						//console.log('请绑定支付宝账户');
					}
					break;
				case 'cardtype_03':
					if (t.comm.IsNullOrEmpty(t.payment.wechat)) {
						t.payment.title = '绑定微信';
						t.payment.cardtype = v;
						t.payment.bindVisible = !0;
						t.lineActive = '';
						//console.log('请绑定微信账户');
					}
					break;
			}
		}
	}
};
</script>
<style lang="scss">
.withdraw {
	&>.el-form {
		.el-input {
			width: 180px;
		}
	}
	.el-form-item__content {
		line-height: inherit;
	}
	.tab-panel {
		padding: 40px 18px;
	}
	.bankcard {
		& > * {
			width: 176px;
			height: 44px;
			line-height: 20px;
			vertical-align: middle;
			padding-left: 48px;
			text-align: left;
			h5 {
				margin-top: 2px;
				em {
					right: 20px;
				}
			}
			&:last-child {
				width: 154px;
				padding: 0;
				text-align: center;
				border: 1px dashed #e8e8e8;
				color: #999;
				line-height: 44px;
			}
		}
	}
}
</style>
