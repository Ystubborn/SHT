<template>
  <div>
    <BreadCrumb :data="[{ a: '投诉管理', b: { path: '/droit/complain' } }, { a: '订单详情', b: { path: '/order/pre-orders', query: { id:$route.query.orderId } } }, { a: '订单投诉' }]"></BreadCrumb>
    <div class="main-content w block-center complain">
      <div class="title border-bottom-solid">投诉信息</div>
      <p class="padding-v margin-v">投诉成立后，如投诉内容属于【左右手无忧赔】的相关条款，平台将直接给予用户一定赔付，赔付金将直接进入“赔付金”帐户>>><span class="color-orange pointer">了解【左右手无忧赔】</span></p>
      <div class="progress">
        <el-steps :active="0" align-center finish-status="success">
          <el-step title="发起投诉"></el-step>
          <el-step title="平台处理"></el-step>
          <el-step title="处理完成"></el-step>
        </el-steps>
      </div>
      <p class="padding-v text-center slogan margin-bottom">
        投诉需要提供相关证据用于平台判定责任，请勿恶意投诉！平台将在5个工作日内进行受理并进行回复调查！订单关闭后15天将关闭投诉入口！
      </p>
      <el-form label-width="120px" label-position="right" :model="uiData" ref="uiData" :rules="rules" v-if="!comm.IsNullOrEmpty(uiData.fcomplaintitem)">
        <el-form-item label="投诉服务商">
          <el-input type="text" v-model="tagData.orderBase.fmaster_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="投诉内容" is-required prop="fcomplaintitem.id">
          <el-select size="small" v-model="uiData.fcomplaintitem.id" placeholder="请选择投诉原因" @change="opChange('complaintitem',$event)">
            <el-option v-for="item in tagData.reasonlist" :key="item.fid" :label="item.ftitle" :value="item.fid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="uiData.fcomplaintitem.id!==''">
          <div class="desc" v-html="tagData.reasonmome"></div>
        </el-form-item>
        <el-form-item label="用户投诉赔付金" v-if="uiData.fcomplaintitem.id!==''">
          <span class="color-blue">¥{{tagData.reasonprice}}</span>
        </el-form-item>
        <el-form-item label="投诉说明" is-required prop="fcomplain">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="uiData.fcomplain"></el-input>
        </el-form-item>
        <el-form-item label="凭证" prop="fimage.id" is-required>
          <Upload :limit="5" v-model="uiData.fimage"></Upload>上传最多5张图片，JPG/GIF/BMP单张不超过2M
        </el-form-item>
        <el-form-item>
          <el-button class="botton-orange" size="small" @click="opClick('save')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template> 
<script>
import {billView as base} from '../../../lib';
import createPlugIn from './createPlugIn';
const billView = {
	extends: base
};
billView.formId = 'ser_complaintrecord';
billView.plugs = [new createPlugIn({})];
billView.mixins = [
	{
		methods: {
			getData(type) {
				let t = this;
				switch (type) {
					case 'complaintitem':
						t.axios.post('/bill/ser_complaintitem?operationno=getItemList', {loadingOption: {target: '.element-loading'}}).then(res => {
							t.tagData.reasonlist = res.data.operationResult.srvData.datas;
						});
						break;
					case 'orderbase':
						t.axios.post('/bill/ydj_merchantorder?operationno=GetMOrderAndOrderBaceInfo', {simpleData: {fmerchantid: t.$store.state.userCtx.linkIdentity.id, id: t.$route.query.orderId}}).then(res => {
							t.tagData.orderBase = res.data.operationResult.srvData;
						});
				}
			},
			opChange(type, data) {
				let t = this;
				switch (type) {
					case 'complaintitem':
						let a = _.find(t.tagData.reasonlist, o => {
							return o.fid === data;
						});
						t.tagData.reasonmome = a.fcontent
							.replace(/<\/p>/g, '{br}')
							.replace(/<[^>]+>/g, '')
							.replace(/&nbsp;/g, ' ')
							.replace(/{br}/g, '<br/>')
							.replace('<br/><br/>', '<br/>');
						t.tagData.reasonprice = a.fitemmoney;
						break;
				}
			},
			opClick(type) {
				let t = this;
				switch (type) {
					case 'save':
						t.$refs['uiData'].validate(valid => {
							if (!valid) {
								t.$message({
									message: '请完善当前订单信息',
									type: 'warning'
								});
								return false;
							}
							t.menuItemClick({opcode: 'save', event: 'uiData'});
						});
						break;
				}
			}
		}
	}
];
export default billView;
</script>
<style lang="scss">
.complain {
	.el-input {
		width: 215px;
		&.is-disabled .el-input__inner {
			color: #000;
		}
		.el-input__inner {
			height: 32px;
			line-height: 32px;
		}
	}
	.slogan{background-color: #fffefe;border:1px solid #ffeaeb}
	.desc {
		background: rgba(250, 250, 250, 1);
		border: 1px solid rgba(232, 232, 232, 1);
		padding: 15px 10px;
		font-size: 12px;
		line-height: 18px;
	}
}
</style>