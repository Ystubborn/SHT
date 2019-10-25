<template>
  <div>
    <BreadCrumb :data="crumb"></BreadCrumb>
    <div class="w block-center pay main-content">
      <div class="panel-fe">本次需支付：<span class="color-red">{{params.price}}</span>元</div>
      <div class="panel-f5 margin-top" v-if="!comm.IsNullOrEmpty(params.other)">
        <ul class="list" v-if="params.type=='reward'">
          <li>感谢您对我们师傅提供服务的认可。支付完毕奖励金直接转入师傅钱包。</li>
          <li>本次的服务师傅 <router-link class="color-blue" :to="{name:'detmaster',query:{id:params.other.master.id}}">{{params.other.master.name}}</router-link>
          </li>
          <li>订单号：{{params.other.service.No}}</li>
        </ul>
        <ul class="list" v-if="params.type!=='reward'">
          <li>订单号：{{params.other.service.No}}</li>
          <li>客户：{{params.other.consumer.name}}</li>
          <li>电话：{{params.other.consumer.phone}}</li>
          <li v-if="!comm.IsNullOrEmpty(params.other.consumer.address)">安装信息：{{params.other.consumer.address}}</li>
          <li v-if="!comm.IsNullOrEmpty(params.other.service.sourceNo)">源订单号：{{params.other.service.sourceNo}}</li>
        </ul>
      </div>
      <div class="screen margin-top padding-bottom border-bottom-dashed" label="支付方式：">
        <Radio type="border" class="payoption" v-model="paytype.active">
          <div v-for="item in paytype.list" :key="item.a" :value="item.a"></div>
        </Radio>
      </div>
      <div v-if="coupon.list.length>0&&params.type==='merchantorder'" class="margin-top">
        <el-checkbox :value="coupon.check">使用现金券</el-checkbox>
        <div class="margin-top">
          <Radio type="border" v-model="coupon.active" :exit="true" class="coupon">
            <div v-for="item in coupon.list" :key="item.fentryid" :value="item.fentryid">
              <h3 class="color-blue font20">{{item.fcashamount}}</h3>
              <p>{{item.fname}}</p>
              <p>{{item.fenddate}}过期</p>
            </div>
          </Radio>
        </div>
      </div>
      <div v-if="params.isbalance" class="margin-top">
        <el-checkbox v-model="balance.check">使用账户余额</el-checkbox>
        <div class="paybalance"><i class="icon"></i>账户余额：<em></em>{{balance.money}}元</div>
      </div>
      <div class="pay-button-panel">
        <button class="button" @click="opClick('confirmPay')">确认支付</button>
        <button class="link" @click="opClick('goBack')">暂不支付，返回上一步</button>
      </div>
      <el-dialog title="微信支付" :visible.sync="paytype.wechatVisible" width="700px" center :before-close="opClick('payClose')">
        <div class="wechatdialog">
          <div class="code">
            <div ref="qrcode" class="qrcode"></div>
            <p>打开微信扫一扫</p>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="费用清单" :visible.sync="insure.visible" center :close-on-click-modal="false" v-if="params.type==='merchantorder'">
        <div class="insureprice">
          <ul>
            <li><label>订单金额：</label><span class="color-red">¥{{params.price}}</span></li>
            <li v-if="params.islogistics"><label>运送保险：</label><span class="color-red">10元/单</span>
              <el-checkbox v-model="insure.check"></el-checkbox><a class="color-blue" href="javascript:void(0)" @click="transportVisible=!0">运送保详情>></a>
              <div class="color-grey">保障提货至安装地点货物运送的安全，每单最高赔付500元</div>
            </li>
            <li v-if="coupon.check">
              <label>现金券抵扣：</label><span class="color-red">-{{coupon.price}}元</span>
            </li>
            <li><label>第三方责任险：</label>平台赠送<span class="color-red delete-line">3元/单</span>
              <el-checkbox :value="true"></el-checkbox><a class="color-blue" href="javascript:void(0)" @click="thirdVisible=!0">第三方责任险协议>></a>
              <div class="color-grey"><i class="icon"></i>人/财保障，免费赠送，最高赔付30万元。</div>
            </li>
          </ul>
          <div class="footer">
            实际支付：<span class="color-red">{{total}}</span>
          </div>
        </div>
        <div slot="footer">
          <el-button type="orange" size="medium" @click="opClick('confirmPay')">立即支付</el-button>
        </div>
      </el-dialog>
      <Agreement title="第三方责任险协议" :visible.sync="thirdVisible" show="third"></Agreement>
      <Agreement title="左右手平台运送保服务协议" :visible.sync="transportVisible" show="transport"></Agreement>
    </div>
  </div>
