<template>
  <div>
    <el-dialog title="评价" :visible.sync="elVisible" top="30vh" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
      <div class="font15 color-black">服务已完成。</div>
      <p class="color-grey margin-v-half">请您对师傅的安装质量及服务进行评价：</p>
      <el-form label-width="88px" label-position="left">
        <el-form-item label="服务评分：">
          <el-rate :colors="color" v-model="rate" show-text :texts="text" :text-color="textColor">
          </el-rate>
        </el-form-item>
        <el-form-item label="服务印象：">
          <Radio type="border" class="evaluate-item" v-model="evalCh" :multiple="true">
            <div v-for="item in evalitem" :key="item.id" :value="item.id">{{item.name}}</div>
          </Radio>
        </el-form-item>
        <el-form-item label="我要评价：">
          <el-input type="textarea" v-model="describe" placeholder="您可以对本单服务的师傅进行评价，有效的评价可以帮助我们未来提供更好的服务" :rows="4" :maxlength="500"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="assessExit">取消</el-button>
        <el-button type="primary" @click="assessConfirm">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="reward" :visible.sync="rewardVisible" width="557px" :show-close="false" :close-on-click-modal="false">
      <div class="text-center reward-body block-center">
        <h6 class=" font14">非常满意，五星好评</h6>
        <h4 class="font20">是否打赏给师傅?</h4>
        <Radio type="border" v-model="rewardMoney">
          <div v-for="item in [{value:20},{value:50},{value:100}]" :value="item.value" :key="item.value">{{item.value}}元</div>
        </Radio>
        <input type="text" v-model="rewardMoney" placeholder="土豪请随意">
        <button type="button" @click="rewardconfirm">去打赏</button>
        <a href="javasctipt:void(0)" class="color-white" @click="rewardVisible=!1">不了，不想打赏</a>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss">
.evaluate-item {
	& > div {
		display: inline-block;
		width: 230px;
		text-align: center;
		box-sizing: border-box;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		font-size: 12px;
		height: 40px;
		line-height: 40px;
		margin: 0 10px 10px 0;
		cursor: pointer;
		position: relative;
		&:nth-child(2n) {
			margin-right: 0;
		}
	}
}
.reward {
	.el-dialog {
		background: url(../assets/images/reward-dialog.png);
		box-shadow: none;
	}
	.el-dialog__header {
		padding: 0;
	}
	.el-dialog__body {
		height: 565px;
		padding: 0;
		h6 {
			padding-top: 90px;
			color: #fff;
		}
		h4 {
			padding-top: 60px;
			color: #fff;
		}
		.reward-body {
			width: 366px;
			> input {
				height: 40px;
				display: block;
				width: 100%;
				border-radius: 4px;
				background-color: rgba(255, 255, 255, 0.2);
				border: 1px solid #e7e7e7;
				box-sizing: border-box;
				color: #fff;
				outline: none;
				text-indent: 1em;
				&::-webkit-input-placeholder {
					color: #fff;
				}
			}
			> button {
				width: 100px;
				background-color: #ffeb7c;
				height: 38px;
				border: 1px solid #ffeb7c;
				color: #ff3523;
				border-radius: 3px;
				box-sizing: border-box;
				display: block;
				margin: 60px auto 20px auto;
			}
		}
		.diy-radio {
			margin: 40px 0;
			> div {
				margin-right: 30px;
				background-color: rgba(255, 255, 255, 0.2);
				color: #fff;
				font-size: 16px;
				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
}
</style>
<script>
export default {
	data() {
		return {
			elVisible: false,
			evalitemData: [],
			evalCh: '',
			color: ['#FEE018', '#FEE018', '#FEE018'],
			text: ['非常不满意，各方面都很差', '不满意 ，比较差', '一般，还需改善', '比较满意，仍可改善', '非常满意，无可挑剔'],
			textColor: '#0086e4',
			describe: '',
			rate: 0,
			rewardVisible: false,
			rewardMoney: 0
		};
	},
	methods: {
		loadEvalItem() {
			if (this.comm.IsNullOrEmpty(this.evalitemData)) {
				this.axios.post('/bill/ydj_merchantorder?operationno=querycombo&fieldkey=fqual', {loadingOption: {target: '.element-loading'}}).then(res => {
					this.evalitemData = res.data.operationResult.srvData.data;
				});
			}
		},
		assessConfirm() {
			let t = this;
			if (t.rate == 0) {
				t.$message({
					message: '请为师傅点亮小星星，再提交',
					type: 'warning'
				});
				return;
			}
			let simpleData = {
				fqualstar: 'gradestar_0' + t.rate,
				fqual: t.evalCh,
				fqual_txt: _.map(
					t.evalitem.filter(o => {
						return t.evalCh.split(',').indexOf(o.id) > -1;
					}),
					'name'
				).join(),
				fevaludesc: t.describe
			};
			t.axios.post('/bill/ydj_merchantorder?operationno=evaluate', {selectedRows: [{pkValue: t.order}], simpleData: simpleData}).then(res => {
				t.elVisible = !1;
				if (t.rate == 5) {
					t.rewardVisible = !0;
				}
				this.$emit('successEvent', simpleData);
			});
		},
		assessExit() {
			this.elVisible = !1;
			this.$emit('closeEvent');
		},
		rewardconfirm() {
			let t = this;
			if (isNaN(parseFloat(t.rewardMoney)) || parseFloat(t.rewardMoney) < 0.01) {
				t.$message({
					message: '这个奖励金额有点问题哟！',
					type: 'warning'
				});
				return;
			}
			t.comm.OrderPay({id: t.order, price: t.rewardMoney, formId: 'ydj_merchantorder', type: 'reward',other:{}});
		}
	},
	mounted() {
		this.elVisible = this.visible;
	},
	computed: {
		evalitem() {
			return this.evalitemData.filter(o => {
				let a = parseInt(o.id.replace(this.evalsubstr, ''));
				return this.rate > 3 ? a > 5 : a < 6;
			});
		}
	},
	props: {
		visible: {default: false},
		evalsubstr: {default: 'mqual_'},
		order: {required: true}
	},
	watch: {
		visible(v) {
			this.elVisible = v;
			if (v === true) {
				this.loadEvalItem();
			}
		},
		evalitem() {
			this.evalCh = '';
		},
		elVisible(v) {
			this.$emit('update:visible', v);
		}
	}
};
</script>
