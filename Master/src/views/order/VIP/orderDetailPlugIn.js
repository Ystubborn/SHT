import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class orderDetailPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		let t = this;
		//临时数据包
		args.tagData = {
			tabActive: 'one',//切换卡选中项
			tabs: {
				order: !1,
				done: !1,
				refund: !1,
				feedbackBtn: !1,
				complainBtn: !1,
				refundBtn: !1
			},
			accept: { desc: "", id: "", visible: !1 },//验收项目
			evaluate: {visible: !1 },//评价
			feedData: [], complainData: [], refundData: [],
			dealerStar:0,
		};
		return super.onInitUiModel(args);
	}

	onAfterLoadModelData(args) {
		let t = this;
		//服务过程选项卡显示
		if (['sht_serstatus06', 'sht_serstatus07', 'sht_serstatus08', 'sht_serstatus12', 'sht_serstatus13'].indexOf(t.uiData.fserstatus.id) > -1) {
			t.tagData.tabs.order = !0;
		}
		//完工信息展示 反馈数据展示
		if (['sht_serstatus06','sht_serstatus07', 'sht_serstatus08'].indexOf(t.uiData.fserstatus.id) > -1) {
			t.tagData.tabs.done = !0;
			t.getData('feedback');
		}
		//服务过程选项卡 反馈按钮展示
		if (t.uiData.fserstatus.id === 'sht_serstatus07') {
			t.tagData.tabs.feedbackBtn = !0;
		}
		//服务过程选项卡 投诉数据及按钮展示
		if (['sht_serstatus06', 'sht_serstatus07', 'sht_serstatus08', 'sht_serstatus12', 'sht_serstatus13'].indexOf(t.uiData.fserstatus.id) > -1) {
			t.getData('complain');
			if ('sht_serstatus08' !== t.uiData.fserstatus.id) {
				t.tagData.tabs.complainBtn = !0;
			}
		}
		//服务过程选项卡 投诉数据及按钮展示
		if (['sht_serstatus06', 'sht_serstatus07', 'sht_serstatus08','sht_serstatus12','sht_serstatus13'].indexOf(t.uiData.fserstatus.id) > -1) {
			t.tagData.tabs.refund = !0;
			t.getData('refund');
			if ('sht_serstatus08' !== t.uiData.fserstatus.id) {
				t.tagData.tabs.refundBtn = !0;
			}
		}
		return super.onAfterLoadModelData(args);
	}
}