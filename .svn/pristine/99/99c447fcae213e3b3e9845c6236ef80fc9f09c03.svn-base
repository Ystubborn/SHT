import shtListPlugIn from '../../plugIn/shtListPlugIn';

export default class RefundListPlugIn extends shtListPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		args.tagData = {
			reject: { desc: "", id: "", visible: !1 },//驳回项目
			cMload: !0,
			tA: 'zero',//Tab选项卡选中
			tD: [//a lable | b name | s filter
				{ a: "全部", b: "zero", s: '' },
				{ a: "处理中", b: "one", s: "frefundstatus='doing_status01'" },
				{ a: "退款成功", b: "two", s: "frefundstatus='doing_status02'" },
				{ a: "退款失败", b: "three", s: "(frefundstatus='doing_status03' or frefundstatus='doing_status05')" }
			],
			cS: '',//客户信息
			oS: '',//订单号
			tS: '',//状态条件
			mS: '',//商户隔离条件
			opBtn: [
				{ a: '确认支付', b: '' },
				{ a: '驳回', b: '' },
				{ a: '查看', b: '' }
			]
		}
		/*处理普通商户和VIP商户Tabs数据源*/
		let userCtx = this.$store.state.userCtx;
		args.tagData.tD.map(o => {
			o.c = 0;
			return o;
		});

		/*商户过滤条件*/
		if (userCtx.linkIdentity) {
			args.tagData.mS = this.$util.format("fdealerid='{0}'", userCtx.linkIdentity.id || '');
		}
		//全部订单、其他类型订单
		this.queryInit('', this.$route.params.tab || 'zero', args);
		return super.onInitUiModel(args);
	}

	onBeforeDoOperation(args) {
		args.param.loadingOption = {
			target: '.order-panel'
		}
		return Promise.resolve(args);
	}
	onCustomEvent(args) {
		let t = this;
		t.tagData.s = '';
		switch (args.opcode) {
			case 'pageSizeChanged':
				t.query.pageCount = args.value;
				break;
			case 'pageIndexChanged':
				t.query.pageIndex = args.value;
				break;
			case 'tabClick':
				this.queryInit('', t.tagData.tA, t);
				break;
		}
		return super.onCustomEvent(args);
	}
}