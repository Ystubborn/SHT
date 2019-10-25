import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class customerPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		args.tagData = {
			isEdit: !1,
			city: [],
			headIcon: null,
			visible: !1,
			Phonechange: { phone: '', code: '' }
		}
		return super.onInitUiModel(args);
	}
	onAfterLoadModelData(args) {
		if (!args) {
			return;
		}
		let t = this;
		t.tagData.city = [t.uiData.fprovince.id, t.uiData.fcity.id, t.uiData.fregion.id];
		t.tagData.headIcon = t.uiData.fimage;
		return super.onAfterLoadModelData(args);
	}
}