import shtListPlugIn from '../../plugIn/shtListPlugIn';

export default class SupplyListPlugIn extends shtListPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		args.tagData = {
			helpType: [],
			helpActive: { id: '', name: '' },
			hotData: [],
			search: '',
			hotitem: this.comm.Odefault(this.$route.query, 'id')
		}
		let filterStr = "fpublishstatus='send_status_01'";
		if (!this.comm.IsNullOrEmpty(args.tagData.hotitem)) {
			filterStr += " and fid='" + args.tagData.hotitem + "'";
			args.tagData.helpActive = { id: '', name: '热门问题' };
		}
		args.query = { filterString: filterStr, selectFields: ['selectFields'] };
		return super.onInitUiModel(args);
	}
	onAfterLoadModelData(arg) {
		this.getData('QueryCombo');
		this.getData('hotlist');
		return super.onAfterLoadModelData();
	}
	onCustomEvent(args) {
		let t = this;
		switch (args.opcode) {
			case 'pageSizeChanged':
				t.query.pageCount = args.value;
				break;
			case 'pageIndexChanged':
				t.query.pageIndex = args.value;
				break;
		}
		return super.onCustomEvent(args);
	}
}