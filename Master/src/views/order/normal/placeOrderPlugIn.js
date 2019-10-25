import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class placeOrderPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		let t = this;
		//临时数据包
		args.tagData = {
			city: [],
			isSubmit: false,
			serviceItem: {
				visible: !1,
				projectImage: [],//当前项图片
				editItem: '',//当前项id
				imageslist: [],//所有项目图片信息 临时存放
				tData: []
			},
			serviceTypeInit: [],//已加载的服务定价数据
			serviceTypeData: [],//存放服务定价数据
			unitData: [],
			serviceTypeMessage: '',
			master: {
				tabactive: 0,
				visible: !1,
				listData: [],
				change: [],
				checkall: !1,
				search: '',
				listDesc: { pageCount: 5, pageIndex: 1, rows: 0 }
			},
			datePickerOptions: {
				disabledDate(time) {
					return time.getTime() < Date.now();
				},
			},
			isLoad: !1
		};
		var Zhreplacenum = function (a) {
			let t = '零一二三四五六七八九十壹贰叁肆伍陆柒捌玖拾';
			for (let i = 0; i < t.length; i++) {
				let j = i < 10 ? i % 10 : (i % 11) + 1;
				a = String(a).replace(new RegExp(t[i], 'g'), j);
			}
			return a;
		}
		args.rules = {
			"fprofield.id": [{ required: true, message: '请选择服务项目' }],
			//fname: [{ required: true, message: '请填写客户姓名', trigger: 'blur' }],
			"fregion.id": [{ required: true, message: '请选择完整的省市区', trigger: 'change' }],
			fcusaddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
			"fseritemid.id": [{
				validator: (a, b, c) => {
					if (t.comm.IsNullOrEmpty(b)) {
						return c(new Error('请选择服务类型'));
					}
					c()
				}, trigger: 'change'
			}],
			"fmaterial.id": [{
				validator: (a, b, c) => {
					if (t.comm.IsNullOrEmpty(b)) {
						return c(new Error('请选择材质'));
					}
					c()
				}, trigger: 'change'
			}],
			'froomno.id': [{
				validator: (a, b, c) => {
					let item = t.uiData.fserviceentry.filter(o => {
						return o.fseritemid.id == b.fseritemid.id && o.fmaterial.id == b.fmaterial.id && o.froomno.id == b.froomno.id
					});
					if (item.length > 1) {
						return c(new Error('相同的服务项目、材质不允许同样房型'));
					}
					c()
				}, trigger: 'change'
			}],
			'fprice': [{
				validator: (a, b, c) => {
					if (parseFloat(b) < 0.01 && this.uiData.foffertype.id == 'offer_type_01') {
						return c(new Error('金额不能小于1分钱'));
					}
					c()
				}, trigger: 'blur'
			}],
			'funitid': [{ required: true, message: '请选择单位', trigger: 'change' }],
			'fqty':
				[
					{
						validator: (a, b, c) => {
							if (parseFloat(b) < 0.0001) {
								return c(new Error('数量不能小于0.0001'));
							}
							c()
						}, trigger: 'blur'
					}
				],
			"frequire": [{
				validator: (a, b, c) => {
					if (this.comm._include.phone.exec(Zhreplacenum(b)) != null || this.comm._include.tel.exec(Zhreplacenum(b) != null)) {
						return c(new Error('请勿在此填写任何形式的联系方式等信息'))
					}
					c();
				}, trigger: 'blur'
			}],
			fcareful: [{ required: true, message: '请填写注意事项', trigger: 'blur' },
			{
				validator: (a, b, c) => {
					if (this.comm._include.phone.exec(Zhreplacenum(b)) != null || this.comm._include.tel.exec(Zhreplacenum(b) != null)) {
						return c(new Error('注意事项含有非法信息'))
					}
					c();
				}, trigger: 'blur'
			}],
			felevator: [{
				validator: (a, b, c) => {
					if (b < 2) {
						return c(new Error('楼层至少为2楼及以上'));
					}
					c();
				}, trigger: 'blur'
			}],
			flogistics: [{ required: true, message: '请填写物流信息', trigger: 'blur' }],
			fcollectadd: [{ required: true, message: '请填写提货地址', trigger: 'blur' }],
			fcollectpho: [{
				validator: (a, b, c) => {
					if (!this.comm._RegExp.isTel.test(b) && !this.comm._RegExp.isPhone.test(b)) {
						return c(new Error("提货电话格式错误"));
					}
					c();
				}, trigger: 'blur'
			}],
			fexpectedarrivaldate: [
				{
					validator: (a, b, c) => {
						debugger
						if (!this.uiData.fisarrival && (!(b instanceof Date) && this.comm.IsNullOrEmpty(b))) {
							return c(new Error("请选择预计到货时间"));
						}
						c();
					}, trigger: 'blur'
				}
			]
		};
		return super.onInitUiModel(args);
	}

	onAfterLoadModelData(args) {
		if (!args) {
			return;
		}
		let t = this;
		setTimeout(() => {
			t.tagData.isLoad = !0;
		}, 2000);
		t.getData('unit');
		if (args.status == 'view') {
			if (t.uiData.fserstatus.id !== 'sht_serstatus00') {
				t.$router.push({ path: '/order/pre-orders', query: { id: t.uiData.id } })
				return;
			}
			t.uiData.fserviceentry.forEach(o => {
				o.fentityimage.url = '';
				t.axios.post("/fileinfo", { loadingOption: { target: '.element-loading' }, fileId: o.fentityimage.id, thumbnail: false }).then(res => {
					let srvData = res.data.operationResult.srvData;
					o.fentityimage.url = srvData[0].url;
					let imgList = [];
					for (let i = 0; i < srvData.length; i++) {
						imgList.push({ id: srvData[i].fileId, url: srvData[i].url })
					}
					t.tagData.serviceItem.projectImage = [];
					t.tagData.serviceItem.imageslist.push({
						id: o.id,
						data: imgList
					});
				});
			});
			t.tagData.city = [t.uiData.fprovince.id, t.uiData.fcity.id, t.uiData.fregion.id];
			return super.onAfterLoadModelData(args);
		}
		return super.onAfterLoadModelData(args);
	}

	onBeforeDoOperation(args) {
		let t = this;
		args.param.loadingOption = {
			target: '.placeorder',
			text: ''
		}
		switch (args.opcode) {
			case 'save':
				if (!t.tagData.isSubmit) {
					if (!args.param.simpleData) {
						args.param.simpleData = {};
					}
					args.param.simpleData.appId = "Other";
				}
				break;
		}
		return Promise.resolve(args);
	}

	onAfterDoOperation(args) {
		let t = this;
		let srvData = args.response.operationResult.srvData;
		if (args.opcode === 'save') {
			if (t.tagData.isSubmit) {
				t.$router.push({ path: '/order/pre-orders', query: { id: srvData[0].id } })
			}
			else {
				t.$router.push({ path: '/order', name: "order", params: { tab: 'one' } })
			}
		}
		return Promise.resolve(args);
	}
	onRefresh(args) {
		let t = this;
		let linkIdentity = t.$store.state.userCtx.linkIdentity
		if (linkIdentity) {
			if (t.uiData.fmerchantid) {
				t.uiData.fmerchantid.id = linkIdentity.id || '';
				t.uiData.fmerchantid.fname = linkIdentity.name || '';
			}
		}
		return Promise.resolve(args);
	}
}