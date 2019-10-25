<template>
  <div>
    <BreadCrumb :data="[{a: '我的钱包'}]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right wallet">
        <el-dialog title="消费详情" :visible.sync="dialogVisible" width="820px" v-if="!comm.IsNullOrEmpty(turnover)">
          <div class="summary font20" v-if="!comm.IsNullOrEmpty(turnover.fbizstatus.fname)">{{turnover.fbizstatus.fname}}</div>
          <table cellpadding="0" cellspacing="0" class="table theme-gray font14 margin-top lineheight-three">
            <colgroup>
              <col width="389" />
              <col width="389" />
            </colgroup>
            <tr>
              <th colspan="2">消费详情</th>
            </tr>
            <tr>
              <td colspan="2">
                交易用途：{{turnover.fpurpose.fenumitem}}
              </td>
            </tr>
            <tr>
              <td>金　额：<span class="color-blue">{{turnover.fdirection.id==='direction_01'?'+':'-'}}{{turnover.famount}}</span></td>
              <td>支付方式：{{turnover.fway.fname}}</td>
            </tr>
            <tr>
              <td>订单单号：{{comm.Odefault(turnover,'forderno','无')}}</td>
              <td>流水号：{{turnover.ftranid}}</td>
            </tr>
            <tr>
              <td>创建时间：{{turnover.fcreatedate}}</td>
              <td>交易时间：{{(turnover.fbizstatus && turnover.fbizstatus.id == 'bizstatus_02') ? turnover.fmodifydate : ''}}</td>
            </tr>
          </table>
        </el-dialog>
        <div class="note">
          <div>
            <h4 class="title">钱包余额</h4>
            <div class="content color-grey text-center relative">
              <i class="icon icon-money"></i>可用余额: <span class="color-black" v-html="account.balance.html"></span>
              <p class="bottom"><label><i class="icon"></i>含有赔付金:￥{{account.claim.price}}</label>
                <router-link class="color-orange" :to="{path: '/settle/claim'}">赔付帐明细 >></router-link>
              </p>
            </div>
            <div class="foot text-center">
              <el-button type="orange" @click="$router.push({path: '/settle/recharge',query: {price:account.balance.price}})">充值</el-button>
              <el-button type="orange" @click="$router.push({path: '/settle/withdraw',query: {price:account.balance.price}})" plain>提现</el-button>
            </div>
          </div>
          <div v-if="$store.state.userCtx.isMonthlyaccount">56
            <div class="title">VIP月结账单 <el-select v-model="account.monthly.active" size="small" placeholder="月份" @change="opClick('monthOrder')">
                <el-option v-for="item in account.monthly.data.filter(o=>{return o.b<=new Date().getMonth()+1})" :key="item.b" :label="item.a" :value="item.b"></el-option>
              </el-select>
            </div>
            <div class="content text-center" v-html="account.monthly.html">
            </div>
            <div class="foot text-center">
              <el-button type="orange" @click="$router.push({path: '/settle/monthpay',query: {price:account.monthly.noPay,month:account.monthly.active}})" v-if="account.monthly.noPay>0">立即支付</el-button>
              <el-button type="orange" plain @click="$router.push({path: '/settle/month',query:{date:account.monthly.active}})">月账单</el-button>
            </div>
          </div>
        </div>
        <div class="title border-bottom-solid margin-v">交易明细<em class="download right absolute pointer" @click="opClick('download')"><i class="icon icon-download"></i>下载</em></div>
        <div class="screen" label="交易类型：">
          <Radio type="radius" v-model="screen.trade.active" :defaults='true' defaultTxt="全部">
            <div v-for="item in screen.trade.data" :key="item.a" :value="item.b">{{item.a}}</div>
          </Radio>
        </div>
        <div class="screen" label="时间：">
          <Radio type="radius" v-model="screen.time.active" :defaults='true' defaultTxt="全部">
            <div v-for="item in screen.time.data" :key="item.a" :value="item.b">{{item.a}}</div>
          </Radio>
          <div class="absolute right top">
            自定义日期　<el-date-picker v-model="screen.calendar" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="screen.time.active='default';isWatch=!1;getData({});">
            </el-date-picker>
          </div>
        </div>
        <table cellpadding="8" cellspacing="8" class="stream" width="100%">
          <tr>
            <td width="33.33%"><i class="icon"></i>支出<p><span class="font20">{{Number(comm.Odefault(census.find(o=>{return o.fpurpose=='bizpurpose_02'}),'fvalue','0')).toFixed(2)}}</span>元</p>
            </td>
            <td width="33.33%"><i class="icon"></i>收入<p><span class="font20">{{Number(comm.Odefault(census.find(o=>{return o.fpurpose=='bizpurpose_06'}),'fvalue','0')).toFixed(2)}}</span>元</p>
            </td>
            <td width="33.33%"><i class="icon"></i>赔付收入<p><span class="font20">{{Number(comm.Odefault(census.find(o=>{return o.fpurpose=='bizpurpose_10'}),'fvalue','0')).toFixed(2)}}</span>元</p>
            </td>
          </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="table theme-gray font14 margin-top lineheight-three">
          <colgroup>
            <col width="135" />
            <col width="200" />
            <col width="150" />
            <col width="100" />
            <col width="120" />
            <col width="80" />
            <col width="90" />
            <col width="123" />
          </colgroup>
          <tr>
            <th>日期</th>
            <th>流水号</th>
            <th>订单号</th>
            <th>用途</th>
            <th>金额（元）</th>
            <th>状态</th>
            <th>支付方式</th>
            <th>操作</th>
          </tr>
          <tr v-for="item in datas" :key="item.fid">
            <td>{{comm.DateToString(comm.toDate(item.fdate),'yyyy-MM-dd')}}</td>
            <td>{{item.ftranid}}</td>
            <td><a href="javascript:" class="color-orange" @click="opClick('order',{source:item.fpurpose,id:item.fverificor})">{{item.fsourcenumber}}</a></td>
            <td>{{item.fpurposename}}</td>
            <td class="color-blue">{{item.fdirection==='direction_01'?'+':'-'}}{{item.famount}}</td>
            <td>{{item.fbizstatusname}}</td>
            <td>{{item.fwayname}}</td>
            <td><a href="javascript:" class="color-orange" @click="opClick('detail',item.fid)">详情</a></td>
          </tr>
        </table>
        <template>
          <div class="text-center">
            <el-pagination @size-change="getData({type:'size',value:$event})" @current-change="getData({type:'index',value:$event})" :current-page="listDesc.pageIndex" :page-sizes="[10, 30, 50]" :page-size="listDesc.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listDesc.records"></el-pagination>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
	data() {
		return {
			screen: {
				trade: {
					data: [{a: '订单支付', b: 'bizpurpose_02'}, {a: '补价支付', b: 'bizpurpose_09'}, {a: '充值', b: 'bizpurpose_01'}, {a: '退款', b: 'bizpurpose_06'}, {a: '赔付收入', b: 'bizpurpose_10'}],
					active: 'default'
				},
				time: {
					data: [{a: '本周', b: '5'}, {a: '本月', b: '1'}, {a: '本季度', b: '6'}, {a: '本年', b: '3'}],
					active: 'default'
				},
				calendar: ''
			},
			account: {
				balance: {
					price: 0,
					html: ''
				},
				claim: {
					price: 0
				},
				monthly: {
					data: [{a: '一月', b: 1}, {a: '二月', b: 2}, {a: '三月', b: 3}, {a: '四月', b: 4}, {a: '五月', b: 5}, {a: '六月', b: 6}, {a: '七月', b: 7}, {a: '八月', b: 8}, {a: '九月', b: 9}, {a: '十月', b: 10}, {a: '十一月', b: 11}, {a: '十二月', b: 12}],
					active: new Date().getMonth() + 1,
					yesPay: 0,
					noPay: 0,
					html: ''
				}
			},
			datas: [],
			census: [],
			listDesc: {pageIndex: 1, pageSize: 10, records: 0},
			isWatch: true,
			dialogVisible: false,
			turnover: {}
		};
	},
	created() {
		let t = this;
		t.axios.post('/dynamic/pay_settleorder?operationno=querybalance', {loadingOption: {target: '.element-loading'}, simpleData: {customerId: t.$store.state.userCtx.linkIdentity.id}}).then(res => {
			t.account.balance.price = Number(res.data.operationResult.srvData.balance).toFixed(2);
			t.account.balance.html = t.comm.StringFormat('￥<span class="font20">{0}.<em class="font14">{1}</em></span>', String(t.account.balance.price).split('.'));
			t.account.claim.price = Number(res.data.operationResult.srvData.claim).toFixed(2);
		});
		t.opClick('monthOrder');
		t.getData({});
	},
	methods: {
		opClick(type, data) {
			let t = this;
			switch (type) {
				case 'monthOrder':
					if (!t.$store.state.userCtx.isMonthlyaccount) {
						return;
					}
					t.axios.post('/dynamic/pay_monthlystatement?operationno=returntotalpayamount', {simpleData: {fmerchantid: t.$store.state.userCtx.linkIdentity.id, fmonth: t.account.monthly.active}}).then(res => {
						t.account.monthly.noPay = Number(res.data.operationResult.srvData.fTopayAmount).toFixed(2);
						t.account.monthly.yesPay = Number(res.data.operationResult.srvData.fPaidAmount).toFixed(2);
						t.account.monthly.html = t.comm.StringFormat(
							'<i class="icon icon-menu"></i>待支付：<span class="color-black">￥<span class="font20">{0}.<em class="font14">{1}</em></span>　已支付：<span class="color-black">￥<span class="font20">{2}.<em class="font14">{3}</em></span></span>',
							String(t.account.monthly.noPay)
								.split('.')
								.concat(String(t.account.monthly.yesPay).split('.'))
						);
						if (res.data.operationResult.srvData.fpaystatus === 'fpaystatus_02') {
							t.account.monthly.text = '已支付';
						}
					});
					break;
				case 'detail':
					t.axios.post('/dynamic/coo_incomedisburse?operationno=LoadData', {selectedRows: [{PKValue: data}]}).then(res => {
						if (res && res.data.operationResult.isSuccess && res.data.operationResult.srvData) {
							t.dialogVisible = !0;
							t.turnover = res.data.operationResult.srvData.uidata;
						}
					});
					break;
				case 'download':
					let filterStr = ["fcustomerid='" + t.$store.state.userCtx.linkIdentity.id + "'"];
					if (t.screen.trade.active !== 'default') {
						filterStr.push("fpurpose='" + t.screen.trade.active + "'");
					}
					if (t.screen.time.active !== 'default') {
						let t1 = '',
							t2 = '',
							t3 = new Date();
						switch (t.screen.time.active) {
							case '5': //周
								let week = t3.getDay();
								if (week === 0) {
									week = 7;
								}
								let day = t3.getDate();
								t1 = t.comm.DateToString(new Date(t3.getFullYear(), t3.getMonth(), day - (week - 1)), 'yyyy-MM-dd') + ' 00:00:00';
								t2 = t.comm.DateToString(new Date(t3.getFullYear(), t3.getMonth(), day + (7 - week)), 'yyyy-MM-dd') + ' 23:59:59';
								break;
							case '1': //月
								t1 = t.comm.DateToString(new Date(t3.getFullYear(), t3.getMonth(), 1), 'yyyy-MM-dd') + ' 00:00:00';
								t2 = t.comm.DateToString(new Date(t3.getFullYear(), t3.getMonth() + 1, 0), 'yyyy-MM-dd') + ' 23:59:59';
								break;
							case '6': //季度
								let i = 1;
								while (i < 5) {
									if (t3.getMonth() + 1 <= i * 3) {
										t1 = t.comm.DateToString(new Date(t3.getFullYear(), (i - 1) * 3, 1), 'yyyy-MM-dd') + ' 00:00:00';
										t2 = t.comm.DateToString(new Date(t3.getFullYear(), i * 3, 0), 'yyyy-MM-dd') + ' 23:59:59';
										break;
									}
									i++;
								}
								break;
							case '3':
								t1 = t.comm.DateToString(new Date(t3.getFullYear(), 0, 1), 'yyyy-MM-dd') + ' 00:00:00';
								t2 = t.comm.DateToString(new Date(t3.getFullYear(), 11, 31), 'yyyy-MM-dd') + ' 23:59:59';
								break;
						}
						filterStr.push("fdate>='" + t1 + "' and fdate<'" + t2 + "'");
					}
					if (t.screen.calendar.length > 1) {
						filterStr.push("fdate>='" + (t.comm.DateToString(t.screen.calendar[0], 'yyyy-MM-dd') + ' 00:00:00') + "' and fdate<'" + (t.comm.DateToString(t.screen.calendar[1], 'yyyy-MM-dd') + ' 23:59:59') + "'");
					}
					t.axios
						.post('/list/coo_incomedisburse?operationno=listdatatoexcel', {
							simpleData: {
								colModel: '["fdate","ftranid","fsourcenumber","fpurpose_txt","famount","fdirection_txt","fbizstatus_txt","fway_txt"]',
								filterString: filterStr.join(' and ')
							}
						})
						.then(res => {
							let fromData = new FormData();
							fromData.append('exportUrl', res.data.operationResult.srvData);
							t.axios
								.post('/download/bas_filedetail', fromData, {
									responseType: 'arraybuffer'
								})
								.then(res => {
									let headers = res.headers;
									let title = '';
									let blob = new Blob([res.data], {
										type: headers['content-type']
									});

									if (window.navigator.msSaveOrOpenBlob) {
										// 兼容IE10
										navigator.msSaveBlob(blob, this.filename);
									} else {
										//  chrome/firefox
										let link = document.createElement('a');
										link.href = window.URL.createObjectURL(blob);
										if (!title) {
											const fileName = headers['content-disposition'];
											title = fileName.includes('filename=') ? fileName.split('=')[1] : '下载的表单文件';
										}
										link.download = title;
										link.click();
										URL.revokeObjectURL(link.href);
									}
								});
						});
					break;
				case 'order':
					switch (data.source) {
						case 'bizpurpose_02':
							t.$router.push({
								path: '/order/pre-orders',
								query: {id: data.id}
							});
							break;
						case 'bizpurpose_09':
							t.$router.push({
								path: '/order/det-supply',
								query: {id: data.id}
							});
							break;
						case 'bizpurpose_10':
							t.$router.push({
								path: '/droit/det-complain',
								query: {id: data.id}
							});
							break;
						case 'bizpurpose_11':
							t.$router.push({
								path: '/order/det-additional',
								query: {id: data.id}
							});
							break;
					}
					break;
			}
		},
		getData(data) {
			let t = this;
			let sD = {pageIndex: 1, pageSize: 10, purpose: '', dataType: '', dtStart: '', dtEnd: '', customerId: t.$store.state.userCtx.linkIdentity.id};
			if (data.type === 'index') {
				sD.pageIndex = data.value;
			}
			if (data.type === 'szie') {
				sD.pageSize = data.value;
			}
			if (t.tradeActive !== 'default') {
				sD.purpose = t.tradeActive;
			}
			if (t.timeActive !== 'default') {
				sD.dataType = t.timeActive;
			} else {
				if (t.screen.calendar.length == 2) {
					sD.dtStart = t.comm.DateToString(t.screen.calendar[0], 'yyyy-MM-dd') + ' 00:00:00';
					sD.dtEnd = t.comm.DateToString(t.screen.calendar[1], 'yyyy-MM-dd') + ' 23:59:59.999';
				}
			}
			t.axios.post('/bill/ydj_merchantorder?operationno=getconsumptions', {simpleData: sD}).then(res => {
				t.datas = res.data.operationResult.srvData.list.rptGridDataSource;
				t.census = res.data.operationResult.srvData.groupbyDataList;
				let listDesc = res.data.operationResult.srvData.list.listDesc;
				listDesc.records = listDesc.rows;
				t.listDesc = listDesc;
				t.isWatch = !0;
			});
		}
	},
	computed: {
		tradeActive() {
			return this.screen.trade.active;
		},
		timeActive() {
			return this.screen.time.active;
		}
	},
	watch: {
		tradeActive(v) {
			this.getData({});
		},
		timeActive(v) {
			if (this.isWatch) {
				this.calendar = '';
				this.getData({});
			}
		}
	}
};
</script>
<style lang="scss">
.note > div {
	.title {
		.el-select {
			width: 110px;
			line-height: 32px;
			position: absolute;
			top: 5px;
			right: 14px;
		}
	}
	.content {
		.icon {
			margin-right: 10px;
			vertical-align: middle;
		}
		.bottom {
			.icon {
				position: absolute;
				left: 0px;
				top: 0px;
				width: 15px;
				height: 17px;
				background-position: -377px -90px;
			}
		}
	}
}
.stream {
	background-color: #f5f5f5;
	font-size: 14px;
	tr td {
		background-color: #fff;
		padding-left: 76px;
		position: relative;
		padding-top: 15px;
		p {
			margin: 10px 0;
		}
		.icon {
			width: 36px;
			height: 36px;
			display: block;
			position: absolute;
			left: 20px;
			top: 25px;
		}
		&:nth-child(1) {
			.icon {
				background-position: -431px -110px;
			}
		}
		&:nth-child(2) {
			.icon {
				background-position: -477px -110px;
			}
		}
		&:nth-child(3) {
			.icon {
				background-position: -523px -110px;
			}
		}
	}
}
</style>
