<template>
  <div>
    <BreadCrumb :data=" [{ a: '订单管理', b: { path: '/order', name: 'order', params: { tab: $store.state.pageStatus.orderTab } } }, { a: '立即下单' }]"></BreadCrumb>
    <div class="sologo w block-center">温馨提示：本平台下单不取收任何费用，并且为您提供线上担保服务。90%安装产生的纠纷及损失均是因为线下交易问题。</div>
    <div class="main-content w block-center placeorder" v-if="!comm.IsNullOrEmpty(uiData.fservicetype)">
      <el-form :model="uiData" :rules="rules" ref="uiData" label-width="100px">
        <div class="title border-bottom-solid margin-bottom">基本信息</div>
        <div class="el-from-lable-vertical" label="报价方式：">
          <Radio type="round" v-model="uiData.foffertype.id" :readonly="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1" readonly_msg="含有物流的订单只允许报价方式为师傅报价">
            <div value="offer_type_01">
              <div class="offer-one">一口价</div>
            </div>
            <div value="offer_type_02">
              <div class="offer-two">师傅报价</div>
            </div>
          </Radio>
        </div>
        <el-form-item label="服务类目：" prop="fprofield.id">
          <Radio type="border" class="serviceicon" v-model="uiData.fprofield.id" :readonly="uiData.fserviceentry.length>0" readonly_msg="如需更改类型，请将服务信息的项目全部移除">
            <div v-for="(item,index) in tagData.comboStore.fprofield" :key="item.id" :value="item.id">
              <div class="service-icon"><i :class="['icon','icon-profield-'+index]"></i>{{item.name}}</div>
            </div>
          </Radio>
        </el-form-item>
        <div class="el-from-lable-vertical" label="服务类型：">
          <Radio type="border" v-model="uiData.fservicetype.id" :readonly="uiData.fserviceentry.length>0" readonly_msg="如需更改类型，请将服务信息的项目全部移除">
            <div v-for="item in tagData.comboStore.fservicetype" :key="item.id" :value="item.id">{{item.name}}</div>
          </Radio>
        </div>
        <div class="title border-bottom-solid margin-bottom">客户信息<span class="color-red font14">{{tagData.serviceTypeMessage}}</span></div>
        <el-form-item>
          <button class="intelligence" type="button" @click="opClick('intelligence')"><i class="icon icon-int"></i>智能填写</button>
        </el-form-item>
        <el-form-item label="客户：" is-required>
          <el-col :span="5">
            <el-form-item prop="fname" :rules="comm.rules.Zhname">
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
          <el-col :span="9">
            <el-form-item prop="fcusaddress">
              <el-input type="text" v-model.trim="uiData.fcusaddress" placeholder="请输入详细的地址" class="input-address margin-right"><i class="el-icon-location el-input__icon" slot="suffix"></i></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1">
            <el-select v-model="uiData.fiselevator" class="i8">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in [{'id':true,'name':'有电梯'},{'id':false,'name':'无电梯'}]"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" v-if="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1&&!uiData.fiselevator">
            <el-checkbox v-model="uiData.fisupstairs"></el-checkbox>是否抬楼
          </el-col>
          <el-col :span="3" v-if="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1&&!uiData.fiselevator&&uiData.fisupstairs">
            <el-form-item prop="felevator">
              <el-input type="number" class="i8" v-model.trim="uiData.felevator" placeholder="输入楼层"></el-input> 楼
            </el-form-item>
          </el-col>
        </el-form-item>
        <div v-if="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1">
          <div class="title border-bottom-solid margin-bottom">物流信息<label class="color-gray">平台默认物流点验货时服务商仅验收商品外包装</label></div>
          <el-form-item label="物流公司：" prop="flogistics" is-required>
            <el-input type="text" v-model.trim="uiData.flogistics" placeholder="请输入物流公司名称" class="margin-right"></el-input>
            物流单号：<el-input type="text" v-model.trim="uiData.flogisticsno" placeholder="请输入物流单号"></el-input>
          </el-form-item>

          <el-form-item label="提货地址：" prop="fcollectadd" is-required>
            <el-input type="text" v-model.trim="uiData.fcollectadd" placeholder="请输入提货详细地址" class="input-address margin-right"><i class="el-icon-location el-input__icon" slot="suffix"></i></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" is-required>
            <el-col :span="10">
              <el-form-item prop="fcollectpho">
                <el-input type="text" v-model.trim="uiData.fcollectpho" placeholder="请输入提货电话" class="margin-right"></el-input>
                包装件数：<el-input-number class="i8 margin-right" :min="1" :controls="false" :max="100" v-model="uiData.fpieces"></el-input-number>件
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="代付运费：">
            <el-checkbox v-model="uiData.fispay" class="margin-right">需师傅代付运费，师傅报价包含此费用</el-checkbox>
            <em class="color-red">*</em>代付金额：　<el-input-number class="i8 margin-right" :min="0" :controls="false" :max="10000" v-model="uiData.fshippingamount"></el-input-number>元
          </el-form-item>
        </div>
        <div v-if="uiData.fservicetype.id!='fres_type_03'">
          <div class="title border-bottom-solid margin-bottom">服务信息<span class="color-red font14">（重要提醒：平台主要针对定制家居安装为主，请您上传完整的安装图纸，以免图纸不全无法报价或安装时拒绝服务等情况出现。）</span></div>
          <el-form-item label-width="0px" class="form-service-item" v-for=" (item,index) in uiData.fserviceentry" :key="item.id">
            <div class="service-item">
              <div>
                <div class="img-panel" :data-count="item.fentityimage.id.split(',').length">
                  <img :src="item.fentityimage.url.split(',')[0]" />
                </div>
                <input type="button" value="添加图片" @click="opClick('showImageDialog',item.id)" />
              </div>
              <div>
                <el-form-item :prop="'fserviceentry['+index+'].fseritemid.id'" :rules="rules['fseritemid.id']" label="服务项目" label-width="94px" is-required>
                  <el-select placeholder="请选择服务类型" filterable v-model="item.fseritemid.id">
                    <el-option v-for="seritem in tagData.serviceTypeData" :key="seritem.id" :label="seritem.name" :value="seritem.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :prop="'fserviceentry['+index+'].fmaterial.id'" :rules="rules['fmaterial.id']" label="材质" label-width="94px" is-required>
                  <el-select placeholder="请选择材质" v-model="item.fmaterial.id" @change="opChange('itemcategory',item)">
                    <el-option v-for="material in comm.Odefault(tagData.serviceTypeData.find(o=>{return o.id==item.fseritemid.id;}),'material',[])" :key="material.id" :label="material.name" :value="material.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="房型" label-width="94px" :prop="'fserviceentry['+index+']'" :rules="rules['froomno.id']">
                  <el-select placeholder="可选房型" v-model="item.froomno.id">
                    <el-option v-for="roomno in tagData.comboStore.froomno" :key="roomno.id" :label="roomno.name" :value="roomno.id"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div>
                <div>
                  <el-col :span="9">
                    <el-form-item :label="(uiData.foffertype.id!='offer_type_01'?'期望':'')+'单价'" :prop="'fserviceentry['+index+'].fprice'" :rules="rules['fprice']" label-width="94px" is-required>
                      <el-input-number placeholder="0元" class="input-price" :min="0" :controls="false" :max="1000000" v-model="item.fprice"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item :prop="'fserviceentry['+index+'].funitid'" :rules="rules['funitid']">
                      <el-select v-model="item.funitid" placeholder="单位" class="input-price">
                        <el-option v-for="unit in tagData.unitData" :key="unit.fbillhead_id" :label="unit.fname" :value="unit.fbillhead_id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="数量" label-width="80px" :prop="'fserviceentry['+index+'].fqty'" :rules="rules['fqty']" is-required>
                      <el-input-number :min="0.001" :max="10000" v-model="item.fqty"></el-input-number>
                    </el-form-item>
                  </el-col>
                </div>
                <el-form-item label="特殊要求" label-width="94px" :prop="'fserviceentry['+index+'].frequire'" :rules="rules['frequire']">
                  <el-input type="textarea" :rows="3" :maxlength="100" placeholder="请填写图纸以外没有注明的安装产品（例如：需要安装智能产品，罗马柱需要切角，顶线需要切割）安装请带齐工具（100字以内）" v-model="item.frequire"></el-input>
                </el-form-item>
              </div>
              <div class="item-tools">
                <div class="color-blue">金额：{{parseFloat((item.famount = (item.fprice||0) * (item.fqty||0) ).toFixed(2))}}元</div>
                <i class="el-icon-delete" @click="opClick('deleteServiceItem',item.id)"></i>
              </div>
            </div>
          </el-form-item>
          <el-dialog title="添加图片" :visible.sync="tagData.serviceItem.visible" center :close-on-click-modal="false">
            <ImgManage v-model="tagData.serviceItem.projectImage" :limit="8" :clear="tagData.serviceItem.visible">
              请上传设计/安装图纸，便于师傅更准确的报价
            </ImgManage>
            <span slot="footer">
              <el-button @click="tagData.serviceItem.visible=!1">取 消</el-button>
              <el-button type="primary" @click="opClick('formatServiceItem')">确 定</el-button>
            </span>
          </el-dialog>
          <div class="service-item">
            <input type="button" value="添加图片" @click="opClick('showImageDialog')" />
          </div>
        </div>
        <div class="title border-bottom-solid margin-bottom">其他要求</div>
        <el-form-item label="是否到货：" is-required>
          <el-col :span="5">
            <el-select placeholder="货物是否到达物流点" v-model="uiData.fisarrival" class="margin-right">
              <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in [{'id':true,'name':'已到'},{'id':false,'name':'未到'}]"></el-option>
            </el-select>
          </el-col>
          <el-col :span="10" v-if="!uiData.fisarrival">
            <el-form-item label="预计到货时间：" label-position="left" label-width="110px" prop="fexpectedarrivaldate">
              <el-date-picker v-model="uiData.fexpectedarrivaldate" type="date" placeholder="选择服务日期" class="margin-right" :picker-options="tagData.datePickerOptions">></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="服务日期：">
          <el-date-picker v-model="uiData.forderdate" type="date" placeholder="选择服务日期" class="margin-right" :picker-options="tagData.datePickerOptions">></el-date-picker>
          <span class="color-grey">(希望服务商在此日期上门服务)</span>
        </el-form-item>
        <el-form-item label="备注：" prop="fcareful" is-required>
          <el-input :maxlength="200" class="textarea-big" :rows="4" type="textarea" v-model="uiData.fcareful" placeholder="请详细说明安装注意的细节，比如需要带齐的工具，安装工艺要求等情况，以免师傅准备不足耽误安装进度。（100字以内）"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人" is-required>
          <el-col :span="5">
            <el-form-item prop="furgentname" :rules="comm.rules.Zhname">
              <el-input v-model="uiData.furgentname" placeholder="请输入姓名" class="margin-right"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="furgentphone" :rules="comm.rules.phone">
              电话：　<el-input type="text" v-model.trim="uiData.furgentphone" placeholder="请输入电话"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <p class="tips margin-bottom">
          温馨提示：①定制类产品需要上传安装图纸或设计图纸，如订单信息与实际服务要求不符，由此造成的损失由用户自行承担。②订单服务过程中因非师傅原因导致师傅空跑，需按师傅报价时服务承诺支付师傅空跑费用。③定制类产品安装过程中造成的改柜、补板或二次上门等情况，用户需按实际情况适当增加费用。④如需师傅代买物料等行为，需支付相等金额的费用。⑤订单信息中必填内容和选填内容相冲突时（如商品信息和备注说明不一致等），一旦出现交易纠纷，平台客服将以订单必填信息为判断标准⑥为保障您的权益，所有行为均需在平台系统内操作，如线下行为造成的损失，平台将不予受理。
        </p>
        <div>派单模式： <Radio v-model="tagData.master.tabactive" class="tab">
            <div value="0">全部师傅</div>
            <div value="1">收藏师傅</div>
            <div value="2">指定师傅</div>
          </Radio>
        </div>
        <div class="tab-panel">
          <p v-if="tagData.master.tabactive==0" class="margin-v-half color-orange">
            订单将指派给符合要求的师傅。
          </p>
          <div v-if="tagData.master.tabactive!=0">
            <em v-for="item in tagData.master.change" :key="item.id">{{item.name}}<i class="el-icon-close" @click="opClick('master-del',item.id)"></i></em><a href="javascript:void(0)" v-if="tagData.master.tabactive==1||(tagData.master.change.length==0&&tagData.master.tabactive==2)" @click="tagData.master.visible=!0;getData('master')">添加师傅</a>
          </div>
        </div>
        <div class="text-right" v-show="uiData.foffertype.id=='offer_type_01'">
          <h1 class="color-blue">合计：{{(uiData.fexpectamount= comm.priceSum(uiData.fshippingamount+_.sum(_.map(uiData.fserviceentry,"famount")),2))}}元</h1>
        </div>
      </el-form>
      <div class="text-right btn-panel">
        <button @click="opClick('save',!1)">保存</button>
        <button @click="opClick('save',!0)">提交订单</button>
      </div>
      <el-dialog title="选择师傅" width="1020px" top="5vh" :visible.sync="tagData.master.visible">
        <div class="search">
          <el-input placeholder="请输入师傅姓名" v-model="tagData.master.search" @keyup.enter.native="getData('master')"></el-input>
          <el-button @click="getData('master',1,false)">搜索</el-button>
          <el-button @click="getData('master',1,true)">重置</el-button>
        </div>
        <ul class="master">
          <li v-for="item in tagData.master.listData" :key="item.fbillhead_id">
            <el-checkbox v-model="item.check" v-if="tagData.master.tabactive==1"></el-checkbox>
            <div class="head" @click="$router.push({path: '/master/detail',query: {id: item.fbillhead_id}});">
              <ImgRender type="headPort" :source="item.fimage"></ImgRender>
            </div>
            <div class="base">
              <h5 @click="$router.push({path: '/master/detail',query: {id: item.fbillhead_id}});">{{item.fname}}</h5>
              <p class="color-grey">{{item.fphone}}</p>
              <i class="icon icon-bond" v-if="item.fispaymargin==='1'">已缴保证金{{item.fmarginamount}}元</i>
            </div>
            <div class="service">
              <p>服务区域：{{item.area_txt}}</p>
              <p>服务类目：{{item.fprofield_txt}}</p>
            </div>
            <div class="evl">
              <p>综合评分:<el-rate :colors="['#FEE018','#FEE018','#FEE018']" :value="parseFloat(item.overallScore)" disabled></el-rate>
              </p>
              <p>
                服务单数：
                <label class="color-blue">{{item.orderCount}}</label> 好评率：
                <label class="color-blue">{{item.applauseRate}}%</label>
              </p>
            </div>
            <el-button type="orange" size="small" v-if="tagData.master.tabactive==2" @click="tagData.master.change=[{id: item.fbillhead_id, name: item.fname}];tagData.master.visible = !1;">雇佣TA</el-button>
          </li>
        </ul>
        <el-checkbox v-model="tagData.master.checkall" @change="opClick('master-checkall')" v-if="tagData.master.tabactive==1">全选</el-checkbox>
        <template>
          <div class="text-center">
            <el-pagination @current-change="getData('master',$event)" :page-size="tagData.master.listDesc.pageSize" layout="total,  prev, pager, next, jumper" :total="tagData.master.listDesc.rows"></el-pagination>
          </div>
        </template>
        <div slot="footer">
          <el-button @click="tagData.master.visible=!1">取消</el-button>
          <el-button type="primary" @click="opClick('master')">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ImgManage from '../../../components/imagemanage';
