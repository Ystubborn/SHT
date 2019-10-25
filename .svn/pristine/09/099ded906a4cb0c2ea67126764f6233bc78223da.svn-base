<template>
  <div>
    <BreadCrumb :data="[{ a: '问题单', b: { path: '/order/problem', name: 'problem', params: { tab: $store.state.pageStatus.orderTab } } }, { a: '订单详情', b: { path: '/order/pre-orders', query: { id: $route.query.orderId } } }, { a: '订单反馈' }]"></BreadCrumb>
    <div class="main-content w block-center">
      <div class="title border-bottom-solid">订单信息</div>
      <ul class="list margin-v padding-bottom" v-if="!comm.IsNullOrEmpty(tagData.orderBase)">
        <li>订单单号：{{tagData.orderBase.mobillno}}</li>
        <li>服务单号：{{tagData.orderBase.serbillno}}</li>
        <li>服务类型：{{tagData.orderBase.fservicetype}}</li>
        <li>客户姓名：{{tagData.orderBase.fcusname}}</li>
        <li>联系电话：{{tagData.orderBase.fcusphone}}</li>
        <li>客户地址：{{tagData.orderBase.fcusaddress}}</li>
      </ul>
      <el-form label-width="120px" label-position="left" :model="uiData" ref="uiData" :rules="rules" v-if="!comm.IsNullOrEmpty(uiData.fsprotype)">
        <el-form-item label="问题类型" is-required prop="fsprotype.id">
          <el-select size="small" v-model="uiData.fsprotype.id" placeholder="请选择问题类型">
            <el-option v-for="item in [{a: '01',b: '服务问题'}, {a:'02',b: '产品问题'}]" :key="item.a" :label="item.b" :value="'service_type'+item.a"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" is-required prop="fprodesript">
          <el-input type="textarea" :rows="6" placeholder="请输入问题描述" v-model="uiData.fprodesript"></el-input>
        </el-form-item>
        <el-form-item label="问题图片" is-required prop="fprograph.id">
          <Upload :limit="3" v-model="uiData.fprograph"></Upload>
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
billView.formId = 'ser_servicefeed';
billView.plugs = [new createPlugIn({})];
billView.mixins = [
	{
		methods: {
			getData(type) {
				let t = this;
				switch (type) {
					case 'merchantorder':
						t.axios.post('/bill/ydj_merchantorder?operationno=GetMOrderAndOrderBaceInfo', {simpleData: {fmerchantid: t.$store.state.userCtx.linkIdentity.id, id: t.$route.query.orderId}}).then(res => {
							t.tagData.orderBase = res.data.operationResult.srvData;
							t.uiData['fsourceser'] = t.tagData.orderBase.serbillno;
							t.uiData['fmerbill'] = t.tagData.orderBase.mobillno;
						});
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
							t.menuItemClick({opcode: 'save'});
						});
						break;
				}
			}
		}
	}
];
export default billView;
</script>
