<template>
  <div>
    <BreadCrumb :data="[{ a: '退款管理' }]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right order-list">
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
          <li>订单信息</li>
          <li>原单金额</li>
          <li>退款金额</li>
          <li>状态</li>
          <li>操作</li>
        </ul>
        <table width="100%" class="order-item" :key="item.fbillhead_id" v-for="item in uiData.listData">
          <colgroup>
            <col width="325">
            <col width="155">
            <col width="145">
            <col width="145">
            <col width="225">
          </colgroup>
          <tr>
            <th align="left" colspan="5">
              <strong>{{item.fcreatedate}}</strong><span>订单编号:{{item.fbillno}}</span>
            </th>
          </tr>
          <tr>
            <td>
              <p>{{item.fcustname}}　　{{item.fphone}}</p>
              <p>{{item.faddress}}</p>
            </td>
            <td>￥{{item.fmtotalamount}}</td>
            <td class="color-red">￥{{comm.priceSum(item.fmtotalamount-item.fmtotalamount_chg,2)}}</td>
            <td v-html="statusInit(item.frefundstatus,item.frefundstatus_fenumitem)"></td>
            <td>
              <a href="javascript:void(0)" :key="button.b" v-for="button in btnOpInit(item.frefundstatus)" @click="opClick(button.b,item)">{{button.a}}</a>
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
import RefundListPlugIn from './indexPlugIn';
const listView = {
	extends: base
};
listView.formId = 'ser_refund';
listView.plugs = [new RefundListPlugIn({})];
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
				if (t.tagData.cMload) {
					this.cornerMarker(t);
					t.tagData.cMload = !1;
				}
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
				t.axios.post('/bill/ser_refund?operationno=getdealwithcount', {loadingOption: {target: '.order-panel'}, simpleData: {merchantId: t.$store.state.userCtx.linkIdentity.id}}).then(res => {
					let srvData = res.data.operationResult.srvData;
					if (srvData instanceof Array) {
						srvData.forEach(o => {
							d.tagData.tD.find(a => {
								return a.s.indexOf(o.fname) > -1;
							}).c = o.fcount;
						});
					}
				});
			},

			/*状态颜色*/
			statusInit(status, txt) {
				let t = this;
				if (status == 'doing_status02') {
					txt = '退款成功';
				}
				switch (status) {
					case 'doing_status01':
						return '<label class="color-green">' + txt + '</label>';
					case 'doing_status05':
						return '<label class="color-red">' + txt + '</label>';
					default:
						return '<label class="color-gray">' + txt + '</label>';
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
				let btn = [{a: '查看', b: 'lookOrder'}];
				switch (a) {
					case 'doing_status01':
						return [{a: '取消退款', b: 'exit'}].concat(btn);
					case 'doing_status05':
						return [{a: '申请退款', b: 'apply'}].concat(btn);
					case 'doing_status02':
						return [{a: '查看钱款', b: 'lookmoney'}].concat(btn);
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
							path: '/droit/det-refund',
							query: {id: b.fbillhead_id}
						});
						break;
					case 'apply': //申请退款
						t.$router.push({
							path: '/droit/cre-refund',
							query: {orderId: b.fsourcemerchantid}
						});
						break;
					case 'exit':
						t.axios.post('/list/ser_refund?operationno=cancelRefundmoney', {selectedRows: [{pkValue: b.fbillhead_id}]}).then(res => {
							t.invokePlugIn('refresh');
							t.cornerMarker(t);
						});
						break;
					case 'lookmoney':
						t.$router.push({path: '/settle'});
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
		li:nth-child(1) {
			width: 325px;
		}
		li:nth-child(2) {
			width: 155px;
		}
		li:nth-child(3) {
			width: 145px;
		}
		li:nth-child(4) {
			width: 145px;
		}
		li:nth-child(5) {
			width: 225px;
		}
	}
}
</style>