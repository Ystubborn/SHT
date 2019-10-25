import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class createPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		let t = this;
		if (t.comm.IsNullOrEmpty(t.$route.query.orderId)) {
			t.$message({
				message: '缺少参数',
				type: 'error'
			});
		}
		args.tagData = {
			orderBase: {},
			reasonlist: [],
			reasonmome: '',
			reasonprice: 0
		};
		args.rules = {
			"fcomplaintitem.id": [{ required: true, message: '请选择投诉原因', trigger: 'change' }],
			fcomplain: [{ required: true, message: '请输入投诉说明', trigger: 'blur' }],
			"fimage.id": [{ required: true, message: '请上传凭证' }]
		}
		return super.onInitUiModel(args);
	}
	onAfterLoadModelData(args) {
		this.getData('complaintitem');
		this.getData('orderbase');
		return super.onAfterLoadModelData(args);
	}
	onAfterDoOperation(args) {
		let t = this;
		let srvData = args.response.operationResult.srvData;
		if (args.opcode === 'save') {
			t.$router.push({ path: '/droit/det-complain', query: { id: srvData[0].id } })
		}
		return Promise.resolve(args);
	}
	onRefresh(args) {
		let t = this;
		let linkIdentity = t.$store.state.userCtx.linkIdentity
		if (linkIdentity) {
			if (t.uiData.fmerchantid) {
				t.uiData.fmerchantid.id = linkIdentity.id || '';
				t.uiData.fmerorderid = (t.$route.query || { orderId: '' }).orderId;
			}
		}
		return Promise.resolve(args);
	}
}