import shtBillPlugIn from '../../plugIn/shtBillPlugIn';

export default class initbillPlugIn extends shtBillPlugIn {
	constructor(options) {
		super(options);
	}
	onInitUiModel(args) {
		let t = this;
		let IDcard15 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
		var IDcard18 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|x)$/;
		//临时数据包
		args.tagData = {
		};
		args.rules = {
			fsourcenumber: [{ required: true, message: '请输入关联订单号', trigger: 'blur' }],
			fname: [{ required: true, message: '请输入您的姓名', trigger: 'blur' }],
			fphone: [{
				validator: (a, b, c) => {
					if (!this.comm._RegExp.isPhone.test(b)) {
						return c(new Error("客户手机号格式错误"));
					}
					c();
				}, trigger: 'blur'
			}],
			"fidcar1.id": [{ required: true, message: '请上传身份证正面' }],
			"fidcar2.id": [{ required: true, message: '请上传身份证反面' }],
			fidcard: [
				{
					validator: (a, b, c) => {
						if (!IDcard15.test(b) && !IDcard18.test(b)) {
							return c(new Error("身份证格式错误"));
						}
						c();
					}, trigger: 'blur'
				}],
			fdamagesprice: [
				{
					validator: (a, b, c) => {
						if (parseFloat(b) <= 0) {
							return c(new Error("损失费用不能小于等于0"))
						}
						c();
					}, trigger: 'blur'
				}
			],
			"faccidentimage.id": [{ required: true, message: '请上传事故现场照片' }],
			"fendimage.id": [{ required: true, message: '请上传损' + (this.$route.name == 'person' ? '伤' : '失') + '照片' }],
			fdescription: [{ required: true, message: '请输入案情描述', trigger: 'blur' }],
		};
		return super.onInitUiModel(args);
	}
	onAfterDoOperation(args) {
		let t = this;
		if (args.opcode === 'save') {
			t.$router.push({ path: '/droit/insure' })
		}
		return Promise.resolve(args);
	}
}