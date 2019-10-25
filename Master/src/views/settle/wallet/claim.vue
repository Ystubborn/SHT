<template>
  <div>
    <BreadCrumb :data=" [{a: '我的钱包', b: {path: '/settle'}}, {a: '赔付金'}]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right claim">
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
        <Agreement title="左右手平台赔付保障协议" :visible.sync="claimVisible" show="claim"></Agreement>
        <div class="note">
          <div>
            <h4 class="title">赔付金余额</h4>
            <div class="content color-grey text-center relative">
              <i class="icon icon-money"></i>
              <p class="bottom">
                <label class="font14">可用余额：<span class="color-black" v-html="claim.enablehtml"></span></label>
                <label class="font14">已使用：<span class="color-red" v-html="claim.disablehtml"></span></label>
              </p>
            </div>
            <div class="foot font14">
              说明：服务赔付金为投诉赔付补偿金，可用于订单支付时使用。服务赔付金不支持提现。<a href="javascript:" class="color-orange" @click="claimVisible=!0">了解详情 >></a>
            </div>
          </div>
        </div>
        <div class="title border-bottom-solid margin-v">赔付金流水记录</div>
        <div class="screen" label="时间：">
          <Radio type="radius" v-model="screen.time.active" :defaults='true' defaultTxt="全部">
            <div v-for="item in screen.time.data" :key="item.a" :value="item.b">{{item.a}}</div>
          </Radio>
          <div class="absolute right top">
            自定义日期　<el-date-picker v-model="screen.calendar" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="screen.time.active='default';isWatch=!1;getData({});">
            </el-date-picker>
          </div>
        </div>
        <table cellpadding="0" cellspacing="0" class="table theme-gray font14 margin-top">
          <colgroup>
            <col width="170" />
            <col width="120" />
            <col width="240" />
            <col width="110" />
            <col width="140" />
            <col width="110" />
            <col width="108" />
          </colgroup>
          <tr>
            <th>日期</th>
            <th>订单号</th>
            <th>客户信息</th>
            <th>来源</th>
            <th>赔付金额（元）</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          <tr v-for="item in datas" :key="item.fid">
            <td>{{item.fdate}}</td>
            <td><a href="javascript:" class="color-orange" @click="opClick('order',{source:item.fpurpose,id:item.fverificor})">{{item.fsourcenumber}}</a></td>
            <td>{{item.fcusname}} {{item.fcusphone}}
              <br />
              {{item.fcusaddress}}
            </td>
            <td>{{item.fpurposename}}</td>
            <td class="color-blue">{{item.fdirection==='direction_01'?'+':'-'}}{{item.famount}}</td>
            <td>{{item.fbizstatusname}}</td>
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
				time: {
					data: [{a: '本周', b: '5'}, {a: '本月', b: '1'}, {a: '本季度', b: '6'}, {a: '本年', b: '3'}],
					active: 'default'
				},
				calendar: ''
			},
			claim: {
				enableprice: 0,
				disableprice: 0,
				enablehtml: '',
				disablehtml: ''
			},
			datas: [],
			census: [],
			listDesc: {pageIndex: 1, pageSize: 10, records: 0},
			isWatch: true,
			dialogVisible: !1,
			claimVisible: !1,
			turnover: {}
		};
	},
	created() {
		let t = this;
		t.axios.post('/dynamic/pay_settleorder?operationno=QueryPayBalance', {loadingOption: {target: '.element-loading'}, simpleData: {customerId: t.$store.state.userCtx.linkIdentity.id}}).then(res => {
			let html = '￥<span class="font20">{0}.<em class="font14">{1}</em></span>';
			t.claim.enableprice = Number(res.data.operationResult.srvData.fbalance).toFixed(2);
			t.claim.enablehtml = t.comm.StringFormat(html, String(t.claim.enableprice).split('.'));
			t.claim.disableprice =Number( 0-res.data.operationResult.srvData.fuseredBalance).toFixed(2);
			t.claim.disablehtml = t.comm.StringFormat('-' + html, String(t.claim.disableprice).split('.'));
		});
		t.getData({});
	},
	methods: {
		opClick(type, data) {
			let t = this;
			switch (type) {
				case 'detail':
					t.axios.post('/dynamic/coo_incomedisburse?operationno=LoadData', {selectedRows: [{PKValue: data}]}).then(res => {
						if (res && res.data.operationResult.isSuccess && res.data.operationResult.srvData) {
							t.dialogVisible = !0;
							t.turnover = res.data.operationResult.srvData.uidata;
						}
					});
					break;
				case 'order':
					t.$router.push({
						path: '/droit/det-complain',
						query: {id: data.id}
					});
					break;
			}
		},
		getData(data) {
			let t = this;
			let sD = {pageIndex: 1, pageSize: 10, purpose: 'bizpurpose_10', dataType: '', dtStart: '', dtEnd: '', customerId: t.$store.state.userCtx.linkIdentity.id};
			if (data.type === 'index') {
				sD.pageIndex = data.value;
			}
			if (data.type === 'szie') {
				sD.pageSize = data.value;
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
		timeActive() {
			return this.screen.time.active;
		}
	},
	watch: {
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
.claim .table tr td{padding: 11px 0}
</style>
