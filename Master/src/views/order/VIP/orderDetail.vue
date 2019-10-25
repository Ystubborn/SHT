<template>
  <div>
    <BreadCrumb :data="[{ a: '订单管理', b: { path: '/order', name: 'order', params: { tab: $store.state.pageStatus.orderTab } } }, { a: '订单详情' }]"></BreadCrumb>
    <div class="main-content w block-center orderdetail" v-if="!comm.IsNullOrEmpty(uiData.fservicetype)">
      <OrderEvaluate :visible.sync="tagData.evaluate.visible" :order="uiData.id" @successEvent="opClick('evaluateSuccess',$event)" @closeEvent="opClick('evaluateExit')"></OrderEvaluate>
      <el-tabs v-model="tagData.tabActive" @tab-click="opClick('tabsClick')">
        <el-tab-pane label="订单详情" name="one">
          <el-steps :active="progress.a" align-center finish-status="success">
            <el-step v-for="item in steps" :key="item.a" :title="item.a" :description="item.b"></el-step>
          </el-steps>
          <div class="summary margin-v">
            <h4 v-html="progress.m"></h4>
            <div>
              <button v-if="progress.b!=null" @click="opClick(progress.b.b)">{{progress.b.a}}</button>
              <label v-if="progress.mb.length>0" class="color-grey">
                您还可以<a href="javascript:void(0)" v-for="item in progress.mb" :key="item.id" @click="opClick(item.b)">{{item.a}}</a>
              </label>
            </div>
          </div>
          <div class="title">客户信息</div>
          <ul class="list border-bottom-dashed margin-bottom padding-bottom">
            <li>客户姓名：{{uiData.fname}}</li>
            <li>联系电话：{{uiData.fphone}}</li>
            <li>客户地址：{{uiData.fcusaddress}}</li>
          </ul>
          <div class="title">服务需求</div>
          <ul class="list border-bottom-dashed margin-bottom padding-bottom">
            <li>服务类型：{{(uiData.fservicetype||{fname:''}).fname||''}}</li>
            <li>订单金额：¥{{uiData.fexpectamount}}</li>
            <li>期望服务日期：{{uiData.forderdate.substring(0,10)}}</li>
            <li>内部单号：{{uiData.forderbillno}}</li>
            <li>订单备注：{{uiData.fcareful}}</li>
          </ul>
          <div v-if="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1">
            <div class="title">物流信息</div>
            <ul class="list border-bottom-dashed margin-bottom padding-bottom">
              <li>是否到货：{{uiData.fisarrival===true?'已到':'未到'}}</li>
              <li>物流单号：{{uiData.flogistics}} {{uiData.flogisticsno}}</li>
              <li>提货地址：{{uiData.fcollectadd}}</li>
              <li>提货电话：{{uiData.fcollectpho}}</li>
              <li>包装件数：{{uiData.fpieces}}</li>
              <li>代付金额：{{uiData.ffreightamount}}{{uiData.fispay===true?'(包含运费)':''}}</li>
            </ul>
          </div>
          <div v-if="tagData.linkSrvBillData.length>0" class="title">安装信息</div>
          <ul v-if="tagData.linkSrvBillData.length>0" class="list border-bottom-dashed margin-bottom padding-bottom">
            <li>安装日期：{{tagData.linkSrvBillData[0].fsubscribedate.substring(0,16)}}</li>
            <li>安装师傅：{{tagData.linkSrvBillData[0].fmasterid_fname}}</li>
            <li>联系电话：{{tagData.linkSrvBillData[0].fmasterid_fphone}}</li>
          </ul>
          <div class="title">订单列表</div>
          <table cellpadding="0" cellspacing="0" class="table theme-bluegray margin-v lineheight-three">
            <colgroup>
              <col width="240">
              <col width="120">
              <col width="120">
              <col width="160">
              <col width="160">
              <col width="340">
            </colgroup>
            <tr>
              <th>房型/类目/材料 </th>
              <th>数量</th>
              <th>单位</th>
              <th>单价</th>
              <th>金额</th>
              <th>特殊要求</th>
            </tr>
            <tr :key="item.id" v-for="item in uiData.fserviceentry">
              <td>{{item.froomno.fname}}<br />{{item.fseritemid.fname}} {{item.fprofieldentry.fname}}<br />{{item.fmaterial.fname}}</td>
              <td>{{item.fqty}}</td>
              <td>{{item.funitid.fname}}</td>
              <td>{{item.fprice.toFixed(2)}}</td>
              <td>{{item.famount.toFixed(2)}}</td>
              <td>{{item.frequire}}</td>
            </tr>
          </table>
          <ImgRender type="list" :source="uiData.fimage.id"></ImgRender>
        </el-tab-pane>
        <el-tab-pane label="服务过程" name="two" v-if="tagData.tabs.order">
          <div v-for="billItem in tagData.linkSrvBillData" :key="billItem.fbillhead_id">
            <table class="table-border">
              <colgroup>
                <col width="378">
                <col width="378">
                <col width="380">
              </colgroup>
              <tr>
                <td>类　　型：{{billItem.fservicetype_fenumitem}}</td>
                <td>服务单号：{{billItem.fbillno}}</td>
                <td>状　　态：{{billItem.fserstatus_feunmitem}}</td>
              </tr>
              <tr>
                <td>师　　傅：{{billItem.fmasterid_fname}}</td>
                <td>师傅电话：{{billItem.fmasterid_fphone}}</td>
                <td>预约时间：{{billItem.fsubscribedate}}</td>
              </tr>
              <tr v-if="tagData.tabs.done&&parseFloat(billItem.fqualstar_fenumitem)>0">
                <td>客户评分：<el-rate :colors="['#FEE018','#FEE018','#FEE018']" :value="parseFloat(billItem.fqualstar_fenumitem)" disabled></el-rate>
                </td>
                <td colspan="2">客户评价：{{billItem.fevaludesc}}</td>
              </tr>
              <tr v-if="tagData.dealerStar>0">
                <td>您的评分：<el-rate :colors="['#FEE018','#FEE018','#FEE018']" :value="parseFloat(tagData.dealerStar)" disabled></el-rate>
                </td>
                <td colspan="2">您的评价：{{uiData.fevaludesc}}</td> 　
              </tr>
            </table>
            <div v-if="tagData.tabs.done&&!comm.IsNullOrEmpty(billItem.fdoneimage)">
              <div class="title border-bottom-solid margin-v">完工汇报</div>
              <table cellpadding="0" cellspacing="0" class="table theme-gray" v-if="'fres_type_03'!=uiData.fservicetype.id">
                <colgroup>
                  <col width="380">
                  <col width="380">
                  <col width="376">
                </colgroup>
                <tr align="left">
                  <th>服务</th>
                  <th>完工时间</th>
                  <th>完工图片</th>
                </tr>
                <tr align="left">
                  <td>{{billItem.fservicetype_fenumitem}}</td>
                  <td>{{billItem.freportdate}}</td>
                  <td>
                    <ImgRender type="list" class="done" :source="billItem.fdoneimage"></ImgRender>
                  </td>
                </tr>
                <tr align="left" class="lineheight-three">
                  <td colspan="3"><span class="bold">完工说明：</span>{{billItem.fnote}}</td>
                </tr>
              </table>
              <div class="title border-bottom-solid margin-v">
                反馈记录
                <router-link v-if="tagData.tabs.feedbackBtn" :to="{path:'/order/cre-problem',query:{orderId:uiData.id}}">反馈</router-link>
              </div>
              <table cellpadding="0" cellspacing="0" class="table theme-gray lineheight-three">
                <colgroup>
                  <col width="370">
                  <col width="340">
                  <col width="240">
                  <col width="190">
                </colgroup>
                <tr>
                  <th>反馈问题</th>
                  <th>问题描述</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr v-for="item in tagData.feedData" :key="item.fbillhead_id">
                  <td>{{item.fsprotype_fenumitem}}</td>
                  <td>{{item.fprodesript}}</td>
                  <td>{{item.fhandlestatus_fenumitem}}</td>
                  <td>
                    <router-view :to="{path:'/order/det-problem',query:{id:item.fbillhead_id}}">查看</router-view>
                  </td>
                </tr>
              </table>
            </div>
            <div class="title border-bottom-solid margin-v">
              投诉记录
              <router-view v-if="tagData.tabs.complainBtn" :to="{path:'/droit/cre-complain',query:{orderId:uiData.id}}">投诉</router-view>
            </div>
            <table cellpadding="0" cellspacing="0" class="table theme-gray lineheight-three">
              <colgroup>
                <col width="370">
                <col width="340">
                <col width="240">
                <col width="190">
              </colgroup>
              <tr>
                <th>投诉内容</th>
                <th>投诉说明</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in tagData.complainData" :key="item.fbillhead_id">
                <td>{{item.fcomplaintitem_fname}}</td>
                <td>{{item.fcomplain}}</td>
                <td>{{item.fcomplainstatus_fenumitem}}</td>
                <td>
                  <router-view :to="{path:'/droit/det-complain',query:{id:item.fbillhead_id}}">查看</router-view>
                </td>
              </tr>
            </table>
            <div v-if="tagData.tabs.refund">
              <div class="title border-bottom-solid margin-v">
                退款记录
                <router-view v-if="tagData.tabs.refundBtn&&tagData.refundData.length==0" :to="{path:'/droit/cre-refund',query:{orderId:uiData.id}}">查看</router-view>
              </div>
              <table cellpadding="0" cellspacing="0" class="table theme-gray lineheight-three">
                <colgroup>
                  <col width="370">
                  <col width="340">
                  <col width="240">
                  <col width="190">
                </colgroup>
                <tr>
                  <th>退款原因</th>
                  <th>退款说明</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr v-for="item in tagData.refundData" :key="item.fbillhead_id">
                  <td align="center">{{item.fchangereasonenum_fenumitem}}</td>
                  <td align="center">{{item.frefundreason}}</td>
                  <td align="center">{{item.frefundstatus_fenumitem}}</td>
                  <td align="center">
                    <router-view :to="{path:'/droit/det-refund',query:{id:item.fbillhead_id}}">查看</router-view>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import OrderEvaluate from '../../../components/orderevaluate';
