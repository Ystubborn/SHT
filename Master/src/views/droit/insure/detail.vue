<template>
  <div>
    <BreadCrumb :data="[{a: '我要报案', b: {path: '/droit/insure'}}, {a: '报案明细'}]"></BreadCrumb>
    <div class="main-content w block-center safeinsure-detail" v-if="!comm.IsNullOrEmpty(uiData)">
      <div class="title border-bottom-solid margin-bottom">申报详情</div>
      <table class="table-border">
        <colgroup>
          <col width="280">
          <col width="90">
          <col width="140">
          <col width="260">
          <col width="65">
          <col width="327">
        </colgroup>
        <tr>
          <td colspan="2">承保订单号：{{uiData.fsafeorder}}</td>
          <td colspan="2">关联订单号：{{uiData.fsourcenumber}}</td>
          <td colspan="2">服务类型：{{uiData.fservicetype}}</td>
        </tr>
        <tr>
          <td>您的代码：{{uiData.fcode}}</td>
          <td colspan="2">姓名：{{uiData.fname}}</td>
          <td colspan="2">联系电话：{{uiData.fphone}}</td>
          <td>身份证号：{{uiData.fidcard}}</td>
        </tr>
        <tr>
          <td colspan="6">身份证信息：
            <div class="idcard">
              <ImgRender type="list" :source="uiData.fidcar1.id"></ImgRender>身份证正面
            </div>
            <div class="idcard">
              <ImgRender type="list" :source="uiData.fidcar2.id"></ImgRender>身份证反面
            </div>
          </td>
        </tr>
      </table>
      <div class="title border-bottom-solid margin-v">申报详情</div>
      <table cellpadding="0" cellspacing="0" class="table theme-gray margin-bottom">
        <colgroup>
          <col width="285">
          <col width="285">
          <col width="285">
          <col width="285">
        </colgroup>
        <tr align="left">
          <th>事故现场照片</th>
          <th>受损财产/部位照片</th>
          <th>维修发票</th>
          <th>货物价值证明</th>
        </tr>
        <tr align="left">
          <td>
            <ImgRender type="list" class="done" :source="uiData.faccidentimage.id"></ImgRender>
          </td>
          <td>
            <ImgRender type="list" class="done" :source="uiData.fendimage.id"></ImgRender>
          </td>
          <td>
            <ImgRender type="list" class="done" :source="uiData.frepairinvoice.id"></ImgRender>
          </td>
          <td>
            <ImgRender type="list" class="done" :source="uiData.fcostprove.id"></ImgRender>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import {billView as base} from '../../../lib';
import initbillPlugIn from './initbillPlugIn';
const billView = {
	extends: base
};
billView.formId = 'ydj_safesettle';
billView.plugs = [new initbillPlugIn({})];
billView.mixins = [{}];
export default billView;
</script>
<style lang="scss">
.safeinsure-detail {
	.table-border td {
		padding: 14px 20px;
	}
	.idcard {
		width: 242px;
		text-align: center;
		display: inline-block;
		line-height: 20px;
		vertical-align: top;
		margin-right: 30px;
		.img-array li {
			width: 242px;
			height: 153px;
			overflow: hidden;
			> img {
				width: 242px;
				height: 153px;
			}
		}
	}
	.table td {
		padding: 14px 0;
	}
}
</style>
