<template>
  <div>
    <BreadCrumb :data=" [{a: '我的钱包', b: {path: '/settle'}}, {a: '月结账单'}]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right wallet">
        <div class="title border-bottom-solid margin-v">月账单<em class="download right absolute pointer" @click="opClick('download')"><i class="icon icon-download"></i>下载</em></div>
        <div class="search">
          <el-date-picker v-model="calendar" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          <!-- <el-input placeholder="订单号" v-model="order" @keyup.enter.native="getData({})"></el-input> -->
          <el-button @click="getData({})">搜索</el-button>
        </div>
        <table cellpadding="0" cellspacing="0" class="table theme-gray font14 lineheight-three">
          <colgroup>
            <col width="165" />
            <col width="200" />
            <col width="190" />
            <col width="100" />
            <col width="140" />
            <col width="80" />
            <col width="123" />
          </colgroup>
          <tr>
            <th>日期</th>
            <th>流水号</th>
            <th>订单号</th>
            <th>用途</th>
            <th>金额（元）</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          <tr v-for="item in datas" :key="item.fid">
            <td>{{comm.DateToString(comm.toDate(item.fdate),'yyyy-MM-dd')}}</td>
            <td>{{item.ftranid}}</td>
            <td><a href="javascript:" class="color-orange" @click="opClick('order',{source:item.fpurpose,id:item.fverificor})">{{item.fsourcenumber}}</a></td>
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
        <el-dialog title="消费详情" :visible.sync="dialogVisible" width="820px" v-if="!comm.IsNullOrEmpty(detailData)">
          <div class="summary font20" v-if="!comm.IsNullOrEmpty(detailData.fbizstatus.fname)">{{detailData.fbizstatus.fname}}</div>
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
                交易用途：{{detailData.fpurpose.fenumitem}}
              </td>
            </tr>
            <tr>
              <td>金　额：<span class="color-blue">{{detailData.fdirection.id==='direction_01'?'+':'-'}}{{detailData.famount}}</span></td>
              <td>支付方式：{{detailData.fway.fname}}</td>
            </tr>
            <tr>
              <td>订单单号：{{comm.Odefault(detailData,'forderno','无')}}</td>
              <td>流水号：{{detailData.ftranid}}</td>
            </tr>
            <tr>
              <td>创建时间：{{detailData.fcreatedate}}</td>
              <td>交易时间：{{(detailData.fbizstatus && detailData.fbizstatus.id == 'bizstatus_02') ? detailData.fmodifydate : ''}}</td>
            </tr>
          </table>
        </el-dialog>
      </div>
    </div>
  </div>
</template> 

<script>
export default {
	data() {
		return {
			calendar: '',
			order: '',
			datas: [],
			listDesc: {pageIndex: 1, pageSize: 10, records: 0},
			isWatch: true,
			dialogVisible: false,
			detailData: {}
		};
	},
	created() {
		let date = new Date();
		let month = parseInt(this.comm.Odefault(this.$route.query, 'date', date.getMonth() + 1)) - 1;
		this.calendar = [new Date(date.getFullYear(), month, 1), new Date(date.getFullYear(), month + 1, 0)];
		this.getData({});
	},
	methods: {
		opClick(type, data) {
			let t = this;
			switch (type) {
				case 'pay':
					t.$router.push({
						path: '/settle/recharge',
						query: {
							price: t.balancePrice
						}
					});
					break;
				case 'detail':
					t.axios.post('/dynamic/coo_incomedisburse?operationno=LoadData', {selectedRows: [{PKValue: data}]}).then(res => {
						if (res && res.data.operationResult.isSuccess && res.data.operationResult.srvData) {
							let resData = res.data.operationResult.srvData.uidata;
							t.dialogVisible = !0;
							t.detailData = resData;
						}
					});
					break;
				case 'download':
					let filterStr = ["fcustomerid='" + t.$store.state.userCtx.linkIdentity.id + "' and faccount='settleaccount_type_08'"];
					if (t.calendar.length > 1) {
						filterStr.push("fdate>'" + (t.comm.DateToString(t.calendar[0], 'yyyy-MM-dd') + ' 00:00:00') + "' and fdate<'" + (t.comm.DateToString(t.calendar[1], 'yyyy-MM-dd') + ' 23:59:59') + "'");
					}
					t.axios
						.post('/list/coo_incomedisburse?operationno=listdatatoexcel', {
							simpleData: {
								colModel: '["fdate","ftranid","fsourcenumber","fpurpose_txt","famount","fdirection_txt","fbizstatus_txt"]',
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
			let sD = {pageIndex: 1, pageSize: 10, dataType: '', dtStart: '', dtEnd: '', account: 'settleaccount_type_08', customerId: t.$store.state.userCtx.linkIdentity.id};
			if (data.type === 'index') {
				sD.pageIndex = data.value;
			}
			if (data.type === 'szie') {
				sD.pageSize = data.value;
			}
			if (t.calendar.length == 2) {
				sD.dtStart = t.comm.DateToString(t.calendar[0], 'yyyy-MM-dd') + ' 00:00:00';
				sD.dtEnd = t.comm.DateToString(t.calendar[1], 'yyyy-MM-dd') + ' 23:59:59';
			} else {
				sD.dataType = '1';
			}
			t.axios.post('/bill/ydj_merchantorder?operationno=getconsumptions', {simpleData: sD}).then(res => {
				t.datas = res.data.operationResult.srvData.list.rptGridDataSource;
				let listDesc = res.data.operationResult.srvData.list.listDesc;
				listDesc.records = listDesc.rows;
				t.listDesc = listDesc;
				t.isWatch = !0;
			});
		}
	}
};
</script>
