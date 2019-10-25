<template>
  <div>
    <BreadCrumb :data="[{a: '我的钱包', b: {path: '/settle'}}, {a: '账户绑定'}]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right account">
        <div class="title border-bottom-solid margin-v">提现账户管理</div>
        <ul class="account-list">
          <li>
            <label><i class="icon icon-bank"></i>银行卡：</label>
            <div>
              <p v-for=" item in list" :key="item.fentryid"><input type="text" readonly :value="item.fbankcardid.replace(/(\d{4})(?=[\d,\*])/g, '$1 ')" />
                <el-button type="info" @click="Remove(item.fentryid)">解绑</el-button>
              </p>
            </div>
            <el-button type="primary" @click="bind={title:'绑定银行卡',cardtype:'cardtype_01',visible:!0}">添加银行卡</el-button>
          </li>
          <li>
            <label><i class="icon icon-alipay"></i>支付宝：</label>
            <p v-if="!comm.IsNullOrEmpty(alipay)"><input type="text" readonly :value="alipay.fbankcardid" />
              <el-button type="info" @click="Remove(alipay.fentryid)">解绑</el-button>
            </p>
            <el-button v-if="comm.IsNullOrEmpty(alipay)" type="primary" @click="bind={title:'绑定支付宝',cardtype:'cardtype_02',visible:!0}">绑定支付宝</el-button>
          </li>
          <li>
            <label><i class="icon icon-wechat"></i>微信：</label>
            <p v-if="!comm.IsNullOrEmpty(wechat)"><input type="text" readonly :value="wechat.fbankcardid" />
              <el-button type="info" @click="Remove(wechat.fentryid)">解绑</el-button>
            </p>
            <el-button v-if="comm.IsNullOrEmpty(wechat)" type="primary" @click="bind={title:'绑定微信',cardtype:'cardtype_03',visible:!0}">绑定微信</el-button>
          </li>
        </ul>
        <BindCard :visible.sync="bind.visible" :title="bind.title" :cardtype="bind.cardtype" @success-event="Init"></BindCard>
      </div>
    </div>
  </div>
</template>
<script>
import data from '../../../lib/domain/dynamicView';
export default {
	data() {
		return {
			list: [],
			alipay: {},
			wechat: {},
			bind: {
				visible: !1,
				title: '',
				cardtype: ''
			}
		};
	},
	created() {
		this.Init();
	},
	methods: {
		Init() {
			let t = this;
			t.axios
				.post('/bill/ydj_customer?operationno=getbindbankcards', {
					selectedRows: [{pkValue: t.$store.state.userCtx.linkIdentity.id}]
				})
				.then(res => {
					let data = res.data.operationResult.srvData;
					t.list = data.filter(o => {
						return o.fcardtype == 'cardtype_01';
					});
					t.alipay = data.find(o => {
						return o.fcardtype == 'cardtype_02';
					});
					t.wechat = data.find(o => {
						return o.fcardtype == 'cardtype_03';
					});
				});
		},
		Remove(data) {
			let t = this;
			t.$confirm('确定解除绑定吗？', '操作提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					t.axios
						.post('/bill/ydj_customer?operationno=unbindbankcard', {
							selectedRows: [{pkValue: t.$store.state.userCtx.linkIdentity.id}],
							simpleData: {fentryid: data}
						})
						.then(res => {
							t.Init();
						});
				})
				.catch(() => {});
		}
	}
};
</script>
<style lang="scss">
.account {
	.account-list {
		li {
			min-height: 36px;
			margin-bottom: 20px;
			font-size: 0;
			& > * {
				display: inline-block;
				vertical-align: top;
			}
			& > label {
				display: inline-block;
				height: 36px;
				line-height: 36px;
				width: 110px;
				font-size: 14px;
				.icon {
					vertical-align: middle;
					margin-right: 1em;
				}
			}
			.el-button {
				padding: 8px 20px;
			}
			& > .el-button {
				margin: 5px 0 0 5px;
			}
			input {
				height: 30px;
				width: 220px;
				margin: 5px;
				border: 1px solid #e7e7e7;
				border-radius: 4px;
				text-indent: 1em;
				color: #999;
			}
		}
	}
}
</style>