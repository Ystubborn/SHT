<template>
  <div>
    <BreadCrumb :data="[{a: '我的钱包', b: {path: '/settle'}}, {a: '月结支付'}]"></BreadCrumb>
    <div class="w block-center monthpay">
      <div class="panel-fe">待支付金额：<span class="color-red">{{this.$route.query.price}}</span>元</div>
      <div class="title border-bottom-solid margin-top">支付方式</div>
      <div class="margin-top">
        <el-checkbox :value="account.active">使用账户余额 <router-link :to="{path: '/settle/recharge',query: {price:account.price}}" class="color-red"><i class="icon red-warning"></i>账户余额不足，请前往充值页面充值账户 去充值>></router-link>
        </el-checkbox>
        <div class="paybalance"><i class="icon"></i>账户余额：<em></em>{{account.price}}元</div>
      </div>
      <div class="pay-button-panel">
        <p class="font20 text-right margin-v">应付金额：<span class="color-orange">{{this.$route.query.price}}</span>元</p>
        <button class="button" @click="pay">确认支付</button>
        <button class="link" @click="$router.push(history);">暂不支付，返回上一步</button>
      </div>
      <el-dialog :visible.sync="payStatus.Svisible" :title="'支付成功'" :show-close="false" :close-on-click-modal="false" center width="400px">
        <div class="text-center">
          <img src="../../../assets/images/payS.png">
          <p>账单支付成功，您还可以：</p>
        </div>
        <div slot="footer">
          <el-button type="orange" @click="publshEvent">发布订单</el-button>
          <router-link class="color-blue" :to=" {path: '/settle'}">返回结算中心</router-link>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="payStatus.Evisible" title="支付失败" :show-close="false" :close-on-click-modal="false" center width="400px">
        <div class="text-center">
          <img src="../../../assets/images/payE.png">
          <p class="color-red">账户余额不足，请前往充值页面充值账户 ：</p>
        </div>
        <div slot="footer">
          <el-button type="orange" @click="$router.push({path: '/settle/recharge',query: {price:account.price}})">去充值</el-button>
          <a href="javascript:" class="color-gray" @click="payStatus.Evisible=!1">暂时不充值</a>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			account: {price: 0, active: !0},
			payStatus: {Svisible: !1, Evisible: !1},
			history: {path: '/settle'}
		};
	},
	mounted() {
		let t = this;
		if (t.comm.IsNullOrEmpty(t.$route.query.month)) {
			this.$alert('支付参数错误！请返回重试', '错误', {
				confirmButtonText: '确定',
				callback: action => {
					t.$router.push(t.history);
				}
			});
			return;
		}
		t.axios.post('/dynamic/pay_settleorder?operationno=querybalance', {loadingOption: {target: '.element-loading'}, simpleData: {customerId: t.$store.state.userCtx.linkIdentity.id}}).then(res => {
			t.account.price = Number(res.data.operationResult.srvData.balance).toFixed(2);
		});
	},
	methods: {
		pay() {
			let t = this;
			t.axios.post('/dynamic/pay_monthlystatement?operationno=monthlystatementconfirm', {simpleData: {fmerchantid: t.$store.state.userCtx.linkIdentity.id, fmonth: this.$route.query.month}}).then(res => {
				if (res.data.operationResult.isSuccess) {
					t.payStatus.Svisible = !0;
				} else {
					t.payStatusESvisible = !0;
				}
			});
		},
		publshEvent() {
			let t = this;
			t.axios.post('/bill/ydj_merchantorder?operationno=checknewbill', {simpleData: {merchantId: t.$store.state.userCtx.linkIdentity.id}, loadingOption: {target: '.element-loading'}}).then(res => {
				console.log(res)
				let reslut = res.data.operationResult.srvData.linkUnclosedBills;
				if (!t.comm.IsNullOrEmpty(reslut.ydj_merchantorder) || !t.comm.IsNullOrEmpty(reslut.ydj_refund) || !t.comm.IsNullOrEmpty(reslut.ydj_servicechange)) {
					t.publishInit(reslut);
				} else {
					this.$router.push({
						path: '/order/pre-order'
					});
				}
			});
		}
	},
	beforeRouteEnter(to, from, next) {
		next(v => {
			if (from.path !== '/') {
				//v.history= from;  Cannot assign to read only property 'path' of object '#<Object>'
				v.history = {path: from.path, name: from.name, params: v.comm.IsNullOrEmpty(from.params) ? {tab: v.$store.state.pageStatus.orderTab} : from.params, query: from.query};
			}
		});
	}
};
</script>
<style lang="scss">
.monthpay {
	background-color: #fff;
	padding: 40px;
	.el-checkbox {
		a {
			position: relative;
			padding-left: 20px;
		}
		.icon {
			position: absolute;
			left: 0px;
			top: 1px;
		}
	}
	.pay-button-panel {
		padding-left: 850px;
		padding-top: 40px;
	}
	.el-dialog__footer {
		a {
			margin-left: 15px;
		}
	}
}
</style>