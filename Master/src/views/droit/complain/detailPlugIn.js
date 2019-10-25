import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class detailPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		let t = this;
		args.tagData = {
			crumb: [{ a: '投诉管理', b: { path: '/droit/complain' } }, { a: '订单详情', b: { path: '/order/pre-orders', query: {} } }, { a: '投诉明细' }],
			orderBase: {},//订单信息
			tabactive:1
		}
		args.rules = {
			content: [{ required: true, message: '请输入回复说明', trigger: 'change' }]
		}
		return super.onInitUiModel(args);
	}
	onAfterLoadModelData(args) {
		this.getData('orderbase', this.uiData.fmerorderid.id);
		this.tagData.crumb[1].b.query.id = this.uiData.fmerorderid.id;
		return super.onAfterLoadModelData(args);
	}
}