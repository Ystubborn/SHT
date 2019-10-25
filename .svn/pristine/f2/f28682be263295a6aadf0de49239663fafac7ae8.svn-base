<template>
  <div>
    <BreadCrumb :data="[{ a: '订单管理', b: { path: '/order', name: 'order', params: { tab: $store.state.pageStatus.orderTab } } }, { a: '立即下单' }]"></BreadCrumb>
    <div class="main-content w block-center placeorder" v-if="!comm.IsNullOrEmpty(uiData.fservicetype)">
      <el-form :model="uiData" :rules="rules" ref="uiData" label-width="100px">
        <div class="title border-bottom-solid margin-bottom">基本信息</div>
        <div class="el-from-lable-vertical" label="服务类型：">
          <Radio type="border" v-model="uiData.fservicetype.id" :readonly="uiData.fserviceentry.length>0" readonly_msg="如需更改类型，请将服务信息的项目全部移除">
            <div v-for="item in tagData.comboStore.fservicetype.filter(o=>{return ['fres_type_01','fres_type_03'].indexOf(o.id)==-1})" :key="item.id" :value="item.id">{{item.name}}</div>
          </Radio>
        </div>
        <el-form-item label="服务类目：" prop="fprofield.id">
          <Radio type="border" class="serviceicon" v-model="uiData.fprofield.id" :multiple="true">
            <div v-for="(item,index) in tagData.comboStore.fprofield" :key="item.id" :value="item.id" v-show="index<5">
              <div class="service-icon"><i :class="['icon','icon-profield-'+index]"></i>{{item.name}}</div>
            </div>
          </Radio>
        </el-form-item>
        <div class="title border-bottom-solid margin-bottom">客户信息</div>
        <el-form-item>
          <button class="intelligence" type="button" @click="opClick('intelligence')"><i class="icon icon-int"></i>智能填写</button>
        </el-form-item>
        <el-form-item label="客户：" is-required>
          <el-col :span="5">
            <el-form-item prop="fname">
              <el-input type="text" v-model.trim="uiData.fname" placeholder="请输入客户姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item prop="fphone" :rules="comm.rules.phone">
              <el-input type="text" v-model.trim="uiData.fphone" placeholder="请输入客户手机号"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-col :span="5">
            <el-form-item prop="fregion.id">
              <City v-model="tagData.city"></City>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="fcusaddress">
              <el-input type="text" v-model.trim="uiData.fcusaddress" placeholder="请输入详细的地址" class="input-address margin-right"><i class="el-icon-location el-input__icon" slot="suffix"></i></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5" v-if="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1">
            <el-select v-model="uiData.fiselevator" class="i8">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in [{'id':true,'name':'有电梯'},{'id':false,'name':'无电梯'}]"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <div v-if="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1">
          <div class="title border-bottom-solid margin-bottom">物流信息<label class="color-gray">平台默认物流点验货时服务商仅验收商品外包装</label></div>
          <el-form-item label="是否到货：" is-required>
            <el-select placeholder="货物是否到达物流点" v-model="uiData.fisarrival" class="margin-right">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in [{'id':true,'name':'已到'},{'id':false,'name':'未到'}]"></el-option>
            </el-select>
            <span class="color-red">如未到货可暂不填写物流信息。填写物流信息有助于服务商更准确地报价。</span>
          </el-form-item>
          <el-form-item label="物流公司：">
            <el-input type="text" v-model.trim="uiData.flogistics" placeholder="请输入物流公司名称" class="margin-right"></el-input>
            物流单号：　<el-input type="text" v-model.trim="uiData.flogisticsno" placeholder="请输入物流单号"></el-input>
          </el-form-item>
          <el-form-item label="提货地址：">
            <el-input type="text" v-model.trim="uiData.fcollectadd" placeholder="请输入提货详细地址" class="input-address margin-right"><i class="el-icon-location el-input__icon" slot="suffix"></i></el-input>
          </el-form-item>
          <el-form-item label="提货电话：">
            <el-input type="text" v-model.trim="uiData.fcollectpho" placeholder="请输入提货电话" class="margin-right"></el-input>
            包装件数：<el-input-number class="i8 margin-right" :min="1" :controls="false" :max="100" v-model="uiData.fpieces"></el-input-number>件
          </el-form-item>
          <el-form-item label="代付运费：">
            <el-checkbox v-model="uiData.fispay" class="margin-right">需师傅代付运费，师傅报价包含此费用</el-checkbox>
            <em class="color-red">*</em>代付金额：　<el-input-number class="i8 margin-right" :min="0" :controls="false" :max="10000" v-model="uiData.ffreightamount"></el-input-number>元
          </el-form-item>
        </div>
        <div class="title border-bottom-solid margin-bottom">服务信息</div>
        <div class="service-item" v-for="item in uiData.fserviceentry" :key="item.id">
          <div>{{item.fseritemid.fname}}</div>
          <div>{{item.fmaterial.fname}}</div>
          <div>售价：{{item.fprice}}元/{{item.funitid.fname}}</div>
          <div>
            <el-input-number size="small" :min="0.001" :max="10000" v-model="item.fqty"></el-input-number>
          </div>
          <div>
            <el-select placeholder="可选房型" v-model="item.froomno.id" size="small">
              <el-option v-for="roomno in tagData.comboStore.froomno" :key="roomno.id" :label="roomno.name" :value="roomno.id"></el-option>
            </el-select>
          </div>
          <div><span class="color-blue">金额：{{parseFloat((item.famount = item.fprice * item.fqty).toFixed(2))}}元</span><i class="el-icon-delete" @click="opClick('deleteServiceItem',item.id)"></i>
          </div>
        </div>
        <el-dialog title="添加项目" :visible.sync="tagData.serviceItem.visible" width="723px" center :close-on-click-modal="false">
          <Orderseritem @listenData="opChange" :profield="uiData.fprofield.id" :servicetype="uiData.fservicetype.id"></Orderseritem>
        </el-dialog>
        <div class="service-item">
          <input type="button" value="添加项目" @click="opClick('showDialog')" />
        </div>
        <el-form-item label="图纸：" prop="fimage.id" is-required>
          <Upload :limit="50" v-model="uiData.fimage" class="margin-bottom"></Upload>
        </el-form-item>
        <div class="title border-bottom-solid margin-bottom">服务要求</div>
        <el-form-item label="服务日期" is-required>
          <el-date-picker v-model="uiData.forderdate" type="date" placeholder="选择服务日期" :picker-options="tagData.datePickerOptions"></el-date-picker>
          <span class="color-red">(希望服务商在此日期上门服务)</span>
        </el-form-item>
        <el-form-item label="注意事项" prop="fcareful" is-required>
          <el-input :maxlength="200" class="textarea-big" :rows="4" type="textarea" v-model="uiData.fcareful" placeholder="请填写关于客户以及物流备注，以及其他需要师傅注意的内容。（100字以内）"></el-input>
        </el-form-item>
        <el-form-item label="内部单号">
          <el-input v-model="uiData.forderbillno" placeholder="内部单号" class="input-medium"></el-input>
        </el-form-item>
        <div class="text-right">
          <h1 class="color-blue">合计：{{(uiData.fexpectamount= comm.priceSum(uiData.ffreightamount+_.sum(_.map(uiData.fserviceentry,"famount")),2))}}元</h1>
        </div>
      </el-form>
      <div class="text-right btn-panel">
        <button @click="opClick('save',!1)">保存</button>
        <button @click="opClick('save',!0)">提交订单</button>
      </div>
    </div>
  </div>
