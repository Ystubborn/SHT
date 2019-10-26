<template>
  <div>
    <BreadCrumb :data="[{a: '首页'}]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right home">
        <div class="home-search">
          <el-select v-model="searchType" placeholder="搜索选项" @change="searchChange">
            <el-option v-for="item in searchTypeData" :key="item.b" :label="item.a" :value="item.b"></el-option>
          </el-select>
          <el-input :placeholder="searchPlaceholder" v-model="searchValue" @keyup.enter.native="search">
            <el-button type="primary" slot="append" @click="search"><i class="el-icon-search"></i>搜索订单</el-button>
          </el-input>
        </div>
        <div class="home-left">
          <div>
            <h4 class="title">我的订单
              <router-link class="absolute" to="order">全部订单<i class="el-breadcrumb__separator el-icon-arrow-right"></i></router-link>
            </h4>
            <ul class="home-sum-order">
              <li v-for="item in orderStatus" :key="item.a">
                <router-link :to="{ path:'/order',name:'order', params:{tab:item.d}}">
                  <i class="icon" :data-num="item.c"></i>{{item.a}}
                </router-link>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="title">常见问题
              <router-link class="absolute" :to="{path:'/personal/problem'}">帮助中心<i class="el-breadcrumb__separator el-icon-arrow-right"></i></router-link>
            </h4>
            <ul class="home-question">
              <li v-for="(item,index) in problem" :key="item.fbillhead_id">
                <router-link :to="{path:'/personal/problem',query:{id:item.fbillhead_id}}">{{index+1}}.{{item.ftitle}}</router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="home-right">
          <div>
            <h4 class="title">我的钱包
              <router-link class="absolute" :to="{ path:'/settle'}">更多<i class="el-breadcrumb__separator el-icon-arrow-right"></i></router-link>
            </h4>
            <div class="wallet relative">钱包余额：<span>{{balance}}元</span>
              <el-button type="orange" @click="$router.push({path:'/settle/recharge',query:{price:balance}})">充值</el-button>
            </div>
            <div class="coupon">
              <i class="icon"></i>现金券：<router-link class="color-blue" :to="{path:'/settle/coupon',name:'coupon'}">{{comm.Odefault(otherStatus.find(o=>{return o.fname==='coupon'}),'fcount','0')}}</router-link>张
            </div>
          </div>
          <div>
            <h4 class="title">维权中心</h4>
            <ul class="col">
              <li class="col-5 text-center">
                <router-link :to="{path:'/droit/complain',name:'complain',params:{tab:'one'}}">{{comm.Odefault(otherStatus.find(o=>{return o.fname==='complaint'}),'fcount')}}</router-link>
                投诉管理
              </li>
              <li class="col-5 text-center">
                <router-link :to="{ path:'/droit',name:'refund',params:{tab:'one'}}">{{comm.Odefault(otherStatus.find(o=>{return o.fname==='refund'}),'fcount')}}</router-link>
                退款管理
              </li>
            </ul>
          </div>
          <div>
            <h4 class="title">变更订单</h4>
            <ul class="col">
              <li class="col-5 text-center">
                <router-link :to="{ path:'/order/supply',name:'supply',params:{tab:'one'}}">{{comm.Odefault(otherStatus.find(o=>{return o.fname==='servicechange'}),'fcount')}}</router-link>
                补价单
              </li>
              <li class="col-5 text-center">
                <router-link :to="{ path:'/order/additional',name:'additional',params:{tab:'one'}}">{{comm.Odefault(otherStatus.find(o=>{return o.fname==='additionalfee'}),'fcount')}}</router-link>
                附加费
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
	data() {
		return {
			searchType: 'customer',
			searchValue: '',
			searchPlaceholder: ' 请输入客户姓名/手机号码',
			searchTypeData: [{a: '客户信息', b: 'customer', p: ' 请输入客户姓名/手机号码'}, {a: '订单号', b: 'ordernumber', p: '请输入订单号'}],
			orderStatus: [
				{a: '待报价', b: ['sht_serstatus03'], d: 'two', r: true},
				{a: '待雇佣', b: ['sht_serstatus10'], d: 'three', r: true},
				{a: '待支付', b: ['sht_serstatus11'], d: 'three', r: true},
				{a: '待完成', b: ['sht_serstatus07'], d: 'nine', r: true},
				{a: '待派单', b: ['sht_serstatus03', 'sht_serstatus04', 'sht_serstatus05'], d: 'two', r: false},
				{a: '待预约', b: ['sht_serstatus12'], d: 'five', r: false},
				{a: '待上门', b: ['sht_serstatus13'], d: 'seven', r: false},
				{a: '待验收', b: ['sht_serstatus07'], d: 'nine', r: false}
			],
			problem: [],
			otherStatus: [],
			balance: ''
		};
	},
	created() {
		let t = this;
		let merchantId = t.$store.state.userCtx.linkIdentity.id;
		t.comm.ArrayRemove(t.orderStatus, o => {
			return o.r !== t.$store.state.userCtx.isPlatform;
		});
		t.orderStatus.map(o => {
			o.c = 0;
			return o;
		});
		//订单图标角标数据
		t.axios.post('/bill/ydj_merchantorder?operationno=getMorderStatistics', {loadingOption: {target: '.element-loading'}, simpleData: {merchantId: merchantId}}).then(res => {
			let srvData = res.data.operationResult.srvData;
			if (srvData instanceof Array) {
				t.orderStatus = t.orderStatus.map(o => {
					o.c = _.sum(
						_.map(
							_.filter(srvData, a => {
								return o.b.indexOf(a.fname) > -1;
							}),
							'fcount'
						)
					);
					return o;
				});
			}
		});
		//常见问题数据
		t.axios.post('/list/ydj_helpcenter.json?operationno=querydata', {filterString: "fispopular=1 and fpublishstatus='send_status_01'", loadingOption: {target: '.element-loading'}, pageSize: 10, pageIndex: 1}).then(res => {
			console.log("常见问题："+JSON.stringify(res))
			t.problem = t.comm.Odefault(res.data.operationResult.srvData, 'data');
		});
		//其他订单条数数据
		t.axios.post('/list/ydj_service?operationno=getdocumentcount', {loadingOption: {target: '.element-loading'}, simpleData: {merchantId: merchantId}}).then(res => {
				console.log(res.data.operationResult.srvData)
			t.otherStatus = res.data.operationResult.srvData;
		});
		//钱包金额
		t.axios.post('/dynamic/pay_settleorder?operationno=querybalance', {loadingOption: {target: '.element-loading'}, simpleData: {customerId: merchantId}}).then(res => {
			t.balance = t.comm.Odefault(res.data.operationResult.srvData, 'balance');
		});
	},
	methods: {
		searchChange() {
			let t = this;
			t.searchPlaceholder = t.searchTypeData.find(o => {
				return o.b === t.searchType;
			}).p;
		},
		search() {
			let t = this;
			if (t.comm.IsNullOrEmpty(t.searchValue)) {
				t.$message({
					message: '您不输入点什么，让我怎么查找呢！',
					type: 'warning'
				});
				return;
			}
			this.$router.push({
				path: '/order',
				name: 'order',
				params: {search: {key: t.searchType, value: t.searchValue}}
			});
		}
	}
};
</script>
<style lang="scss">
.home {
	&.main-content-right {
		padding: 0;
		background-color: transparent;
	}
	.home-search {
		background: url(../../assets/images/search.png);
		padding: 52px 200px;
		.el-select {
			width: 106px;
			height: 44px;
			vertical-align: top;
			margin-right: 2px;
		}
		.el-input-group {
			width: 530px;
			vertical-align: top;
		}
		.el-input__inner {
			height: 44px;
			border-width: 0;
			border-radius: 0;
		}
		.el-input-group__append {
			background-color: #454952;
			border-width: 0;
			border-radius: 0;
		}
		.el-button {
			border-radius: 0;
			color: #fff;
		}
	}
	.title {
		height: 42px;
		line-height: 42px;
		background-color: #f5f5f5;
		font-size: 14px;
		text-indent: 14px;
		font-weight: bold;
		.el-breadcrumb__separator {
			margin: 0;
			text-indent: 0;
		}
		a {
			color: #666;
			font-weight: normal;
			right: 14px;
		}
	}
	.home-left {
		display: inline-block;
		vertical-align: top;
		width: 638px;
		font-size: 14px;
		> div {
			border: 1px solid #e8e8e8;
			margin-top: 20px;
			background-color: #fff;
		}
	}
	.home-sum-order {
		font-size: 0;
		padding-left: 14px;
		li {
			padding: 36px;
			display: inline-block;
			vertical-align: top;
			font-size: 14px;
			text-align: center;
			line-height: 56px;
			i {
				display: block;
				width: 80px;
				height: 80px;
				position: relative;
				&::before {
					position: absolute;
					top: -4px;
					right: -4px;
					content: attr(data-num);
					display: block;
					width: 22px;
					height: 22px;
					line-height: 22px;
					text-align: center;
					border-radius: 50%;
					background-color: #fff;
					border: 1px solid #ff3b44;
					color: #ff3b44;
					font-size: 12px;
				}
			}
			&:nth-child(1) i.icon {
				background-position: -32px 0;
			}
			&:nth-child(2) i.icon {
				background-position: -32px -90px;
			}
			&:nth-child(3) i.icon {
				background-position: -122px 0;
			}
			&:nth-child(4) i.icon {
				background-position: -122px -90px;
			}
		}
		a {
			color: #333;
		}
	}
	.home-question {
		padding: 14px 0;
		li {
			line-height: 28px;
			text-indent: 16px;
			a {
				color: #333;
			}
		}
	}
	.home-right {
		display: inline-block;
		vertical-align: top;
		width: 380px;
		font-size: 14px;
		margin-left: 20px;
		> div {
			border: 1px solid #e8e8e8;
			margin-top: 20px;
			background-color: #fff;
		}
		.col {
			padding: 40px 0;
			> * {
				font-size: 14px;
			}
			a {
				font-size: 24px;
				color: #0086e4;
				display: block;
			}
		}
	}
	.wallet {
		font-size: 16px;
		color: #333;
		line-height: 34px;
		padding: 34px 14px;
		> span {
			color: #ff6d22;
		}
		.el-button {
			right: 14px;
			height: 34px;
			top: 34px;
			position: absolute;
			padding: 0;
			width: 88px;
		}
	}
	.coupon {
		border-top: 1px solid #e8e8e8;
		padding: 34px 0;
		line-height: 18px;
		text-align: center;
		color: #666;
		font-size: 16px;
		i {
			background-position: -294px -83px;
			width: 26px;
			height: 18px;
			display: inline-block;
			margin-right: 8px;
			vertical-align: text-bottom;
		}
	}
}
</style>