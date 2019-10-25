<template>
  <div>
    <BreadCrumb :data=" [{ a: '附加费', b: { path: '/order/additional', name: 'additional', params: { tab: $store.state.pageStatus.orderTab } } }, { a: '附加费详情' }]"></BreadCrumb>
    <div class="main-content w block-center orderdetail" v-if="!comm.IsNullOrEmpty(uiData.id)">
      <el-dialog title="驳回原因" v-if="!comm.IsNullOrEmpty(tagData.reject)" :visible.sync="tagData.reject.visible">
        <p class="color-red margin-bottom">请填写驳回原因，提交后将通知到对应的师傅</p>
        <el-input type="textarea" v-model="tagData.reject.desc" placeholder="驳回原因" :rows="4" :maxlength="500"></el-input>
        <span slot="footer">
          <el-button @click="opClick('rejectExit')">取 消</el-button>
          <el-button type="primary" @click="opClick('rejectConfirm')">确定</el-button>
        </span>
      </el-dialog>
      <div class="summary margin-v" v-if="!comm.IsNullOrEmpty(uiData.fadditionalfeestatus)">
        <h4 v-html="progress.t"></h4>
        <p v-html="progress.m"></p>
        <div>
          <button v-if="progress.b!=null" @click="opClick(progress.b.b)">{{progress.b.a}}</button>
          <label v-if="progress.mb.length>0" class="color-grey">
            您还可以<a href="javascript:void(0)" v-for="item in progress.mb" :key="item.b" @click="opClick(item.b)">{{item.a}}</a>
          </label>
        </div>
      </div>
      <div class="title border-bottom-solid margin-bottom">附加费信息</div>
      <table cellpadding="0" cellspacing="0" class="table theme-bluegray margin-v lineheight-three">
        <colgroup>
          <col width="285">
          <col width="285">
          <col width="285">
          <col width="285">
        </colgroup>
        <tr>
          <th>订单编号</th>
          <th>杂费类型</th>
          <th>杂费说明</th>
          <th>金额</th>
        </tr>
        <tr>
          <td>{{uiData.fbillno}}</td>
          <td>{{uiData.ffeeitemnames}}</td>
          <td>{{uiData.fdescription}}</td>
          <td>附加金额：<span class="color-red">{{uiData.famount}}</span></td>
        </tr>
        <tr>
          <td colspan="4" class="text-left">
            <ImgRender type="list" class="margin-top margin-level" :source="uiData.fimage.id"></ImgRender>
          </td>
        </tr>
      </table>

      <ul class="list border-bottom-dashed margin-bottom padding-bottom">
        <li>客户：{{uiData.fcustname}} {{uiData.fphone}} {{uiData.faddress}}</li>
        <li>原订单号：{{uiData.fmerbill}}</li>
        <li>原订单金额：{{uiData.fcustname}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import {billView as base} from '../../../lib';
import detailPlugIn from './detailPlugIn';
const billView = {
	extends: base
};
billView.formId = 'ydj_additionalfee';
billView.plugs = [new detailPlugIn({})];
billView.mixins = [
	{
		methods: {
			opClick(type, data) {
				let t = this;
				switch (type) {
					case 'payOrder': //支付订单
						t.$confirm('本次支付将您的账户余额中扣除费用，您确定支付？', '操作提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
							.then(() => {
								t.axios.post('/bill/ydj_additionalfee?operationno=agreeadditionalfee', {selectedRows: [{pkValue: t.uiData.id}]}).then(res => {
									let srvData = res.data.operationResult.srvData;
									if (srvData.fpay === 1) {
										t.$confirm('由于您的账户余额不足，你还需要支付' + srvData.famount + '元，确定支付？', '余额不足', {
											confirmButtonText: '去支付',
											cancelButtonText: '取消',
											type: 'warning'
										}).then(() => {
											t.comm.OrderPay({
												id: t.uiData.id,
												price: srvData.famount,
												formId: 'ydj_additionalfee',
												type: 'additionalfee',
												other: {
													service: {No: t.uiData.fbillno, sourceNo: t.uiData.fmerbill},
													consumer: {name: t.uiData.fcustname, phone: t.uiData.fphone}
												}
											});
										});
									} else {
										this.initUiModel({});
									}
								});
							})
							.catch(() => {});
						break;
					case 'reject': //驳回
						t.tagData.reject = {visible: !0, desc: ''};
						break;
					case 'rejectExit': //驳回窗口取消
						t.tagData.reject = {visible: !1, desc: ''};
						break;
					case 'rejectConfirm': //驳回数据提交
						if (t.comm.IsNullOrEmpty(t.tagData.reject.desc)) {
							t.$message({
								message: '请填写驳回原因',
								type: 'warning'
							});
							return;
						}
						t.axios.post('/bill/ydj_additionalfee?operationno=unauditbycustomer', {loadingOption: {target: '.element-loading'}, selectedRows: [{pkValue: t.uiData.id}], simpleData: {opDesc: t.tagData.reject.desc}}).then(res => {
							t.initUiModel({});
						});
						break;
				}
			}
		},
		computed: {
			progress() {
				let t = this;
				let status = t.uiData.fadditionalfeestatus.id;
				switch (status) {
					case 'premium_status01':
						return {t: '您当前需要支付附加金额：<span class="color-red">' + t.uiData.famount + '元</span>', m: '请您尽快确认此单的附加费用，如未确认支付此单附加费用，师傅将有可能停止服务。如您驳回申请，此次补价失败。', b: {a: '确认支付', b: 'payOrder'}, mb: [{a: '驳回', b: 'reject'}]};
					case 'premium_status02':
						return {t: '附加费支付成功', m: '费用金额:<span class="color-blue">￥' + t.uiData.famount + '元</span><br>付款日期:2017-10-06  9:00:00', mb: []};
					case 'premium_status05':
						return {t: '您驳回了师傅的附加费申请', m: '驳回原因：' + t.uiData.funauditreason, mb: []};
					default:
						return {t: ''};
				}
			}
		}
	}
];
export default billView;
</script>