</template>
<script>
import {billView as base} from '../../../lib';
import placeOrderPlugIn from './placeOrderPlugIn';
import Orderseritem from '../../list/seritemdata';
import {vueCityDatas} from '../../../services/city-picker.data';
const billView = {
	extends: base
};
billView.formId = 'ydj_merchantorder';
billView.plugs = [new placeOrderPlugIn({})];
billView.mixins = [
	{
		methods: {
			opChange(type, data) {
				let t = this;
				switch (type) {
					case 'seritemch':
						t.uiData.fserviceentry = t.uiData.fserviceentry.concat(data);
						t.tagData.serviceItem.visible = !1;
						break;
				}
			},
			opClick(type, data) {
				let t = this;
				switch (type) {
					case 'intelligence':
						t.$prompt('', '地址信息', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							inputValue: '',
							inputPlaceholder: '请在此处粘贴地址相关信息',
							inputType: 'textarea'
						})
							.then(({value}) => {
								let phone = /((\+?86)|(\(\+86\)))?1[3-9][0-9]{9}/.exec(value);
								if (phone != null) {
									t.uiData.fphone = phone[0];
								}
								let name = new RegExp('(?<name>[\u4e00-\u9fa5]{2,4})').exec(value).groups['name'];
								if (name != null) {
									t.uiData.fname = name;
								}
								let area = value.replace(t.uiData.fphone, '').replace(t.uiData.fname, '');
								area = new RegExp('(?<province>[^省]+省|.+自治区|上海|北京|天津|重庆)(?<city>[^市]+市|.+自治州|市辖区)(?<region>[^县]+县|.+区|.+镇|.+局)(?<address>.*)').exec(area);
								if (area.groups['province'] != null) {
									let p = vueCityDatas.find(o => {
										return o.label.indexOf(area.groups['province'].trim()) > -1;
									});
									if (area.groups['city'] != null && p != null) {
										let c = p.children.find(o => {
											return o.label.indexOf(area.groups['city'].trim()) > -1;
										});
										if (area.groups['region'] != null && c != null) {
											let a = c.children.find(o => {
												return o.label.indexOf(area.groups['region'].trim()) > -1;
											});
											if (a != null) {
												t.tagData.city = [p.value, c.value, a.value];
												t.uiData.fcusaddress = area.groups['address'].trim();
											}
										}
									}
								}
							})
							.catch(() => {});
						break;
					case 'deleteServiceItem': //删除服务信息单项
						t.$confirm('您确定移除该项？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							t.comm.ArrayRemove(t.uiData.fserviceentry, o => {
								return o.id == data;
							});
						});
						break;
					case 'showDialog':
						if (t.comm.IsNullOrEmpty(t.uiData.fprofield.id)) {
							t.$message({
								message: '请先选择服务类目',
								type: 'warning'
							});
							return;
						}
						t.tagData.serviceItem.visible = !0;
						break;
					case 'save': //保存或提交按钮
						t.$refs['uiData'].validate(valid => {
							if (!valid) {
								t.$message({
									message: '请完善当前订单信息',
									type: 'warning'
								});
								return false;
							}
							if (t.comm.IsNullOrEmpty(t.uiData.fserviceentry)) {
								t.$message({
									message: '请至少填写一项服务信息',
									type: 'warning'
								});
								return false;
							}
							let pid = t.uiData.fprofield.id.split(',');
							t.uiData.fprofield_txt = t.uiData.fprofield.name = t._.map(
								t.tagData.comboStore.fprofield.filter(o => {
									return pid.indexOf(o.id) > -1;
								}),
								'name'
							).join();
							t.tagData.isSubmit = data;
							t.menuItemClick({opcode: 'save', event: 'uiData'});
						});
						break;
				}
			}
		},
		components: {Orderseritem},
		computed: {
			city() {
				return this.tagData.city;
			}
		},
		watch: {
			city(v) {
				this.uiData.fprovince = {id: v[0] || ''};
				this.uiData.fcity = {id: v[1] || ''};
				this.uiData.fregion = {id: v[2] || ''};
			}
		}
	}
];
export default billView;
</script>
<style lang="scss">
.placeorder {
	.radio-round {
		& > div {
			margin-right: 50px;
			& > * {
				position: relative;
				height: 60px;
			}
			.offer-one {
				padding-left: 50px;
				line-height: 60px;
				&::before {
					content: '';
					background-image: url(../../../assets/images/icon.png);
					background-position: -332px -115px;
					width: 42px;
					height: 40px;
					display: block;
					position: absolute;
					left: 0;
				}
			}
			.offer-two {
				padding-left: 40px;
				line-height: 60px;
				&::before {
					content: '';
					background-image: url(../../../assets/images/icon.png);
					background-position: -294px -111px;
					width: 27px;
					height: 55px;
					display: block;
					position: absolute;
					left: 0;
				}
			}
		}
	}
	.serviceicon {
		& > * {
			width: 120px;
		}
	}
	.service-icon {
		.icon-profield-0 {
			background-position: -146px -234px;
		}
		.icon-profield-1 {
			background-position: -226px -234px;
		}
		.icon-profield-2 {
			background-position: -306px -234px;
		}
		.icon-profield-3 {
			background-position: -386px -234px;
		}
		.icon-profield-4 {
			background-position: -466px -234px;
		}
		.icon {
			width: 70px;
			height: 70px;
			display: block;
			margin: 20px auto 0 auto;
		}
	}
	.intelligence {
		background-color: #fff;
		border: 1px solid #ff6d22;
		color: #ff6d22;
		line-height: 22px;
		padding: 5px 12px;
		border-radius: 18px;
		& > i {
			vertical-align: middle;
			margin-right: 5px;
		}
	}
	.el-from-lable-vertical {
		position: relative;
		padding-left: 100px;
		margin-bottom: 22px;
		&::before {
			content: attr(label);
			display: block;
			width: 88px;
			height: 40px;
			line-height: 40px;
			text-align: right;
			position: absolute;
			padding-right: 12px;
			left: 0;
			top: 50%;
			margin-top: -20px;
			color: #606266;
		}
	}
	.el-pagination__editor.el-input {
		width: 50px;
	}
	.city_box {
		display: inline-block;
	}
	.city_box,
	.el-select,
	.el-input {
		width: 200px;
	}
	.input-address {
		width: 502px;
	}
	.i8 {
		width: 100px;
		.el-input {
			width: 100px;
		}
	}
	.form-service-item {
		.el-form-item__error {
			top: 80%;
			left: 20px;
		}
	}
	.service-item {
		border: 1px solid #e7e7e7;
		padding: 20px 20px 20px 34px;
		margin-bottom: 20px;
		font-size: 0;
		& > * {
			font-size: 14px;
			display: inline-block;
			width: 196px;
			position: relative;
			&:nth-child(4),
			&:nth-child(5) {
				width: 150px;
			}
			& > .el-icon-delete {
				font-size: 24px;
				color: #ccc;
				position: absolute;
				right: 10px;
				top: 0px;
				cursor: pointer;
				&:hover {
					color: #ff6d22;
				}
			}
		}
		.el-input {
			width: auto;
		}
		.el-select--small {
			width: 120px;
		}
		input[type='button'] {
			width: 80px;
			height: 34px;
			box-sizing: border-box;
			cursor: pointer;
			background-color: #fff;
			border: 1px solid #ff6d22;
			color: #ff6d22;
			border-radius: 4px;
			&:hover {
				background-color: rgba(255, 109, 34, 0.6);
			}
		}
	}
	.btn-panel {
		button {
			width: 128px;
			height: 45px;
			color: #fff;
			border-radius: 4px;
			background-color: #ff6d22;
			margin: 15px 0;
			font-size: 16px;
			&:hover {
				opacity: 0.8;
			}
		}
	}
}
</style>