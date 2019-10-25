<template>
  <div>
    <BreadCrumb :data="[{a: '退款管理', b: {path: '/droit'}}, {a: '订单详情', b: {path: '/order/pre-orders', query: {id: $route.query.orderId}}}, {a: '退款申请'}]"></BreadCrumb>
    <div class="main-content w block-center">
      <div class="summary">
        <div>{{comm.IsNullOrEmpty(refundList)?'该订单已无退款项目或有项目正在退款或补价中':'为了保障您的退款成功，请与师傅协商同意再申请此操作，否则可能因为师傅拒绝而导致退款失败，当您无法与师傅达成一致时，可申请由平台客服介入处理。'}}</div>
      </div>
      <div v-if="!comm.IsNullOrEmpty(refundList)">
        <div class="title border-bottom-solid margin-v">退款项目</div>
        <table cellpadding="0" cellspacing="0" class="table theme-bluegray">
          <colgroup>
            <col width="80">
            <col width="120">
            <col width="170">
            <col width="150">
            <col width="150">
            <col width="150">
            <col width="400">
          </colgroup>
          <tr>
            <th class="text-left padding-left">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="opChange('checkAll')">全选</el-checkbox>
            </th>
            <th>商品图片</th>
            <th>服务类目</th>
            <th>数量</th>
            <th>单价</th>
            <th>金额</th>
            <th>退款金额</th>
          </tr>
          <tr :key="item.fentryid" v-for="item in refundList">
            <td class="text-left padding-left">
              <el-checkbox :key="item.fentryid" @change="opChange('check',item.fentryid)" v-model="item.check"></el-checkbox>
            </td>
            <td>
              <ImgRender class="margin-v" type="marker" :source="item.fimages"></ImgRender>
            </td>
            <td>{{item.fseritemidName}}</td>
            <td>{{item.fqty}}</td>
            <td>{{item.fprice.toFixed(2)}}</td>
            <td>{{item.famount.toFixed(2)}}</td>
            <td>
              <el-input-number v-model="item.frefundmoney" :min="0" :max="item.famount"></el-input-number>
              <em class="required">(最多退{{item.famount}}元)</em>
            </td>
          </tr>
        </table>
        <div class="title border-bottom-solid margin-v">申请内容</div>
        <el-form label-width="120px" label-position="left" :model="uiData" ref="uiData" :rules="rules">
          <el-form-item label="需退款总金额：">{{totalPrice}}元
          </el-form-item>
          <el-form-item label="退款原因：" is-required v-if="!comm.IsNullOrEmpty(reasonlist)" prop="fchangereasonenum">
            <el-select size="small" v-model="uiData.fchangereasonenum" placeholder="请选择退款原因">
              <el-option v-for="item in reasonlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="退款说明：" is-required prop="frefundreason">
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="uiData.frefundreason"></el-input>
          </el-form-item>
          <el-form-item label="凭证：">
            <Upload :limit="3" v-model="uiData.fimage"></Upload>
          </el-form-item>
          <el-form-item>
            <el-button class="botton-orange" size="small" @click="opClick('save')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
	data() {
		return {
			reasonlist: [],
			refundList: [],
			isIndeterminate: !1,
			checkAll: !1,
			uiData: {fchangereasonenum: '', frefundreason: '', fimage: '', fcontinue: '0'},
			rules: {
				fchangereasonenum: [{required: true, message: '请选择退款原因', trigger: 'change'}],
				frefundreason: [{required: true, message: '请输入退款说明', trigger: 'blur'}]
			}
		};
	},
	created() {
		let t = this;
		t.axios.post('/bill/ydj_merchantorder?operationno=getCanRefundServiceentry', {selectedRows: [{pkValue: t.$route.query.orderId}]}).then(res => {
			let entry = res.data.operationResult.srvData.fserviceentry;
			t.refundList = entry.map(o => {
				o.check = !1;
				o.frefundmoney = 0;
				return o;
			});
		});
		t.axios.post('/bill/ser_refund?operationno=querycombo&fieldkey=fchangereasonenum', {}).then(res => {
			t.reasonlist = res.data.operationResult.srvData.data;
		});
	},
	methods: {
		opChange(type) {
			let t = this;
			switch (type) {
				case 'checkAll':
					let entry = t.refundList;
					for (let i = 0; i < entry.length; i++) {
						entry[i].check = t.checkAll;
					}
					break;
				case 'check':
					let item = t.refundList.find(o => {
						return o.check;
					});
					if (item != null) {
						t.isIndeterminate = !0;
					}
					item = t.refundList.find(o => {
						return !o.check;
					});
					if (item != null) {
						t.checkAll = !1;
					} else {
						t.checkAll = !0;
						t.isIndeterminate = !1;
					}
					break;
			}
		},
		opClick(type) {
			let t = this;
			switch (type) {
				case 'save':
					let itemInfo = [];
					_.forEach(t.refundList, o => {
						if (o.check) {
							itemInfo.push({
								fseritemid: o.fentryid,
								qty: o.fqty,
								frefundmoney: o.frefundmoney
							});
						}
					});
					if (itemInfo.length == 0) {
						t.$message({
							message: '请选择退款项目',
							type: 'warning'
						});
						return false;
					}
					if (t.totalPrice < 0.01) {
						t.$message({
							message: '退款金额必须大于1分钱',
							type: 'warning'
						});
						return false;
					}
					t.$refs['uiData'].validate(valid => {
						if (!valid) {
							t.$message({
								message: '请完善当前订单信息',
								type: 'warning'
							});
							return false;
						}
						if (t.uiData.fcontinue !== '1') {
							t.uiData.fmerchantid = t.$store.state.userCtx.linkIdentity.id;
							t.uiData.fmerorderid = t.$route.query.orderId;
							t.uiData.fimage = t.uiData.fimage.id;
							t.uiData.itemInfo = JSON.stringify(itemInfo);
						}
						t.axios
							.post('/bill/ser_refund?operationno=refundmoney', {
								simpleData: t.uiData
							})
							.then(res => {
								if (res.data.operationResult.srvData.fcontinue === '1') {
									t.$confirm(res.data.operationResult.srvData.titleStr, '温馨提示', {
										confirmButtonText: '确定',
										cancelButtonText: '取消',
										type: 'warning'
									}).then(() => {
										t.uiData.fcontinue = '1';
										t.opClick('save');
									});
								} else {
									t.$router.push({
										path: '/droit/det-refund',
										query: {id: res.data.operationResult.srvData.fid}
									});
								}
							});
					});
					break;
			}
		}
	},
	computed: {
		totalPrice() {
			return _.sum(
				_.map(
					_.filter(this.refundList, o => {
						return o.check === !0;
					}),
					'frefundmoney'
				)
			);
		}
	}
};
</script>


