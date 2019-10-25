import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class detailPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		//临时数据包
		args.tagData = {
			reject: { desc: "", id: "", visible: !1 },//驳回项目
			orderBase: {}
		};
		return super.onInitUiModel(args);
	}
}