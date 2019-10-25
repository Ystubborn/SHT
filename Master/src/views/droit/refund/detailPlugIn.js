import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class detailPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		return super.onInitUiModel(args);
	}
	onAfterLoadModelData(args) {
		this.getData('merchantorder',this.uiData.fmerbill);
		return super.onAfterLoadModelData(args);
	}
	onAfterDoOperation(args) {
		let t = this;
		let srvData = args.response.operationResult.srvData;
		if (args.opcode === 'save') {
			t.$router.push({ path: '/droit/det-refund', query: { id: srvData[0].id } })
		}
		return Promise.resolve(args);
	}
}