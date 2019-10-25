<template>
  <div>
    <BreadCrumb :data=" [{a: '现金券'}]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right coupon-right">
        <h4 class="title border-bottom-solid margin-bottom">现金券</h4>
        <div class="font14 color-orange slogan"><i class="icon"></i>现金券使用规则：1、安装类订单满 200元时可抵扣20元，满500元可抵扣50元，满1000元可抵扣100元。 2、物流类服务不可使用现金券，补价时不可使用现金券，现金券不可兑换现金，不可提现，不退换。 3、当订单发生退款时，现金券退回。</div>
        <Radio v-model="usetype" class="tab">
          <div value="0">未使用</div>
          <div value="1">已使用</div>
          <div value="2">已过期</div>
        </Radio>
        <div class="tab-panel">
          <div v-for="item in coupon" :key="item.fentryid" :class="['couponitem', usetype=='0'?'newcoupon':'oldcoupon']">
            <h3>{{item.fcashamount}}</h3>
            <p>{{item.fname}}</p>
            <p>{{item.fenddate}}过期</p>
            <label>{{item.fisused}}</label>
          </div>
        </div>
        <h4 class="title border-bottom-solid margin-v">现金券明细</h4>
        <table cellpadding="0" cellspacing="0" class="table theme-gray margin-v lineheight-three">
          <colgroup>
            <col width="190">
            <col width="130">
            <col width="140">
            <col width="290">
            <col width="250">
          </colgroup>
          <tr>
            <th>有效期</th>
            <th>来源</th>
            <th>面值</th>
            <th>使用说明</th>
            <th>使用状态</th>
          </tr>
          <tr :key="item.id" v-for="item in coupon">
            <td>{{item.fstartdate}}至{{item.fenddate}}</td>
            <td>{{item.fcashcouponstype}}</td>
            <td>{{item.fcashamount.toFixed(2)}}</td>
            <td>{{item.fdescription}}</td>
            <td class="color-orange">{{item.fisused}}</td>
          </tr>
        </table>
        <h4 class="title border-bottom-solid margin-v">如何获得现金券</h4>
        <ul class="list">
          <li>1、首次充值赠送，充值1000元送50元券，充值2000元送150元，充值5000元送350元券，8000元 送500元券；</li>
          <li>2、平台活动赠送；</li>
          <li>3、成功引导师傅注册获得现金券20元；</li>
          <li>4、成功引导商户注册获得现金券50元。</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			coupon: [],
			usetype: 0
		};
	},
	created() {
		let t = this;
		t.getData(0, o => {
			this.coupon = o;
		});
	},
	methods: {
		getData(obj, fun) {
			let t = this;
			t.axios.post('/dynamic/ydj_customer?operationno=getcashcoupons', {loadingOption: {target: '.element-loading'}, selectedRows: [{PKValue: t.$store.state.userCtx.linkIdentity.id}], simpleData: {usetype: obj}}).then(res => {
				fun(res.data.operationResult.srvData.date);
			});
		}
	},
	watch: {
		usetype(v) {
			this.getData(v, o => {
				this.coupon = o;
			});
		}
	}
};
</script>
<style lang="scss">
$icon: url(../../../assets/images/icon.png);
.coupon-right {
	font-size: 14px;
	.slogan {
		position: relative;
		padding-left: 24px;
		margin: 20px 0;
		.icon {
			display: inline-block;
			width: 18px;
			height: 18px;
			background-position: -377px -38px;
			position: absolute;
			top: 50%;
			margin-top: -9px;
			left: 0;
		}
	}
	.tab-panel {
		padding: 40px 20px;
		& > div {
			display: inline-block;
			margin-right: 30px;
		}
	}
	.couponitem {
		background-image: $icon;
		height: 88px;
		width: 148px;
		color: #ffffff;
		text-align: center;
		position: relative;
		padding-right: 60px;
		h3 {
			font-size: 24px;
			line-height: 26px;
			padding-top: 10px;
			&::after {
				content: '元';
				font-size: 14px;
			}
		}
		label {
			position: absolute;
			top: 15px;
			right: 20px;
			line-height: 20px;
			width: 20px;
		}
	}
	.newcoupon {
		background-position: -146px -314px;
	}
	.oldcoupon {
		background-position: -364px -314px;
	}
}
</style>