</template>
<script>
/**
 * 支付页面来源
 * 1.商户订单支付
 * 2.补价单支付
 * 3.附加费支付
 * 4.商户打赏
 **/
import QRCode from 'qrcodejs2';
export default {
	data() {
		return {
			crumb: [{a: '订单管理', b: {path: '/order', name: 'order', params: {tab: this.$store.state.pageStatus.orderTab}}}, {a: '订单支付'}],
			params: {},
			thirdVisible: !1,
			transportVisible: !1,
			balance: {money: 0, check: !1}, //余额
			paytype: {active: 'Alipay', wechatVisible: !1, list: [{a: 'Alipay', b: '支付宝'}, {a: 'WeChat', b: '微信支付'}]}, //支付方式
			coupon: {active: '', check: !1, list: [], price: 0}, //现金券
			history: {path: '/order'},
			insure: {visible: !1, check: !1},
			settimer: true
		};
	},
	mounted() {
		let t = this;
		if (t.comm.IsNullOrEmpty(t.$store.state.pay.params.id)) {
			this.$alert('支付参数错误！请返回重试', '错误', {
				confirmButtonText: '确定',
				callback: action => {
					t.$router.push(t.history);
				}
			});
			return;
		}
		t.params = JSON.parse(JSON.stringify(t.$store.state.pay.params));
		let dealer = this.$store.state.userCtx.linkIdentity.id;
		//获取现金券【支付类型为‘merchantorder’】
		if (t.params.type == 'merchantorder') {
			t.axios.post('/dynamic/ydj_merchantorder?operationno=getcashcoupons', {loadingOption: {target: '.element-loading'}, selectedRows: [{pkValue: t.params.id}]}).then(res => {
				this.coupon.list = res.data.operationResult.srvData.date;
			});
		}
		//采用余额支付（调出当前钱包余额）
		if (t.params.isbalance === true) {
			t.axios.post('/dynamic/pay_settleorder?operationno=querybalance', {loadingOption: {target: '.element-loading'}, simpleData: {customerId: dealer}}).then(res => {
				t.balance.money = Number(res.data.operationResult.srvData.balance).toFixed(2);
			});
		}
		//打赏获取订单相关信息
		if (t.comm.IsNullOrEmpty(t.params.other)) {
			t.axios.post('/bill/ydj_merchantorder?operationno=GetMOrderAndOrderBaceInfo', {simpleData: {fmerchantid: dealer, id: t.params.id}}).then(res => {
				let info = res.data.operationResult.srvData;
				t.params.other = {master: {id: info.fmaster, name: info.fmaster_name}, service: {type: info.fservicetype, time: info.fservicedate, No: info.mobillno}, consumer: {name: info.fcusname, phone: info.fcusphone}};
				this.crumb[1].a = '奖励打赏';
			});
		}
	},
	methods: {
		paySuccess() {
			let t = this;
			setTimeout(function() {
				if (!t.settimer) {
					return;
				}
				if (t.params.type === 'reward') {
					t.axios.post('/bill/ydj_master?operationno=rewardcheckIsPaySuccess', {loadingOption: {target: '.element-loading'}, simpleData: {fmasterid: t.params.other.master.id, fmorderid: t.params.id}}).then(res => {
						if (!res.data.operationResult.srvData.isPaySuccess) {
							t.paySuccess();
						} else {
							t.$router.push(t.history);
						}
					});
					return;
				}
				t.axios.post('/bill/' + t.params.formId + '?operationno=checkIsPaySuccess', {loadingOption: {target: '.element-loading'}, selectedRows: [{pkValue: t.params.id}]}).then(res => {
					if (!res.data.operationResult.srvData.isPaySuccess) {
						t.paySuccess();
					} else {
						t.$router.push(t.history);
					}
				});
			}, 2000);
		},
		opClick(type, data) {
			let t = this;
			switch (type) {
				case 'payClose':
					t.settimer = !1;
					break;
				case 'confirmPay':
					if (!t.insure.visible && t.params.type === 'merchantorder') {
						t.insure.visible = !0;
						return;
					}
					let postdata = {fpaymethod: t.paytype.active, fid: t.params.id, fisbalancepayment: t.balance.check ? 1 : 0};
					if (t.coupon.check) {
						postdata.fcashcouponsid = t.coupon.active;
					}
					if (t.insure.check) {
						postdata.fisbuyinsurance = 1;
					}
					let msg = '';
					switch (t.params.type) {
						case 'merchantorder': //商户订单
							msg = '您已成功托管本单安装费' + t.total + '元，已从钱包中扣除，待师傅预约上门！';
							break;
						case 'additionalfee': //附加费
							msg = '附加费支付成功！';
							break;
						case 'servicechange':
							msg = '补价支付成功！';
							break;
						case 'reward':
							msg = '打赏支付成功';
							break;
						default:
							break;
					}
					let url = '/bill/' + t.params.formId + '?operationno=orderPay';
					if (t.params.type === 'reward') {
						url = '/bill/' + t.params.formId + '?operationno=rewardorderPay';
						postdata.fmasterid = t.params.other.master.id;
						postdata.frewardamount = t.params.price;
					}
					t.axios.post(url, {loadingOption: {target: '.element-loading'}, simpleData: postdata, selectedRows: [{pkValue: t.params.id}]}).then(res => {
						if (t.comm.IsNullOrEmpty(res.data.operationResult.srvData)) {
							t.$alert(msg, '支付成功', {
								confirmButtonText: '确定',
								callback: action => {
									t.$router.push(t.history);
								}
							});
							return;
						}
						let result = res.data.operationResult.srvData.data;
						if (t.paytype.active === 'Alipay') {
							localStorage.setItem('Alipay', JSON.stringify(t.history));
							//支付宝支付最终回调地址 /payback
							window.location.href = result;
							return;
						}
						if (t.paytype.active === 'WeChat') {
							this.paytype.wechatVisible = !0;
							setTimeout(() => {
								this.$refs.qrcode.innerHTML = '';
								new QRCode(this.$refs.qrcode, {
									width: 200,
									height: 200, // 高度
									text: result // 二维码内容
								});
								t.settimer = !0;
								t.paySuccess();
							}, 100);
						}
					});
					break;
				case 'goBack':
					t.$router.push(t.history);
					break;
			}
		}
	},
	beforeRouteEnter(to, from, next) {
		next(v => {
			if (from.path !== '/') {
				//v.history= from;  Cannot assign to read only property 'path' of object '#<Object>'
				v.history = {path: from.path, name: from.name, params: v.comm.IsNullOrEmpty(from.params) ? {tab: v.$store.state.pageStatus.orderTab} : from.params, query: from.query};
			}
		});
	},
	beforeDestroy() {
		this.settimer = !1;
	},
	computed: {
		couponActive() {
			return this.coupon.active;
		},
		total() {
			return this.insure.check ? Number(this.params.price + 10).toFixed(2) : Number(this.comm.priceSum(Number(this.params.price) - this.coupon.price, 2)).toFixed(2);
		}
	},
	watch: {
		couponActive(v) {
			//监听优惠券选中状态
			this.coupon.price = Number(
				this.comm.Odefault(
					this.coupon.list.find(o => {
						return o.fentryid === v;
					}),
					'fcashamount',
					0
				)
			);
			this.coupon.check = !this.comm.IsNullOrEmpty(v);
		}
	}
};
</script>
<style lang="scss">
.pay {
	.pay-button-panel {
		padding-top: 40px;
	}
	.coupon {
		& > * {
			width: 204px;
			line-height: 24px;
			padding: 15px 0;
		}
		h3 {
			&::after {
				content: '元';
				font-size: 14px;
			}
		}
	}
	.insureprice {
		border: 1px solid #e7e7e7;
		ul {
			padding: 10px 20px;
		}
		li {
			position: relative;
			line-height: 36px;
			padding-left: 120px;
			label:first-child {
				position: absolute;
				left: 0;
				text-align: right;
				height: 36px;
				width: 110px;
			}
			a {
				position: absolute;
				right: 0px;
			}
			.color-grey {
				line-height: 16px;
			}
			.icon {
				background-position: -405px -38px;
				width: 16px;
				height: 16px;
				display: inline-block;
				vertical-align: middle;
				margin-right: 5px;
			}
		}
		.footer {
			background-color: #f5f5f5;
			height: 40px;
			line-height: 40px;
			padding-left: 60px;
			margin-top: 14px;
			position: relative;
			span {
				position: absolute;
				right: 20px;
			}
		}
	}
}
</style>