import {billView as base} from '../../../lib';
import orderDetailPlugIn from './orderDetailPlugIn';
const billView = {
	extends: base
};
billView.formId = 'ydj_merchantorder';
billView.plugs = [new orderDetailPlugIn({})];
billView.mixins = [
	{
		methods: {
			getData(type, data) {
				let t = this;
				switch (type) {
					case 'operateDate': //状态操作时间
						return t.comm.Odefault(t.tagData.statusNodeInfo.find(o => o.status.toLowerCase() === data), 'opdate');
					case 'feedback': //问题反馈数据
						t.axios.post('/list/ser_servicefeed.json?operationno=querydata', {filterString: t.$util.format("fdealerid='{0}'  AND (fmerbill='{1}')", t.$store.state.userCtx.linkIdentity.id, t.uiData.fbillno)}).then(res => {
							t.tagData.feedData = res.data.operationResult.srvData.data;
						});
						break;
					case 'complain': //投诉数据
						t.axios.post('/list/ser_complaintrecord.json?operationno=querydata', {filterString: t.$util.format("fmerchantid='{0}' and (fmerorderid='{1}')", t.$store.state.userCtx.linkIdentity.id, t.uiData.id)}).then(res => {
							t.tagData.complainData = res.data.operationResult.srvData.data;
						});
						break;
					case 'refund': //退款数据
						t.axios.post('/list/ser_refund.json?operationno=querydata', {filterString: t.$util.format("fdealerid='{0}' and (fmerbill='{1}')", t.$store.state.userCtx.linkIdentity.id, t.uiData.fbillno)}).then(res => {
							let resp = res.data.operationResult.srvData.data;
							if (resp instanceof Array) {
								t.tagData.refundData = resp.filter(o => {
									return !t.comm.IsNullOrEmpty(o.fbillno);
								});
							}
						});
						break;
				}
			},
			opClick(type, data) {
				let t = this;
				switch (type) {
					case 'exitOrder': //取消订单
						t.$confirm('确定取消订单吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.invokeFormOperation({
									formId: t.formCtx.formId,
									opcode: 'sht_cancelbill',
									param: {
										selectedRows: [
											{
												pkValue: (this.$route.query || {}).id
											}
										]
									}
								}).then(res => {
									t.$router.push({path: '/order', query: {type: 'ExOrder'}});
								});
							})
							.catch(() => {});
						break;
					case 'acceptOrder': //验收
						t.$confirm('确定验收吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.opClick('acceptBill');
							})
							.catch(() => {});
						break;
					case 'applyRefund': //申请退款
						t.$router.push({
							path: '/droit/cre-refund',
							query: {
								orderId: t.uiData.id
							}
						});
						break;
					case 'complain': //投诉
						t.$router.push({
							path: '/droit/cre-complain',
							query: {
								orderId: t.uiData.id
							}
						});
						break;
					case 'feedback': //问题反馈
						t.$router.push({
							path: '/order/cre-problem',
							query: {
								orderId: t.uiData.id
							}
						});
						break;
					case 'acceptBill': //验收数据提交
						t.invokeFormOperation({
							formId: t.formCtx.formId,
							opcode: 'sht_acceptbill',
							param: {
								selectedRows: [
									{
										pkValue: t.uiData.id
									}
								],
								simpleData: {examinCode: data}
							}
						}).then(res => {
							if (t.comm.IsNullOrEmpty((res.response.operationResult.srvData || {examinCode: ''}).examinCode)) {
								t.tagData.evaluate.visible = !0;
							} else {
								t.$confirm(res.response.operationResult.srvData.titleStr, '操作提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								})
									.then(() => {
										t.opClick('acceptBill', res.response.operationResult.srvData.examinCode);
									})
									.catch(() => {});
							}
						});
						break;
					case 'assess': //评价窗口显示
						t.tagData.evaluate.visible = !0;
						break;
					case 'evaluateSuccess':
						this.initUiModel({}).then(res => {
							this.afterLoadModelData(this);
							t.tagData.tabActive = 'two';
						});
						break;
					case 'evaluateExit':
						this.initUiModel({}).then(res => {
							this.afterLoadModelData(this);
						});
						break;
					case 'renew': //重新生成未完成的订单
						t.$confirm('确定将未完成的项目重新下单吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.axios.post('/bill/ydj_merchantorder?operationno=releaseorder', {selectedRows: [{pkValue: t.uiData.id}]}).then(res => {
									t.$router.push({path: '/order/pre-order', query: {id: res.data.operationResult.srvData}});
								});
							})
							.catch(() => {});
						break;
				}
			}
		},
		computed: {
			steps() {
				let t = this;
				return (this.uiData.fserstatus || {id: ''}).id.trim() === 'sht_serstatus01'
					? [
							{
								a: '提交订单信息',
								b: t.getData('operateDate', 'sht_submitbill')
							},
							{
								a: '已取消',
								b: t.getData('operateDate', 'sht_cancelbill')
							}
					  ]
					: [
							{
								a: '提交订单信息',
								b: t.getData('operateDate', 'sht_submitbill')
							},
							{
								a: '派单',
								b: t.getData('operateDate', 'sht_dispatchbill')
							},
							{
								a: '上门服务',
								b: t.getData('operateDate', 'sht_serviceing')
							},
							{
								a: '完工',
								b: t.getData('operateDate', 'sht_finishbill')
							},
							{
								a: '验收',
								b: t.getData('operateDate', 'sht_acceptbill')
							}
					  ];
			},
			progress() {
				switch (this.comm.Odefault(this.uiData.fserstatus, 'id')) {
					case 'sht_serstatus01':
						return {a: 2, m: '订单已取消', mb: this.uiData.fisrepublish == 1 ? [] : [{a: '重新发布', b: 'renew'}]};
					case 'sht_serstatus03':
					case 'sht_serstatus04':
					case 'sht_serstatus05':
						return {
							a: 1,
							m: '订单已提交，请耐心等待平台派单',
							mb: [{a: '取消订单', b: 'exitOrder'}]
						};
					case 'sht_serstatus06':
						return {
							a: 3,
							m: this.uiData.fishang == 1 ? '该订单已挂起，原因：' + this.uiData.fhang : '师傅正在服务中。请耐心等待...',
							mb: this.tagData.refundData.length == 0 ? [{a: '投诉', b: 'complain'}, {a: '申请退款', b: 'applyRefund'}] : [{a: '投诉', b: 'complain'}]
						};
					case 'sht_serstatus07':
						return {
							a: 4,
							m: '师傅已提交完工申请，您可以验收了',
							b: {a: '验收', b: 'acceptOrder'},
							mb: this.tagData.refundData.length == 0 ? [{a: '反馈', b: 'feedback'}, {a: '投诉', b: 'complain'}, {a: '申请退款', b: 'applyRefund'}] : [{a: '反馈', b: 'feedback'}, {a: '投诉', b: 'complain'}]
						};
					case 'sht_serstatus08':
						return {
							a: 5,
							b: this.tagData.dealerStar == 0 ? {a: '评价', b: 'assess'} : {a: '评价', b: 'assess'},
							m: '验收完成',
							mb: this.uiData.fisrepublish == 1 || this.comm.IsNullOrEmpty(this.tagData.refundData) ? [] : [{a: '重新发布未完成项目', b: 'renew'}]
						};
					case 'sht_serstatus12':
						return {
							a: 2,
							m: '等待预约',
							mb: this.tagData.refundData.length == 0 ? [{a: '投诉', b: 'complain'}, {a: '申请退款', b: 'applyRefund'}] : [{a: '投诉', b: 'complain'}]
						};
					case 'sht_serstatus13':
						return {
							a: 3,
							m: '师傅已预约，等待师傅上门进行服务',
							mb: this.tagData.refundData.length == 0 ? [{a: '投诉', b: 'complain'}, {a: '申请退款', b: 'applyRefund'}] : [{a: '投诉', b: 'complain'}]
						};
					default:
						return {a: -1, m: '', mb: []};
				}
			},
			starNum() {
				return parseInt(this.comm.Odefault(this.uiData.fqualstar, 'id', 'gradestar_00').substring(11));
			}
		},
		watch: {
			starNum(v) {
				this.tagData.dealerStar = v;
			}
		},
		components: {OrderEvaluate}
	}
];
export default billView;
</script>
<style lang="scss">
.orderdetail {
	.el-tabs__header {
		margin: 0 0 25px;
	}
	.table-border {
		td {
			padding: 14px 20px;
		}
	}
	.done {
		margin: 10px;
		display: inline-block;
		vertical-align: middle;
	}
}
</style>