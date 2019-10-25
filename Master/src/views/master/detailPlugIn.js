import shtBillPlugIn from '../plugIn/shtBillPlugIn';

export default class detailPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		let t = this;
		args.tagData = {
			tabActive: 'one',
			fquallist: [],
			evaluateList:[],
			listDesc:{pageIndex:1,pageSize:10,records:0}
		}
		return super.onInitUiModel(args);
	}
	onAfterLoadModelData(args) {
		this.getData('evaluate');
		this.getData('evaluateList',this.uiData.id);
		return super.onAfterLoadModelData(args);
	}
}