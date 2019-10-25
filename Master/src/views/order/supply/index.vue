<template>
  <div>
    <BreadCrumb :data="[{ a: '补价单' }]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right order-list">
        <el-dialog title="驳回原因" v-if="!comm.IsNullOrEmpty(tagData.reject)" :visible.sync="tagData.reject.visible">
          <p class="color-red margin-bottom">请填写驳回原因，提交后将通知到对应的师傅</p>
          <el-input type="textarea" v-model="tagData.reject.desc" placeholder="驳回原因" :rows="4" :maxlength="500"></el-input>
          <span slot="footer">
            <el-button @click="opClick('rejectExit')">取 消</el-button>
            <el-button type="primary" @click="opClick('rejectConfirm')">确定</el-button>
          </span>
        </el-dialog>
        <el-tabs v-model="tagData.tA" @tab-click="customEvent({opcode:'tabClick'})">
          <el-tab-pane v-for="item in tagData.tD" :key="item.a" :name="item.b">
            <span slot="label">{{item.a}}<label class="color-red" v-if="!comm.IsNullOrEmpty(item.c,0)">({{item.c}})</label></span>
          </el-tab-pane>
        </el-tabs>
        <div class="search">
          <label>客户信息</label>
          <el-input placeholder="客户姓名/手机号" v-model="tagData.cS" @keyup.enter.native="queryInit('search')"></el-input>
          <label>订单号</label>
          <el-input placeholder="订单号" v-model="tagData.oS" @keyup.enter.native="queryInit('search')"></el-input>
          <el-button @click="queryInit('search')">搜索</el-button>
          <el-button @click="opClick('reset')">重置</el-button>
        </div>
        <ul class="order-title">
          <li>服务类型</li>
          <li>订单信息</li>
          <li>金额</li>
          <li>状态</li>
          <li>操作</li>
        </ul>
        <table width="100%" class="order-item" :key="item.fbillhead_id" v-for="item in uiData.listData">
          <colgroup>
            <col width="155">
            <col width="325">
            <col width="145">
            <col width="145">
            <col width="225">
          </colgroup>
          <tr>
            <th align="left" colspan="5">
              <strong>{{item.fcreatedate}}</strong><span>订单编号:{{item.fbillno}}</span>
              <span v-if="!comm.IsNullOrEmpty(item.fmasterid_fname)">安装师傅:<label class="color-orange">{{item.fmasterid_fname}}</label></span>
              <span v-if="!comm.IsNullOrEmpty(item.fmasterid_fname)">联系电话:{{item.fmasterid_fphone}}</span>
            </th>
          </tr>
          <tr>
            <td>{{item.fservicetype_fenumitem}}</td>
            <td>
              <p>{{item.fcustname}}　　{{item.fphone}}</p>
              <p>{{item.faddress}}</p>
            </td>
            <td class="color-red">￥{{item.ftotalamount_chg}}</td>
            <td v-html="statusInit(item.fhandlestatus)"></td>
            <td>
              <a href="javascript:void(0)" :key="button.b" v-for="button in btnOpInit(item.fhandlestatus)" @click="opClick(button.b,item)">{{button.a}}</a>
            </td>
          </tr>
        </table>
        <template>
          <div class="text-center">
            <el-pagination @size-change="customEvent({opcode:'pageSizeChanged',value:$event})" @current-change="customEvent({opcode:'pageIndexChanged',value:$event})" :current-page="uiData.listDesc.pageIndex" :page-sizes="[10, 30, 50]" :page-size="uiData.listDesc.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="uiData.listDesc.records"></el-pagination>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import {listView as base} from '../../../lib';
