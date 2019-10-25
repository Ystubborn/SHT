<template>
  <div>
    <BreadCrumb :data="[{a: '我的钱包', b: {path: '/settle'}}, {a: '提现明细'}]"></BreadCrumb>
    <div class="w block-center withdraw main-content">
      <el-steps :active="active" align-center finish-status="success">
        <el-step v-for="item in steps" :key="item.a" :title="item.a"></el-step>
      </el-steps>
      <div class="summary margin-v">
        <h4>申请已提交，请等待平台受理</h4>
        <p>提交日期:2017-10-06 9:00:00</p>
        <div>
          <label class="color-grey">
            您还可以<a href="javascript:void(0)">取消提现</a>
          </label>
        </div>
      </div>
      <div class="title border-bottom-solid margin-bottom">提现明细</div>
      <ul class="list">
        <li>交易单号: 20170836584</li>
        <li>交易类型: 提现</li>
        <li>提现金额: 500元</li>
        <li>提现方式: 支付宝</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
	data() {
		return {
			steps: [{a: '提交申请'}, {a: '平台审核'}, {a: '提现成功'}],
			active: 0
		};
	}
};
</script>