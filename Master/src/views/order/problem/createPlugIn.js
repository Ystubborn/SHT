import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class createPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		let t = this;
		args.tagData = {
			orderBase: {}
		}
		args.rules = {
			fprodesript: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
			"fprograph.id": [{ required: true, message: '请上传问题图片' }]
		}
		return super.onInitUiModel(args);
	}
	onAfterLoadModelData(args) {
		this.getData('merchantorder');
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
	onRefresh(args) {
		let t = this;
		let linkIdentity = t.$store.state.userCtx.linkIdentity
		if (linkIdentity) {
			if (t.uiData.fdealerid) {
				t.uiData.fdealerid.id = linkIdentity.id || '';
			}
		}
		return Promise.resolve(args);
	}
}