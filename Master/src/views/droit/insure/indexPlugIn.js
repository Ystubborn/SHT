import shtListPlugIn from '../../plugIn/shtListPlugIn';

export default class indexPlugIn extends shtListPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		args.tagData = {
			thirdVisible: !1,
			transportVisible: !1
		}
		let userCtx = this.$store.state.userCtx;

		let filter = "fcode='" + userCtx.linkIdentity.id + "'";

		if (!args.query) {
			args.query = { filterString: filter };
		} else {
			args.query.filterString = filter;
		}
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