import {billView as base} from '../../../lib';
import placeOrderPlugIn from './placeOrderPlugIn';
import {vueCityDatas} from '../../../services/city-picker.data';
const billView = {
	extends: base
};
billView.formId = 'ydj_merchantorder';
billView.plugs = [new placeOrderPlugIn({})];
billView.mixins = [
	{
		methods: {
			getData(type, data, call) {
				let t = this;
				switch (type) {
					case 'seritemprice':
						t.axios
							.post('/list/ydj_seritemprice?operationno=querydata', {
								filterString: "(fservicetype='" + t.uiData.fservicetype.id + "' and fprofield='" + t.uiData.fprofield.id + "') and  fdealerid='" + t.$store.state.userCtx.platformdealer + "'",
								pageCount: 1000,
								pageIndex: 1,
								loadingOption: {target: '.element-loading'}
							})
							.then(res => {
								let srvData = res.data.operationResult.srvData.data;
								let seritem = [];
								for (let i = 0; i < srvData.length; i++) {
									let item = srvData[i];
									let tmaterial = {id: item.fmaterial, name: item.fmaterial_fenumitem, price: item.fsellprice, unit: {id: item.funitid, name: item.funitid_fname}, fprofield: {id: item.fprofield}}; //材质
									let tseritem = seritem.find(o => {
										return o.id === item.fseritemid;
									}); //服务项目
									if (tseritem == null) {
										seritem.push({id: item.fseritemid, name: item.fseritemid_fname, material: [tmaterial]});
									} else {
										tseritem.material.push(tmaterial);
									}
								}
								t.tagData.serviceTypeData = seritem;
							});
						break;
					case 'unit':
						t.axios
							.post('/list/ydj_unit?operationno=querydata', {
								filterString: '',
								pageCount: 1000,
								pageIndex: 1,
								loadingOption: {target: '.element-loading'}
							})
							.then(res => {
								let srvData = res.data.operationResult.srvData.data;
								t.tagData.unitData = srvData;
							});
						break;
					case 'master':
						let filterStr = "fapprovestatus ='auth2'";
						if (t.tagData.master.tabactive == 1) {
							filterStr += " and fid in(select fmasterid from t_ydj_masterfavorites where fisfavorites=0 and fmerchantid='" + t.$store.state.userCtx.linkIdentity.id + "')";
						} else {
							filterStr += " and fmainorgid='" + t.$store.state.userCtx.company.companyId + "'";
						}
						if (call === true) {
							t.tagData.master.search = '';
						}
						if (call === false && t.comm.IsNullOrEmpty(t.tagData.master.search)) {
							t.$message({
								message: '您不输入点什么嘛，让我怎找！',
								type: 'warning'
							});
							return;
						}
						if (!t.comm.IsNullOrEmpty(t.tagData.master.search)) {
							filterStr += this.$util.format(" and fname like '%{0}%'", t.tagData.master.search);
						}
						t.axios
							.post('/list/ydj_master?operationno=querydata', {
								selectFields: ['fphone'],
								filterString: filterStr,
								simpleData: {fmerchantid: t.$store.state.userCtx.linkIdentity.id},
								orderByString: 'fgrade desc,fstar desc',
								pageCount: t.tagData.master.listDesc.pageCount,
								pageIndex: data || 1
							})
							.then(res => {
								let srvData = res.data.operationResult.srvData;
								t.tagData.master.listData = srvData.data;
								t.tagData.master.listDesc.rows = srvData.dataDesc.rows;
							});
						break;
				}
			},
			opChange(type, data) {
				let t = this;
				switch (type) {
					case 'itemcategory': //服务信息 服务类目下拉框
						let material = t.tagData.serviceTypeData
							.find(o => {
								return o.id == data.fseritemid.id;
							})
							.material.find(o => {
								return o.id == data.fmaterial.id;
							});
						data.fprice = material.price;
						data.funitid = material.unit.id;
						data.funitid_fname = material.unit.name;
						data.famount = material.price;
						data.fprofieldentry = material.fprofield;
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
							t.comm.ArrayRemove(t.tagData.serviceItem.imageslist, o => {
								return o.id == data;
							});
						});
						break;
					case 'showImageDialog': //展示服务信息 图片上传框
						if (t.comm.IsNullOrEmpty(t.uiData.fprofield.id)) {
							t.$message({
								message: '请先选择服务类目',
								type: 'warning'
							});
							return;
						}
						if (t.comm.IsNullOrEmpty(t.uiData.fservicetype.id)) {
							t.$message({
								message: '请先选择服务类型',
								type: 'warning'
							});
							return;
						}
						t.tagData.serviceItem.editItem = data || '';
						t.tagData.serviceItem.projectImage = t.comm.Odefault(
							t.tagData.serviceItem.imageslist.find(o => {
								return o.id === data;
							}),
							'data',
							[]
						);
						t.tagData.serviceItem.visible = !0;
						break;
					case 'formatServiceItem': //服务明细图片确定按钮
						if (t.tagData.serviceItem.projectImage.length == 0) {
							t.$message({
								message: '请耐心等待图片上传完毕',
								type: 'warning'
							});
							return false;
						}
						let entity = {
							id: _.map(t.tagData.serviceItem.projectImage, 'id').join(),
							name: _.map(t.tagData.serviceItem.projectImage, 'name').join(),
							url: _.map(t.tagData.serviceItem.projectImage, 'url').join()
						};
						if (t.comm.IsNullOrEmpty(entity.id)) {
							t.$message({
								message: '请至少上传一张图片',
								type: 'warning'
							});
							return false;
						}
						t.tagData.serviceItem.visible = !1;
						if (t.comm.IsNullOrEmpty(t.tagData.serviceItem.editItem)) {
							let gid = t.comm.Guid();
							t.tagData.serviceItem.imageslist.push({
								id: gid,
								data: t.tagData.serviceItem.projectImage
							});
							t.uiData.fserviceentry.push({
								id: gid,
								fentityimage: entity,
								fseritemid: {id: '', name: ''},
								fmaterial: {id: '', name: ''},
								fqty: 1,
								fprice: 0,
								frequire: '',
								froomno: {id: '', name: ''},
								funitid: ''
							});
						} else {
							t.uiData.fserviceentry.find(o => {
								return o.id === t.tagData.serviceItem.editItem;
							}).fentityimage = entity;
							t.tagData.serviceItem.imageslist.find(o => {
								return o.id === t.tagData.serviceItem.editItem;
							}).data = t.tagData.serviceItem.projectImage;
						}
						break;
					case 'save': //保存或提交按钮
						t.uiData.forderdate = new Date((t.uiData.forderdate instanceof Date ? t.uiData.forderdate : new Date()).setHours(8));
						if (t.uiData.fexpectedarrivaldate instanceof Date) {
							t.uiData.fexpectedarrivaldate = new Date(t.uiData.fexpectedarrivaldate.setHours(8));
						}
						t.$refs['uiData'].validate(valid => {
							if (!valid) {
								t.$message({
									message: '请完善当前订单信息',
									type: 'warning'
								});
								return false;
							}
							if (t.uiData.fservicetype.id == 'fres_type_03') {
								t.uiData.fserviceentry = [
									{
										fentityimage: '',
										fseritemid: {id: '200000000000001026', name: '其它'},
										fmaterial: {id: 'material_33', name: '其它'},
										fqty: 1,
										fprice: 0,
										famount: 0,
										frequire: ''
									}
								];
							}
							if (t.comm.IsNullOrEmpty(t.uiData.fserviceentry) || t.uiData.fserviceentry.length == 0) {
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
							if (['fres_type_01', 'fres_type_03'].indexOf(t.uiData.fservicetype.id) > -1) {
								t.uiData.foffertype.id = 'offer_type_02';
							} else {
								t.uiData.flogistics = '';
								t.uiData.flogisticsno = '';
								t.uiData.fcollectadd = '';
								t.uiData.fcollectrel = '';
								t.uiData.fcollectpho = '';
								t.uiData.fpieces = 0;
								t.uiData.fshippingamount = 0;
								t.uiData.fispay = false;
								t.uiData.felevator = 0;
							}
							if (!t.comm.IsNullOrEmpty(t.tagData.master.change)) {
								t.uiData.fmasterid = {id: t._.map(t.tagData.master.change, 'id').join(), name: t._.map(t.tagData.master.change, 'name').join()};
								t.uiData.fisappointedorder = 1;
							}
							t.menuItemClick({opcode: 'save', event: 'uiData'});
						});
						break;
					case 'master':
						t.tagData.master.listData.forEach(o => {
							if (o.check == true) {
								let ch = t.tagData.master.change.find(a => {
									return a.id == o.fbillhead_id;
								});
								if (ch == null) {
									t.tagData.master.change.push({id: o.fbillhead_id, name: o.fname});
								}
							}
						});
						t.tagData.master.visible = !1;
						break;
					case 'master-del':
						t.$confirm('您确定移除该项？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							t.comm.ArrayRemove(t.tagData.master.change, o => {
								return o.id == data;
							});
						});
						break;
					case 'master-checkall':
						t.tagData.master.listData = t.tagData.master.listData.map(o => {
							o.check = t.tagData.master.checkall;
							return o;
						});
						break;
					default:
						break;
				}
			}
		},
		components: {ImgManage},
		computed: {
			Profield() {
				if (!this.comm.IsNullOrEmpty(this.uiData.fprofield)) {
					return this.uiData.fprofield.id;
				}
			},
			serviceType() {
				if (!this.comm.IsNullOrEmpty(this.uiData.fservicetype)) {
					return this.uiData.fservicetype.id;
				}
			},
			city() {
				return this.tagData.city;
			},
			appointed() {
				if (!this.comm.IsNullOrEmpty(this.tagData.master)) {
					return this.tagData.master.tabactive;
				}
			},
			masterCh() {
				return this.uiData.fmasterid;
			}
		},
		watch: {
			city(v) {
				this.uiData.fprovince = {id: v[0] || ''};
				this.uiData.fcity = {id: v[1] || ''};
				this.uiData.fregion = {id: v[2] || ''};
			},
			serviceType(v) {
				if (['fres_type_01', 'fres_type_03'].indexOf(v) > -1) {
					this.uiData.foffertype.id = 'offer_type_02';
					this.tagData.serviceTypeMessage = '目前配送类服务只支持“师傅报价”模式，暂不支持“一口价”';
				} else {
					this.tagData.serviceTypeMessage = '';
				}
				this.getData('seritemprice');
			},
			Profield(v) {
				if (!this.comm.IsNullOrEmpty(v) && this.tagData.isLoad) {
					this.uiData.fservicetype.id = '';
				}
			},
			appointed(v) {
				this.tagData.master.change = [];
			},
			masterCh(v) {
				if (!this.comm.IsNullOrEmpty(v.id) && this.tagData.isLoad) {
					let _id = v.id.split(',');
					let _name = v.name.split(',');
					let _arr = [];
					for (var i = 0; i < _id.length; i++) {
						_arr.push({id: _id[i], name: _name[i]});
					}
					this.tagData.master.change = _arr;
				}
			}
		}
	}
];
export default billView;
</script>
<style lang="scss">
.sologo {
	background-color: #fdf6ec;
	padding: 10px;
	color: #e6a23c;
}
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
	.radio-border {
		& > * {
			margin-right: 10px;
		}
	}
	.serviceicon {
		& > * {
			width: 100px;

			padding-bottom: 5px;
			line-height: 20px;
			font-size: 12px;
		}

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
		.icon-profield-5 {
			background-position: -546px -234px;
		}
		.icon-profield-6 {
			background-position: -626px -234px;
		}
		.icon {
			width: 70px;
			height: 70px;
			display: block;
			margin: 10px auto 0 auto;
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
	.city_box {
		display: inline-block;
	}
	.city_box,
	.el-select,
	.el-input {
		width: 200px;
	}
	.input-address {
		width: 372px;
	}
	.i8 {
		width: 100px;
		.el-input {
			width: 100px;
		}
	}
	.service-item {
		border: 1px solid #e7e7e7;
		padding: 20px 20px 20px 34px;
		margin-bottom: 20px;
		font-size: 0;
		& > div {
			display: inline-block;
			vertical-align: top;
			font-size: 14px;
			margin-right: 10px;
			& > * {
				margin-bottom: 20px;
				min-height: 40px;
				&:last-child {
					margin-bottom: 0;
				}
			}
			label {
				width: 80px;
				display: inline-block;
				padding-right: 14px;
				text-align: right;
				&.vt {
					vertical-align: top;
					line-height: 32px;
				}
				&.unit {
					width: 48px;
					padding: 0;
				}
			}
		}
		.item-tools {
			padding: 10px 0;
			font-size: 18px;
			text-align: right;
			width: 150px;
		}
		.item-tools .el-icon-delete {
			font-size: 24px;
			color: #bbbbbb;
			margin: 20px 15px 0 0;
		}
		.el-select,
		.el-input,
		.el-input-number {
			width: 149px;
		}
		.input-price {
			width: 100px;
			.el-input {
				width: 100px;
			}
		}
		.el-textarea {
			width: 455px;
		}

		.img-panel {
			width: 80px;
			height: 80px;
			box-sizing: content-box;
			border: 1px solid #e7e7e7;
			position: relative;
			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
				width: 0;
				height: 0;
				border-top: 26px solid #409eff;
				border-right: 26px solid transparent;
			}
			&::after {
				content: attr(data-count);
				position: absolute;
				top: 0;
				left: 0;
				z-index: 2;
				display: block;
				color: #fff;
				font-size: 12px;
				line-height: 20px;
				width: 26px;
				height: 26px;
				text-indent: 4px;
				text-align: left;
			}
			& > img {
				width: 80px;
				height: 80px;
			}
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
	.tips {
		color: #3696ed;
		background-color: #e2f3ff;
		padding: 10px 20px;
		line-height: 1.8;
	}
	.tab {
		& > * {
			background-color: #fff;
			border: 1px solid #ccc;
			border-radius: 4px 4px 0 0;
			border-bottom: 1px solid #ff6d22;
			&.is-active {
				border-color: #ff6d22;
				color: #ff6d22;
				border-bottom: 1px solid #fff;
			}
		}
	}
	.tab-panel {
		border: 1px solid #ff6d22;
		padding: 10px;
		a {
			height: 33px;
			line-height: 33px;
			border: 1px dashed #ff6d22;
			display: inline-block;
			padding: 0 12px;
			color: #ff6d22;
		}
		em {
			height: 35px;
			line-height: 35px;
			display: inline-block;
			background-color: #ff6d22;
			color: #fff;
			padding: 0 12px;
			margin-right: 10px;
			border-radius: 4px;
			position: relative;
			i {
				position: absolute;
				right: -5px;
				top: -5px;
				border-radius: 50%;
				background-color: #ccc;
				color: #fff;
				cursor: pointer;
			}
		}
	}
	.el-pagination__editor.el-input {
		width: 50px;
	}
	.master {
		li {
			font-size: 0;
			padding: 10px;
			border: 1px solid #e8e8e8;
			position: relative;
			margin-bottom: 15px;
			& > * {
				display: inline-block;
				font-size: 14px;
				vertical-align: top;
			}
			.head {
				width: 112px;
				height: 112px;
				overflow: hidden;
				border-radius: 50%;
				border: 1px solid #e8e8e8;
				margin: 0 25px 0 15px;
				cursor: pointer;
				img {
					width: 100%;
				}
			}
			.base {
				width: 200px;
				h5 {
					font-size: 16px;
					line-height: 28px;
					font-weight: bold;
					margin-bottom: 18px;
					cursor: pointer;
				}
				p {
					margin-bottom: 18px;
				}
			}
			.service {
				width: 260px;
				padding-right: 40px;
				p {
					margin: 8px 0;
				}
			}
			.evl {
				width: 280px;
				p {
					margin: 8px 0;
				}
			}
			.el-button {
				position: absolute;
				right: 10px;
				top: 40px;
			}
		}
	}
}
</style>