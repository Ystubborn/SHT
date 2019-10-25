<template>
  <div>
    <BreadCrumb :data="tagData.crumb"></BreadCrumb>
    <div class="main-content w block-center complain">
      <div class="title border-bottom-solid">投诉信息</div>
      <p class="padding-v margin-v">投诉成立后，如投诉内容属于【左右手无忧赔】的相关条款，平台将直接给予用户一定赔付，赔付金将直接进入“赔付金”帐户>>><span class="color-orange pointer">了解【左右手无忧赔】</span></p>
      <div class="progress">
        <el-steps :active="tagData.tabactive" align-center finish-status="success">
          <el-step title="发起投诉"></el-step>
          <el-step title="平台处理"></el-step>
          <el-step title="处理完成"></el-step>
        </el-steps>
      </div>
      <p class="padding-v text-center slogan margin-bottom">
        投诉需要提供相关证据用于平台判定责任，请勿恶意投诉！平台将在5个工作日内进行受理并进行回复调查！订单关闭后15天将关闭投诉入口！
      </p>
      <div class="summary margin-bottom">
        <h4 v-html="progress.t"></h4>
        <p v-html="progress.m"></p>
        <Timer v-if="progress.timer" :endTime="uiData.fcreatedate" day="-5" v-model="tagData.timer"></Timer>
        <div>
          <el-button v-if="progress.b!=null" type="warning" size="mini" @click="opClick(progress.b.a)">{{progress.b.b}}</el-button>
          <label v-if="!comm.IsNullOrEmpty(progress.mb)">
            您还可以<a href="javascript:" v-for="item in progress.mb" :key="item.a" @click="opClick(item.a)">{{item.b}}</a>
          </label>
        </div>
      </div>
      <table cellpadding="0" cellspacing="0" class="table theme-gray margin-v" v-if="!comm.IsNullOrEmpty(tagData.orderBase)">
        <colgroup>
          <col width="200" />
          <col width="200" />
          <col width="320" />
          <col width="420" />
        </colgroup>
        <tr>
          <th>投诉服务商</th>
          <th>投诉类型</th>
          <th>投诉说明</th>
          <th>凭证</th>
        </tr>
        <tr>
          <td>{{tagData.orderBase.fmaster_name}}</td>
          <td>{{(uiData.fcomplaintitem||{fname:''}).fname}}</td>
          <td>{{uiData.fcomplain}}</td>
          <td>
            <ImgRender type="list" :source="uiData.fimage.id"></ImgRender>
          </td>
        </tr>
      </table>
      <div class="title border-bottom-solid">订单信息</div>
      <ul class="list margin-v padding-bottom" v-if="!comm.IsNullOrEmpty(tagData.orderBase)">
        <li>订单号：{{tagData.orderBase.mobillno}}</li>
        <li>服务类型：{{tagData.orderBase.fservicetype}}</li>
        <li>订单金额：¥{{tagData.orderBase.fexpectamount}}</li>
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
billView.formId = 'ser_complaintrecord';
billView.plugs = [new detailPlugIn({})];
billView.mixins = [
	{
		methods: {
			getData(type, data) {
				let t = this;
				switch (type) {
					case 'orderbase':
						t.axios.post('/bill/ydj_merchantorder?operationno=GetMOrderAndOrderBaceInfo', {simpleData: {fmerchantid: t.$store.state.userCtx.linkIdentity.id, id: data}}).then(res => {
							t.tagData.orderBase = res.data.operationResult.srvData;
						});
						break;
				}
			},
			opClick(type) {
				let t = this;
				switch (type) {
					case 'quest':
						t.axios.post('/bill/ser_complaintrecord?operationno=withdraw', {selectedRows: [{pkValue: t.uiData.id}]}).then(res => {
							window.location.reload();
						});
						break;
					case 'lookmoney':
						t.$router.push({path: '/settle'});
						break;
				}
			}
		},
		computed: {
			progress() {
				let t = this;
				switch (t.comm.Odefault(t.uiData.fcomplainstatus, 'id')) {
					case 'complain_status01': //投诉中
						return {
							t: '申请已提交，请等待平台处理',
							m: '提交日期:' + t.uiData.fcreatedate,
							mb: [{a: 'quest', b: '取消投诉'}]
						};
					case 'complain_status02': //已生效
						t.tagData.tabactive = 2;
						return {
							t: '平台已受理，判定责任属于师傅，赔付您' + t.uiData.fitemmoney + '元',
							m: '提交日期:' + t.uiData.fcreatedate,
							b: {a: 'lookmoney', b: '查看钱款'}
						};

					case 'complain_status03': //投诉失败
						t.tagData.tabactive = 2;
						return {
							t: '平台判定您的对师傅的投诉无效',
							m: '提交日期:' + t.uiData.fcreatedate
						};
					case 'complain_status04': //已撤诉
						t.tagData.tabactive = 2;
						return {
							t: '您已经取消了该投诉',
							m: '提交日期:' + t.uiData.fcreatedate
						};
					default:
						return {t: '', m: ''};
				}
			}
		}
	}
];
export default billView;
</script>
<style lang="scss">
.complain {
	.slogan {
		background-color: #fffefe;
		border: 1px solid #ffeaeb;
	}
	.table {
		tr td {
			padding: 10px 0;
		}
	}
}
</style>