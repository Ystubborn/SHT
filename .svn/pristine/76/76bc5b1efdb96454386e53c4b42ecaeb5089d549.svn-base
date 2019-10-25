import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class detailPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		let t = this;
		args.tagData = {
			back: { visible: !1, content: '', image: {} },//回复相关
			orderBase: {}
		}
		args.rules = {
			content: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
		}
		return super.onInitUiModel(args);
	}
	onAfterLoadModelData(args) {
		this.getData('merchantorder', this.uiData.fmerbill);
		return super.onAfterLoadModelData(args);
	}
	onAfterDoOperation(args) {
		let t = this;
		let srvData = args.response.operationResult.srvData;
		if (args.opcode === 'save') {
			t.$router.push({ path: '/order/det-problem', query: { id: srvData[0].id } })
		}
		return Promise.resolve(args);
	}
}