import SupplyListPlugIn from './indexPlugIn';
const listView = {
	extends: base
};
listView.formId = 'ydj_servicechange';
listView.plugs = [new SupplyListPlugIn({})];
listView.mixins = [
	{
		methods: {
			/**
      *
      load数据
      *
     	@method queryInit
			@param {string} type 类型
      @param {string} name tabs name/
      @param {Object} [data] Vm.data/this
      */
			queryInit(type, name, data) {
				let t = data || this;
				let filterArray = [t.tagData.mS];
				switch (type) {
					case 'search':
						if (!this.comm.IsNullOrEmpty(t.tagData.cS)) {
							filterArray.push(this.comm.StringFormat("(fcustname like '%{0}%' or fphone like '%{0}%')", t.tagData.cS));
						}
						if (!this.comm.IsNullOrEmpty(t.tagData.oS)) {
							filterArray.push(this.comm.StringFormat("(fbillno like '%{0}%')", t.tagData.oS));
						}
						break;
					default:
						t.tagData.tA = name;
						t.tagData.cS = '';
						t.tagData.oS = '';
						t.tagData.tS = t.tagData.tD.find(o => {
							return o.b === name;
						}).s;
						break;
				}
				filterArray.push(t.tagData.tS);
				this.cornerMarker(t);
				this.comm.ArrayRemove(filterArray, o => {
					return this.comm.IsNullOrEmpty(o);
				});
				if (!t.query) {
					t.query = {filterString: filterArray.join(' and '), selectFields: ['fmasterid']};
				} else {
					t.query.filterString = filterArray.join(' and ');
					t.query.selectFields = ['fmasterid'];
				}
			},
			/**
      *
      状态对应条数角标
      *
      @method cornerMarker
      @param {Object} d tagData
      */
			cornerMarker(d) {
				let t = this;
				t.axios.post('/bill/ydj_servicechange?operationno=getdealwithcount', {loadingOption: {target: '.order-panel'}, simpleData: {merchantId: t.$store.state.userCtx.linkIdentity.id}}).then(res => {
					let srvData = res.data.operationResult.srvData;
					if (srvData instanceof Array) {
						srvData.forEach(o => {
							d.tagData.tD.find(a => {
								return a.n === o.fname;
							}).c = o.fcount;
						});
					}
				});
			},
			/*状态颜色*/
			statusInit(status) {
				let t = this;
				switch (status) {
					case 'premium_status01':
						return '<label class="color-red">待处理</label>';
					case 'premium_status02':
						return '<label class="color-green">补价成功</label>';
					case 'premium_status04':
						return '<label class="color-gray">师傅取消</label>';
					case 'premium_status05':
						return '<label class="color-gray">已驳回</label>';
					default:
						return '';
				}
			},
			/**
      *
      列表操作按钮初始化
      *
      @method btnOpInit
      @param {String} a 状态字符串
      @return {Array} Array[Object]
      */
			btnOpInit(a) {
				let t = this;
				if (a == 'premium_status01') {
					return [{a: '同意', b: 'payOrder'}, {a: '驳回', b: 'reject'}, {a: '查看', b: 'lookOrder'}];
				}
				return [{a: '查看', b: 'lookOrder'}];
			},
			/**
      *
      按钮事件
      *
      @method opClick
      @param {String} a 操作Code
      @param {Object} [b] 数据
      */
			opClick(a, b) {
				let t = this;
				switch (a) {
					case 'reset': //重置搜索条件
						t.tagData.cS = '';
						t.tagData.oS = '';
						break;
					case 'lookOrder': //查看订单
						t.$router.push({
							path: '/order/det-supply',
							query: {id: b.fbillhead_id}
						});
						break;
					case 'payOrder': //支付订单
						t.$confirm('本次支付将您的账户余额中扣除费用，您确定支付？', '操作提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
							.then(() => {
								t.axios.post('/bill/ydj_servicechange?operationno=servicechangeAudit', {selectedRows: [{pkValue: b.fbillhead_id}]}).then(res => {
									let srvData = res.data.operationResult.srvData;
									if (srvData.fpay === 1) {
										t.$confirm('由于您的账户余额不足，你还需要支付' + srvData.famount + '元，确定支付？', '余额不足', {
											confirmButtonText: '去支付',
											cancelButtonText: '取消',
											type: 'warning'
										}).then(() => {
											t.comm.OrderPay({
												id: b.fbillhead_id,
												price: srvData.famount,
												formId: 'ydj_servicechange',
												type: 'servicechange',
												other: {
													service: {No: b.fbillno, sourceNo: b.fmerbill},
													consumer: {name: b.fcustname, phone: b.fphone}
												}
											});
										});
									} else {
										t.invokePlugIn('refresh');
										//t.cornerMarker(t);
									}
								});
							})
							.catch(() => {});
						break;
					case 'reject': //驳回
						t.tagData.reject = {id: b.fbillhead_id, visible: !0, desc: ''};
						break;
					case 'rejectExit': //驳回窗口取消
						t.tagData.reject = {id: '', visible: !1, desc: ''};
						break;
					case 'rejectConfirm': //驳回数据提交
						if (t.comm.IsNullOrEmpty(t.tagData.reject.desc)) {
							t.$message({
								message: '请填写驳回原因',
								type: 'warning'
							});
							return;
						}
						t.axios.post('/bill/ydj_servicechange?operationno=unauditbycustomer', {loadingOption: {target: '.element-loading'}, selectedRows: [{pkValue: t.tagData.reject.id}], simpleData: {opDesc: t.tagData.reject.desc}}).then(res => {
							t.tagData.reject = {id: '', visible: !1, desc: ''};
							t.queryInit('', 'two');
						});
						break;
				}
			}
		},
		computed: {
			TabsWatch() {
				return this.tagData.tA;
			}
		},
		watch: {
			TabsWatch(val) {
				this.$store.commit('pageStatus', {orderTab: val});
			}
		}
	}
];
export default listView;
</script>
<style lang="scss" scoped>
.order-list {
	.order-title {
		li {
			&:nth-child(1) {
				width: 135px;
			}
			&:nth-child(2) {
				width: 325px;
			}
			&:nth-child(3) {
				width: 145px;
			}
			&:nth-child(4) {
				width: 145px;
			}
			&:nth-child(5) {
				width: 225px;
			}
		}
	}
	.order-item td p {
		padding-left: 0;
	}
}
</style>