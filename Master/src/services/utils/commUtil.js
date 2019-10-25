import store from '../../vuex/global';
import router from '../../routes/index';
let _reg = {
	phone: /^((\+?86)|(\(\+86\)))?1[3-9][0-9]{9}$/,
	code: /^\d{4}$/,
	pwd: /^\S{6,16}$/,
	paypwd: /^\d{6}$/,
	tel: /^0\d{2,3}-?\d{7,8}$/,
	bankcard: /^([1-9]{1})(\d{14,18})$/,
	zh_name: /^[\u4e00-\u9fa5]{2,6}$/
}
export default {
	/**
	*
	判断Null和空
	*
	@method IsNullOrEmpty
	@param {*} obj 任意值
	@param {*} [def] 若等于该值也返回true
	@return {Boolean} 是否为空或Null
	*/
	IsNullOrEmpty(obj, def) {
		switch (typeof (obj)) {
			case 'boolean':
				return obj === def ? true : false;
			case 'number':
				return obj === def || isNaN(obj) ? true : false;
			case 'string':
				return obj === def || obj.trim().length == 0 || obj.trim() === 'null' || obj.trim() === 'undefined' ? true : false;
			case 'undefined':
				return true;
			case 'function':
				return false;
			case 'object':
				if (obj instanceof Array) {
					return obj.length > 0 ? false : true;
				}
				if (obj instanceof Object) {
					if (obj === null) {
						return true;
					}
					for (var i in obj) {
						return false;
					}
				}
				return true;
		}
	},
	DateToString(date, formatString) {
		if (this.IsNullOrEmpty(formatString)) {
			formatString = 'yyyy-MM-dd';
		}
		formatString = formatString.replace(/[a-zA-Z]+/g, function () { return '{' + arguments[0] + '}'; });
		var Week = ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d'];
		var o = {
			yyyy: date.getFullYear(),
			MM: this.fillZero(date.getMonth() + 1),
			dd: this.fillZero(date.getDate()),
			HH: this.fillZero(date.getHours()),
			mm: this.fillZero(date.getMinutes()),
			ss: this.fillZero(date.getSeconds()),
			fff: date.getMilliseconds(),
			week: '\u661f\u671f' + Week[date.getDay()],
		};
		return this.StringFormat(formatString, o);
	},
	toDate(obj) {
		if (this.IsNullOrEmpty(obj)) {
			return new Date();
		}
		if (typeof obj == "number") {
			return new Date(obj);
		}
		if (obj.toLocaleLowerCase().indexOf("date") != -1) {
			return eval("new " + obj.replace(RegExp("/", "g"), ""));
		}
		var _val = obj.replace(new RegExp("-", "g"), "/");
		return new Date(_val);
	},
	fillZero(num) {
		if (Math.abs(num) > 9) {
			return num.toString(10);
		}
		if (num < 0) {
			return "-0" + Math.abs(num);
		}
		return "0" + num.toString(10);
	},
	StringFormat(s, a) {
		let t = this;
		if (a instanceof Object) {
			return s.replace(/\{(.+?)\}/g, function () {//arguments[0] value | arguments[1] group.value | arguments[2] index ...
				var g = arguments[1];
				var b = '';
				if (g.split('|').length == 2) {
					b = g.split('|')[1];
					g = g.replace('|' + b, '');
				}
				var h = g.split('.');
				var v = a;
				while (h.length > 0) {
					var i = h.shift();
					if (t.IsNullOrEmpty(v[i])) {
						h = [];
						v = b || "";
					}
					else {
						v = v[i];
					}
				}
				if (v instanceof Object) {
					v = JSON.stringify(v);
				}
				return v;
			});
		}
		if (a instanceof Array) {
			return s.replace(/\{(\d+?)\}/g, function () {
				var g = parseInt(arguments[1]);
				return a.length > g ? (!t.IsNullOrEmpty(a[g]) ? a[g] : "") : "";
			});
		}
		if (arguments.length >= 2) {
			a = arguments;
			return s.replace(/\{(\d+?)\}/g, function () {
				var g = parseInt(arguments[1]) + 1;
				return a.length > g ? (!t.IsNullOrEmpty(a[g]) ? a[g] : "") : "";
			});
		}
		return s;
	},
	ObjectArrayIndex(source, fun) {
		for (let i = 0; i < source.length; i++) {
			if (fun(source[i])) {
				return i;
			}
		}
		return -1;
	},
	/**
	*
	生成全局唯一标识符
	*
	@method Guid
	*/
	Guid() {
		var s = [];
		var hex = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hex.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hex.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";
		return s.join("");
	},
	priceSum(n, digit) {
		let m = Math.pow(10, digit);
		return Number(Math.round(n * m, 10) / m).toFixed(2);
	},
	Odefault(obj, key, def) {
		if (obj != null) {
			if (obj.hasOwnProperty(key)) {
				if (this.IsNullOrEmpty(obj[key])) {
					return def || '';
				}
				return obj[key];
			}
			console.warn("Object does not contain '" + key + "'");
		}
		return def || '';
	},
	ArrayRemove(arr, fun) {
		let j = 0;
		let temp = arr.concat();
		temp.forEach((a, i) => {
			if (fun instanceof Function) {
				if (fun(a)) {
					arr.splice(i - j, 1);
					j++;
				}
			}
		});
	},
	OrderPay(payParams) {
		let temp = JSON.parse(JSON.stringify(store.state.pay.params));
		Object.assign(temp, payParams)
		store.commit('pay', { params: temp })
		router.push({ path: '/pay' });
	},
	_RegExp: {
		isPhone: _reg.phone,
		isVerifCode: _reg.code,
		isPwd: _reg.pwd,
		isTel: _reg.tel,
		isPayPwd: _reg.paypwd
	},
	_include: {
		phone: /((\+?86)|(\(\+86\)))?1[3-9][0-9]{9}/,
		tel: /0\d{2,3}-?\d{7,8}/
	},
	rules: {
		code: [
			{
				validator: (a, b, c) => {
					if (!_reg.code.test(b)) {
						return c(new Error('验证码必须为四位数字'));
					}
					c();
				},
				trigger: 'blur'
			}
		],
		phone: [{
			validator: (a, b, c) => {
				if (!_reg.phone.test(b)) {
					return c(new Error('请输入正确的手机号'));
				}
				c();
			}, trigger: 'blur'
		}],
		pwd: [{
			validator: (a, b, c) => {
				if (!_reg.pwd.test(b)) {
					return c(new Error('请输入6到16位长度的密码'));
				}
				c();
			}, trigger: 'blur'
		}],
		bankcard: [{
			validator: (a, b, c) => {
				if (!_reg.bankcard.test(b)) {
					return c(new Error('银行卡号输入有误'));
				}
				c();
			}, trigger: 'blur'
		}],
		paypwd: [{
			validator: (a, b, c) => {
				if (!_reg.paypwd.test(b)) {
					return c(new Error('请输入6位数字密码'));
				}
				c();
			}, trigger: 'blur'
		}],
		Zhname: [{
			validator: (a, b, c) => {
				if (!_reg.zh_name.test(b)) {
					return c(new Error('姓名只能是2-6位中文'));
				}
				c();
			}, trigger: 'blur'
		}],
	}
}