import shtListPlugIn from '../plugIn/shtListPlugIn';

export default class MasterListPlugIn extends shtListPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		args.tagData = {
			mS: '',//隔离条件
			cS: '',//城市条件
			iS:'',//搜索框内容
			city:[],
			servicetype:'',
			profie:[]
		}
		args.tagData.mS = "fapprovestatus ='auth2' and fmainorgid='" + this.$store.state.userCtx.company.companyId + "'"
		this.queryInit(args);
		return super.onInitUiModel(args);
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
			case 'tabClick':
				t.queryInit('', t.tagData.tA, t);
				break;
		}
		return super.onCustomEvent(args);
	}
}