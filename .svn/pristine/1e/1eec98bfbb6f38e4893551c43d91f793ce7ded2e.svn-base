<template>
  <div>
    <BreadCrumb :data=" [{ a: '订单管理', b: { path: '/order', name: 'order', params: { tab: $store.state.pageStatus.orderTab } } }, { a: '订单详情' }]"></BreadCrumb>
    <div class="main-content w block-center orderdetail" v-if="!comm.IsNullOrEmpty(uiData.fservicetype)">
      <OrderEvaluate :visible.sync="tagData.evaluate.visible" :order="uiData.id" @successEvent="opClick('evaluateSuccess',$event)" @closeEvent="opClick('evaluateExit')"></OrderEvaluate>
      <el-steps :active="progress.a" align-center finish-status="success">
        <el-step v-for="item in steps" :key="item.a" :title="item.a" :description="item.b"></el-step>
      </el-steps>
      <div class="state-operation">
        <div class="relative">
          <h4>{{uiData.fprofield.name}} | {{uiData.fservicetype.fenumitem}}<span class="color-blue" v-html="progress.m"></span></h4>
          <p class="absolute right top font12" v-if="!comm.IsNullOrEmpty(tagData.linkSrvBillData)&&uiData.fserstatus.id!=='sht_serstatus08'">
            服务商：<em class="color-orange">{{tagData.linkSrvBillData[0].fmasterid_fname}}</em><i class="icon-complain" @click="opClick('complain')" v-if="['sht_serstatus06','sht_serstatus07','sht_serstatus12','sht_serstatus13','sht_serstatus16'].indexOf(uiData.fserstatus.id)>-1">诉</i>
            <span v-if="uiData.fserstatus.id!=='sht_serstatus11'">联系电话：<em class="color-orange">{{tagData.linkSrvBillData[0].fmasterid_fphone}}</em></span>
            <span>订单金额：<em class="color-orange">{{uiData.fexpectamount}}元</em></span>
          </p>
        </div>
        <p class="font12">
          订单编号：{{uiData.fbillno}}<span>订单日期：{{uiData.fcreatedate}}</span>
          <span>
            <a href="javascript:void(0)" class="color-orange" v-for="item in progress.mb" :key="item.b" @click="opClick(item.b)">{{item.a}}</a>
          </span>
        </p>
      </div>
      <Agreement title="第三方责任险协议" :visible.sync="tagData.thirdVisible" show="third"></Agreement>
      <el-tabs type="card" v-model="tagData.tabActive">
        <el-tab-pane label="订单详情" name="one">
          <div class="border content-panel" v-if="['sht_serstatus06','sht_serstatus07','sht_serstatus08','sht_serstatus12','sht_serstatus13','sht_serstatus16'].indexOf(uiData.fserstatus.id)>-1">
            <div class="title">付款信息</div>
            <p>付款类型：{{tagData.fpurpose}}<span>付款状态：{{tagData.fbizstatus}}</span><span>付款方式：{{tagData.fway}}</span><span>订单金额：<em class="color-orange">{{uiData.fexpectamount}}元</em></span></p>
          </div>
          <div class="border content-panel" v-if="['sht_serstatus06','sht_serstatus07','sht_serstatus08','sht_serstatus12','sht_serstatus13','sht_serstatus16'].indexOf(uiData.fserstatus.id)>-1">
            <div class="title">第三方责任险保单详情</div>
            <p>保单状态：<em class="color-orange">投保成功</em><em class="color-grey">（师傅上门签到后生效）</em></p>
            <p>购买费用：<em class="color-red">0.00元</em> <em class="color-red delete-line">3.00元</em><em class="color-grey"> (免费赠送）</em></p>
            <p>理赔说明：保障第三方（客户）人身、财产安全、免除商家后顾之忧，最高可享5万元保障。 <a class="color-orange" href="javascript:void(0)" @click="tagData.thirdVisible=!0">了解详情>></a></p>
          </div>
          <div class="order-message border">
            <div>
              <div class="title">客户信息</div>
              <p>客户姓名：{{uiData.fname}}</p>
              <p>联系电话：{{uiData.fphone}}</p>
              <p class="border-bottom-dashed padding-bottom">客户地址：{{uiData.fcusaddress}}</p>
              <div class="title margin-top">紧急联系方式</div>
              <p>紧急联系人：{{uiData.furgentname}}　　联系电话：{{uiData.furgentphone}}</p>
            </div>
            <div v-if="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1">
              <div class="title">物流信息</div>
              <div>
                <p>物流单号：({{uiData.flogistics}}){{uiData.flogisticsno}}</p>
                <p>提货地址：{{uiData.fcollectadd}}</p>
                <p>提货电话：{{uiData.fcollectpho}}</p>
                <p>包装件数：{{uiData.fpieces}}</p>
                <p>代付金额：{{uiData.fshippingamount}}元</p>
              </div>
            </div>
            <div>
              <div class="title">服务需求</div>
              <p>到货情况：{{uiData.fisarrival===true?'已':'未'}}到货</p>
              <p>预计到货时间：{{comm.DateToString(comm.toDate(uiData.fexpectedarrivaldate))}}</p>
              <p>期望服务日期：{{uiData.forderdate}}</p>
              <p>订单备注：{{uiData.fcareful}}</p>
            </div>
          </div>
          <div v-if="uiData.fservicetype.id!='fres_type_03'">
            <div class="title">订单列表</div>
            <table cellpadding="0" cellspacing="0" class="table theme-bluegray margin-v">
              <colgroup>
                <col width="120">
                <col width="120">
                <col width="120">
                <col width="120">
                <col width="160">
                <col width="160">
                <col width="340">
              </colgroup>
              <tr>
                <th>商品图片</th>
                <th>房型/类目/材料 </th>
                <th>数量</th>
                <th>单位</th>
                <th>单价</th>
                <th>金额</th>
                <th>特殊要求</th>
              </tr>
              <tr :key="item.id" v-for="item in uiData.fserviceentry">
                <td>
                  <ImgRender class="margin-v" type="marker" :source="item.fentityimage.id"></ImgRender>
                </td>
                <td>{{item.froomno.fname}}<br />{{item.fseritemid.fname}}<br />{{item.fmaterial.fname}}</td>
                <td>{{item.fqty}}</td>
                <td>{{item.funitid.fname}}</td>
                <td>{{item.fprice.toFixed(2)}}</td>
                <td>{{item.famount.toFixed(2)}}</td>
                <td>{{item.frequire}}</td>
              </tr>
            </table>
          </div>
          <div class="text-right amount-total">
            <p>订单费用：<span>¥{{parseInt(comm.Odefault(uiData.amountlist.find(o=>{return o.famounttype=='amounttype_1'}),'famount','0')).toFixed(2)}}</span></p>
            <div v-if="uiData.foffertype.id!=='offer_type_02'">
              <p v-if="uiData.amountlist.find(o=>{return o.famounttype=='amounttype_6'})!=null"><em>惠</em>现金券：<span>¥-{{parseInt(comm.Odefault(uiData.amountlist.find(o=>{return o.famounttype=='amounttype_6'}),'famount','0')).toFixed(2)}}</span></p>
              <p v-if="uiData.amountlist.find(o=>{return o.famounttype=='amounttype_7'})!=null">运送保险：<span>¥{{parseInt(comm.Odefault(uiData.amountlist.find(o=>{return o.famounttype=='amounttype_7'}),'famount','0')).toFixed(2)}}</span></p>
              <p v-if="uiData.amountlist.find(o=>{return o.famounttype=='amounttype_8'})!=null"><em>赠</em>第三方责任险：<span class="delete-line">¥{{parseInt(comm.Odefault(uiData.amountlist.find(o=>{return o.famounttype=='amounttype_8'}),'famount','0')).toFixed(2)}}</span></p>
			  <p style="font-size:18px;margin-top:30px;color: #666;font-weight:500px">实付金额：<span>¥{{parseInt(comm.Odefault(uiData.amountlist.find(o=>{return o.famounttype=='amounttype_1'}),'famount','0')).toFixed(2)}}</span></p>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="师傅报价" name="two" v-if="tagData.tabs.master">
          <el-dialog title="报价详情" :visible.sync="tagData.offer.visible" center>
            <table cellpadding="0" cellspacing="0" class="offer-table">
              <colgroup>
                <col width="190">
                <col width="160">
                <col width="120">
                <col width="150">
              </colgroup>
              <tbody v-if="uiData.fservicetype.id!='fres_type_03'">
                <tr>
                  <th colspan="4">安装服务项目</th>
                </tr>
                <tr class="bottom-solid">
                  <td>类型</td>
                  <td>数量</td>
                  <td>报价</td>
                  <td align="right">金额</td>
                </tr>
                <tr v-for="item in tagData.offer.detail.fserviceentry" :key="item.fid">
                  <td>{{item.fseritemidName}}</td>
                  <td>x{{item.fqty}}</td>
                  <td>¥{{item.fprice+"/"+item.funitName}}</td>
                  <td align="right">¥{{comm.priceSum(item.fprice*item.fqty,2)}}</td>
                </tr>
              </tbody>
              <tbody v-if="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1">
                <tr>
                  <th colspan="4">物流服务项目</th>
                </tr>
                <tr>
                  <td colspan="3">物流运费</td>
                  <td align="right">¥{{tagData.offer.detail.ffreightamount}}</td>
                </tr>
                <tr>
                  <td colspan="3">平移搬运费</td>
                  <td align="right">¥{{tagData.offer.detail.fhandlingamount}}</td>
                </tr>
                <tr>
                  <td colspan="3">抬楼费</td>
                  <td align="right">¥{{tagData.offer.detail.fliftbuildamount}}</td>
                </tr>
                <tr>
                  <td colspan="3">代付运费</td>
                  <td align="right">¥{{tagData.offer.detail.fshippingamount}}</td>
                </tr>
              </tbody>
              <tr class="bottom-solid">
                <td class="bold">合计金额</td>
                <td class="color-blue" align="right" colspan="3">¥{{tagData.offer.detail.fquotationamount}}</td>
              </tr>
              <tr class="bottom-solid">
                <td colspan="4">报价说明: {{tagData.offer.detail.fdescription}}</td>
              </tr>
              <tr v-if="tagData.offer.detail.fmasterinfo.fispledge&&uiData.fservicetype.id!='fres_type_03'" class="pledge">
                <td colspan="4">服务承诺：<i></i>空跑费{{tagData.offer.detail.fmasterinfo.femptyrunfee}}元<i></i>免费售后{{tagData.offer.detail.fmasterinfo.faftersale}}个月<i></i>免费上{{tagData.offer.detail.fmasterinfo.ffeeupstairs}}楼</td>
              </tr>
              <tr>
                <td colspan="4">报价有效期：{{tagData.offer.detail.fvaliditydate}}天 最快出发时间：{{tagData.offer.detail.ffastestdate}}</td>
              </tr>
            </table>
          </el-dialog>
          <p class="panel-fe margin-bottom"><i class="icon icon-bao"></i>请优先选择缴纳保证金的师傅</p>
          <ul class="master-list">
            <li v-for="item in tagData.offer.masterOffer" :key="item.fid">
              <div class="master-head" @click="$router.push({path: '/master/detail',query: {id: item.fmasterid}});">
                <ImgRender type="headPort" :source="item.fimage"></ImgRender>
              </div>
              <div class="master-info">
                <h5 @click="$router.push({path: '/master/detail',query: {id: item.fmasterid}});">{{item.fname}}</h5>
                <i class="icon icon-bond" v-if="item.fispaymargin">{{item.fmarginamount}}元</i>
                <a class="color-blue" v-if="item.fispledge">服务承诺 &gt;</a>
              </div>
              <div class="master-score">
                <p>综合评分:<el-rate :colors="['#FEE018','#FEE018','#FEE018']" :value="parseFloat(item.overallScore)" disabled></el-rate>
                </p>
                <p>
                  服务单数：
                  <label class="color-blue">{{item.orderCount}}</label> 好评率：
                  <label class="color-blue">{{item.applauseRate}}%</label>
                </p>
              </div>
              <div class="master-offer">
                <p>
                  报价:
                  <span class="color-red">¥{{item.fquotationamount}}</span>
                </p>
                <p>
                  <a class="color-blue" href="javascript:void(0)" @click="getData('offerDetail',item.fid)">查看报价详情&gt;</a>
                </p>
                <el-button class="style-orange" type="mini" @click="opClick('offerMaster',item)" v-if="uiData.fserstatus.id=='sht_serstatus10'">雇佣他</el-button>
              </div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="服务过程" name="three" v-if="tagData.tabs.order">
          <div v-for="billItem in tagData.linkSrvBillData" :key="billItem.fbillhead_id">
            <table class="table-border">
              <colgroup>
                <col width="378">
                <col width="378">
                <col width="380">
              </colgroup>
              <tr>
                <td>类　　型：{{billItem.fservicetype_fenumitem}}</td>
                <td>服务单号：{{billItem.fbillno}}</td>
                <td>状　　态：{{billItem.fserstatus_feunmitem}}</td>
              </tr>
              <tr>
                <td>师　　傅：{{billItem.fmasterid_fname}}</td>
                <td>师傅电话：{{billItem.fmasterid_fphone}}</td>
                <td>预约时间：{{billItem.fsubscribedate}}</td>
              </tr>
              <tr v-if="tagData.tabs.done">
                <td>客户评分：<el-rate :colors="['#FEE018','#FEE018','#FEE018']" :value="parseFloat(billItem.fqualstar_fenumitem)" disabled></el-rate>
                </td>
                <td colspan="2">客户评价：{{billItem.fqual_txt}}</td>
              </tr>
              <tr v-if="tagData.dealerStar>0">
                <td>您的评分：<el-rate :colors="['#FEE018','#FEE018','#FEE018']" :value="parseFloat(tagData.dealerStar)" disabled></el-rate>
                </td>
                <td colspan="2">您的评价：{{uiData.fqual.name}}</td> 　
              </tr>
            </table>
            <div v-if="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1">
              <div class="title border-bottom-solid margin-v">提货情况</div>
              <table cellpadding="0" cellspacing="0" class="table theme-gray">
                <colgroup>
                  <col width="380">
                  <col width="380">
                  <col width="380">
                </colgroup>
                <tr align="left">
                  <th>提货图片</th>
                  <th>异常提货图片</th>
                  <th>备注说明</th>
                </tr>
                <tr align="left">
                  <td>
                    <ImgRender type="list" class="done" :source="billItem.fnormalimg"></ImgRender>
                  </td>
                  <td>
                    <ImgRender type="list" class="done" :source="billItem.ferrorimg"></ImgRender>
                  </td>
                  <td>{{billItem.fcollectdesc}}</td>
                </tr>
              </table>
            </div>
            <div v-if="tagData.tabs.done&&(!comm.IsNullOrEmpty(billItem.fwlnote)||!comm.IsNullOrEmpty(billItem.fnote))">
              <div class="title border-bottom-solid margin-v">完工汇报</div>
              <table cellpadding="0" cellspacing="0" class="table theme-gray margin-bottom" v-if="['fres_type_01','fres_type_03'].indexOf(uiData.fservicetype.id)>-1">
                <colgroup>
                  <col width="380">
                  <col width="380">
                  <col width="376">
                </colgroup>
                <tr align="left">
                  <th>服务类目</th>
                  <th>完工时间</th>
                  <th>完工图片</th>
                </tr>
                <tr align="left">
                  <td>物流</td>
                  <td>{{billItem.fwlreportdate}}</td>
                  <td>
                    <ImgRender type="list" class="done" :source="billItem.fwldoneimage"></ImgRender>
                  </td>
                </tr>
                <tr align="left" class="lineheight-three">
                  <td colspan="3"><span class="bold">完工说明：</span>{{billItem.fwlnote}}</td>
                </tr>
              </table>
              <table cellpadding="0" cellspacing="0" class="table theme-gray" v-if="'fres_type_03'!=uiData.fservicetype.id">
                <colgroup>
                  <col width="380">
                  <col width="380">
                  <col width="376">
                </colgroup>
                <tr align="left">
                  <th>服务类目</th>
                  <th>完工时间</th>
                  <th>完工图片</th>
                </tr>
                <tr align="left" v-for="(item,index) in JSON.parse(billItem.finishItem||'[]')" :key="index">
                  <td>{{item.fitemname}}</td>
                  <td>{{billItem.freportdate}}</td>
                  <td>
                    <ImgRender type="list" class="done" :source="item.fproductdoneimage"></ImgRender>
                  </td>
                </tr>
                <tr align="left" class="lineheight-three">
                  <td colspan="3"><span class="bold">完工说明：</span>{{billItem.fnote}}</td>
                </tr>
              </table>
              <div class="title border-bottom-solid margin-v">
                反馈记录
                <router-link v-if="tagData.tabs.feedbackBtn" :to="{path:'/order/cre-problem',query:{orderId:uiData.id}}">反馈</router-link>
              </div>
              <table cellpadding="0" cellspacing="0" class="table theme-gray lineheight-three">
                <colgroup>
                  <col width="370">
                  <col width="340">
                  <col width="240">
                  <col width="190">
                </colgroup>
                <tr>
                  <th>反馈问题</th>
                  <th>问题描述</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr v-for="item in tagData.feedData" :key="item.fbillhead_id">
                  <td>{{item.fsprotype_fenumitem}}</td>
                  <td>{{item.fprodesript}}</td>
                  <td>{{item.fhandlestatus_fenumitem}}</td>
                  <td>
                    <router-view :to="{path:'/order/det-problem',query:{id:item.fbillhead_id}}">查看</router-view>
                  </td>
                </tr>
              </table>
            </div>
            <div class="title border-bottom-solid margin-v">
              投诉记录
              <router-view v-if="tagData.tabs.complainBtn" :to="{path:'/droit/cre-complain',query:{orderId:uiData.id}}">投诉</router-view>
            </div>
            <table cellpadding="0" cellspacing="0" class="table theme-gray lineheight-three">
              <colgroup>
                <col width="370">
                <col width="340">
                <col width="240">
                <col width="190">
              </colgroup>
              <tr>
                <th>投诉内容</th>
                <th>投诉说明</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              <tr v-for="item in tagData.complainData" :key="item.fbillhead_id">
                <td>{{item.fcomplaintitem_fname}}</td>
                <td>{{item.fcomplain}}</td>
                <td>{{item.fcomplainstatus_fenumitem}}</td>
                <td>
                  <router-view :to="{path:'/droit/det-complain',query:{id:item.fbillhead_id}}">查看</router-view>
                </td>
              </tr>
            </table>
            <div v-if="tagData.tabs.refund">
              <div class="title border-bottom-solid margin-v">
                退款记录
                <router-view v-if="tagData.tabs.refundBtn&&tagData.refundData.length==0" :to="{path:'/droit/cre-refund',query:{orderId:uiData.id}}">查看</router-view>
              </div>
              <table cellpadding="0" cellspacing="0" class="table theme-gray lineheight-three">
                <colgroup>
                  <col width="370">
                  <col width="340">
                  <col width="240">
                  <col width="190">
                </colgroup>
                <tr>
                  <th>退款原因</th>
                  <th>退款说明</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr v-for="item in tagData.refundData" :key="item.fbillhead_id">
                  <td align="center">{{item.fchangereasonenum_fenumitem}}</td>
                  <td align="center">{{item.frefundreason}}</td>
                  <td align="center">{{item.frefundstatus_fenumitem}}</td>
                  <td align="center">
                    <router-view :to="{path:'/droit/det-refund',query:{id:item.fbillhead_id}}">查看</router-view>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="text-center">
        <el-button type="orange" size="small" class="margin-top" @click="$router.push({ path: '/order', name: 'order', params: { tab: $store.state.pageStatus.orderTab } })">返回订单列表</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import OrderEvaluate from '../../../components/orderevaluate';
import {billView as base} from '../../../lib';
import orderDetailPlugIn from './orderDetailPlugIn';
const billView = {
	extends: base
};
billView.formId = 'ydj_merchantorder';
billView.plugs = [new orderDetailPlugIn({})];
billView.mixins = [
	{
		methods: {
			getData(type, data) {
				let t = this;
				switch (type) {
					case 'operateDate': //状态操作时间
						return t.comm.Odefault(t.tagData.statusNodeInfo.find(o => o.status.toLowerCase() === data), 'opdate');
					case 'loadOffer': //师傅报价数据
						t.axios.post('/bill/ydj_quotation?operationno=getQuotationList', {loadingOption: {target: '.element-loading'}, simpleData: {orderId: t.uiData.id}}).then(res => {
							t.tagData.offer.masterOffer = res.data.operationResult.srvData.datas;
						});
						break;
					case 'offerDetail': //师傅报价明细数据
						t.axios.post('/bill/ydj_quotation?operationno=GetQuotationDetail', {selectedRows: [{pkValue: data}]}).then(res => {
							t.tagData.offer.visible = !0;
							let srvData = res.data.operationResult.srvData;
							t.tagData.offer.detail = srvData;
						});
						break;
					case 'feedback': //问题反馈数据
						t.axios.post('/list/ser_servicefeed.json?operationno=querydata', {filterString: t.$util.format("fdealerid='{0}'  AND (fmerbill='{1}')", t.$store.state.userCtx.linkIdentity.id, t.uiData.fbillno)}).then(res => {
							t.tagData.feedData = res.data.operationResult.srvData.data;
						});
						break;
					case 'complain': //投诉数据
						t.axios.post('/list/ser_complaintrecord.json?operationno=querydata', {filterString: t.$util.format("fmerchantid='{0}' and (fmerorderid='{1}')", t.$store.state.userCtx.linkIdentity.id, t.uiData.id)}).then(res => {
							t.tagData.complainData = res.data.operationResult.srvData.data;
						});
						break;
					case 'refund': //退款数据
						t.axios.post('/list/ser_refund.json?operationno=querydata', {filterString: t.$util.format("fdealerid='{0}' and (fmerbill='{1}')", t.$store.state.userCtx.linkIdentity.id, t.uiData.fbillno)}).then(res => {
							let resp = res.data.operationResult.srvData.data;
							if (resp instanceof Array) {
								t.tagData.refundData = resp.filter(o => {
									return !t.comm.IsNullOrEmpty(o.fbillno);
								});
							}
						});
						break;
				}
			},
			opClick(type, data) {
				let t = this;
				switch (type) {
					case 'exitOrder': //取消订单
						t.$confirm('确定取消订单吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.invokeFormOperation({
									formId: t.formCtx.formId,
									opcode: 'sht_cancelbill',
									param: {
										selectedRows: [
											{
												pkValue: (this.$route.query || {}).id
											}
										]
									}
								}).then(res => {
									t.$router.push({path: '/order', query: {type: 'ExOrder'}});
								});
							})
							.catch(() => {});
						break;
					case 'lookPrice': //查看报价
						t.tagData.tabActive = 'two';
						break;
					case 'offerMaster': //雇佣师傅
						t.$confirm('成功托管费用后，师傅在4小时内联系客户预约上门时间，您也可以查看到师傅的联系方式，选择师傅雇佣后不可更换师傅！如果您对师傅不满意或其它原因不安装可以申请退款！', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.axios.post('/bill/ydj_quotation?operationno=agree', {loadingOption: {target: '.element-loading'}, selectedRows: [{pkValue: data.fid}]}).then(res => {
									if (res.data.operationResult.isSuccess) {
										t.comm.OrderPay({
											id: t.uiData.id,
											price: data.fquotationamount,
											formId: 'ydj_merchantorder',
											type: 'merchantorder',
											islogistics: t.$store.state.userCtx.isPlatform && ['fres_type_01', 'fres_type_03'].indexOf(t.uiData.fservicetype.id) > -1,
											other: {
												service: {No: t.uiData.fbillno},
												consumer: {name: t.uiData.fname, phone: t.uiData.fphone, address: t.uiData.fcusaddress}
											}
										});
									}
								});
							})
							.catch(() => {});
						break;
					case 'payOrder': //订单支付
						t.comm.OrderPay({
							id: t.uiData.id,
							price: t.uiData.fexpectamount,
							formId: 'ydj_merchantorder',
							type: 'merchantorder',
							islogistics: t.$store.state.userCtx.isPlatform && ['fres_type_01', 'fres_type_03'].indexOf(t.uiData.fservicetype.id) > -1,
							other: {
								service: {No: t.uiData.fbillno},
								consumer: {name: t.uiData.fname, phone: t.uiData.fphone, address: t.uiData.fcusaddress}
							}
						});
						break;
					case 'exitPay': //取消支付
						t.$confirm('确定取消支付订单吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.axios.post('/list/ydj_merchantorder?operationno=cancelPay', {loadingOption: {target: '.element-loading'}, selectedRows: [{pkValue: t.uiData.id}]}).then(res => {
									this.initUiModel({}).then(res => {
										this.afterLoadModelData(this);
									});
								});
							})
							.catch(() => {});
						break;
					case 'applyRefund': //申请退款
						t.$router.push({
							path: '/droit/cre-refund',
							query: {
								orderId: t.uiData.id
							}
						});
						break;
					case 'complain': //投诉
						t.$router.push({
							path: '/droit/cre-complain',
							query: {
								orderId: t.uiData.id
							}
						});
						break;
					case 'feedback': //问题反馈
						t.$router.push({
							path: '/order/cre-problem',
							query: {
								orderId: t.uiData.id
							}
						});
						break;
					case 'acceptOrder': //验收
						t.$confirm('确定验收吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.opClick('acceptBill');
							})
							.catch(() => {});
						break;
					case 'acceptBill': //验收数据提交
						t.invokeFormOperation({
							formId: t.formCtx.formId,
							opcode: 'sht_acceptbill',
							param: {
								selectedRows: [
									{
										pkValue: t.uiData.id
									}
								],
								simpleData: {examinCode: data}
							}
						}).then(res => {
							if (t.comm.IsNullOrEmpty((res.response.operationResult.srvData || {examinCode: ''}).examinCode)) {
								t.tagData.evaluate.visible = !0;
							} else {
								t.$confirm(res.response.operationResult.srvData.titleStr, '操作提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								})
									.then(() => {
										t.opClick('acceptBill', res.response.operationResult.srvData.examinCode);
									})
									.catch(() => {});
							}
						});
						break;
					case 'assess': //评价窗口显示
						t.tagData.evaluate.visible = !0;
						break;
					case 'evaluateSuccess':
						this.initUiModel({}).then(res => {
							this.afterLoadModelData(this);
							t.tagData.tabActive = 'three';
						});
						break;
					case 'evaluateExit':
						this.initUiModel({}).then(res => {
							this.afterLoadModelData(this);
						});
						break;
					case 'renew': //重新生成未完成的订单
						t.$confirm('确定将未完成的项目重新下单吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
							.then(() => {
								t.axios.post('/bill/ydj_merchantorder?operationno=releaseorder', {selectedRows: [{pkValue: t.uiData.id}]}).then(res => {
									t.$router.push({path: '/order/pre-order', query: {id: res.data.operationResult.srvData}});
								});
							})
							.catch(() => {});
						break;
				}
			}
		},
		computed: {
			progress() {
				let _mb = [];
				switch (this.comm.Odefault(this.uiData.fserstatus, 'id')) {
					case 'sht_serstatus01':
						if (this.uiData.fisrepublish != 1) {
							_mb.push({a: '重新发布', b: 'renew'});
						}
						return {a: 2, m: '订单已取消', mb: _mb};
					case 'sht_serstatus03':
						return {
							a: 1,
							m: '订单已提交，等待师傅报价',
							mb: [{a: '取消订单', b: 'exitOrder'}]
						};
					case 'sht_serstatus06':
						if (this.tagData.refundData.length == 0 && this.uiData.fservicetype.id !== 'fres_type_03') {
							_mb.push({a: '申请退款', b: 'applyRefund'});
						}
						return {
							a: 4,
							m: this.uiData.fishang == 1 ? '该订单已挂起，原因：' + this.uiData.fhang : '师傅正在服务中。请耐心等待...',
							mb: _mb
						};
					case 'sht_serstatus07':
						_mb = [{a: '验收', b: 'acceptOrder'}, {a: '反馈', b: 'feedback'}];
						if (this.tagData.refundData.length == 0 && this.uiData.fservicetype.id !== 'fres_type_03') {
							_mb.push({a: '申请退款', b: 'applyRefund'});
						}
						return {
							a: 4,
							m: '师傅已提交完工申请，您可以验收了',
							mb: _mb
						};
					case 'sht_serstatus08':
						if (this.tagData.dealerStar == 0) {
							_mb.push({a: '评价', b: 'assess'});
						}
						if (
							this.tagData.refundData.length == 0 ||
							this.uiData.fserviceentry.find(o => {
								return o.fisrefundmoney === '1';
							})
						) {
							_mb.push({a: '重新发布未完成项目', b: 'renew'});
						}
						return {
							a: 5,
							m: '验收完成',
							mb: _mb
						};
					case 'sht_serstatus10':
						return {
							a: 2,
							m: '师傅已报价，等待选择师傅并托管费用',
							mb: [{a: '查看报价', b: 'lookPrice'}, {a: '取消订单', b: 'exitOrder'}]
						};
					case 'sht_serstatus11':
						return {
							a: 2,
							m: '已选择师傅，请尽快支付费用 <em class="color-red">' + this.uiData.fexpectamount + '元</em>',
							mb: [{a: '支付', b: 'payOrder'}, {a: '取消支付', b: 'exitPay'}, {a: '取消订单', b: 'exitOrder'}]
						};
					case 'sht_serstatus12':
						if (this.tagData.refundData.length == 0 && this.uiData.fservicetype.id !== 'fres_type_03') {
							_mb.push({a: '申请退款', b: 'applyRefund'});
						}
						return {
							a: 3,
							m: '您已托管费用',
							mb: _mb
						};
					case 'sht_serstatus13':
						if (this.tagData.refundData.length == 0 && this.uiData.fservicetype.id !== 'fres_type_03') {
							_mb.push({a: '申请退款', b: 'applyRefund'});
						}
						return {
							a: 4,
							m: '师傅已预约，等待师傅上门进行服务',
							mb: _mb
						};
					case 'sht_serstatus16':
						if (this.tagData.refundData.length == 0 && this.uiData.fservicetype.id !== 'fres_type_03') {
							_mb.push({a: '申请退款', b: 'applyRefund'});
						}
						return {
							a: 4,
							m: '师傅已预约，正在努力提货中。。。',
							mb: _mb
						};
						break;
					default:
						return {a: -1, m: '', mb: []};
				}
			},
			steps() {
				let t = this;
				return (this.uiData.fserstatus || {id: ''}).id.trim() === 'sht_serstatus01'
					? [
							{
								a: '提交订单信息',
								b: t.getData('operateDate', 'sht_submitbill')
							},
							{
								a: '已取消',
								b: t.getData('operateDate', 'sht_cancelbill')
							}
					  ]
					: [
							{
								a: '提交订单信息',
								b: t.getData('operateDate', 'sht_submitbill')
							},
							{
								a: '师傅报价',
								b: t.getData('operateDate', 'sht_masterquotation')
							},
							{
								a: '选择师傅托管费用',
								b: t.getData('operateDate', 'sht_selectedmaster')
							},
							{
								a: '上门服务',
								b: t.getData('operateDate', 'sht_serviceing')
							},
							{
								a: '验收',
								b: t.getData('operateDate', 'sht_acceptbill')
							}
					  ];
			},
			starNum() {
				return parseInt(this.comm.Odefault(this.uiData.fqualstar, 'id', 'gradestar_00').substring(11));
			}
		},
		watch: {
			starNum(v) {
				this.tagData.dealerStar = v;
			}
		},
		components: {OrderEvaluate}
	}
];
export default billView;
</script>
<style lang="scss">
.orderdetail {
	.state-operation {
		margin: 40px 0;
		border: 1px solid #64bbf8;
		background-color: #e2f3ff;
		& > * {
			padding-left: 30px;
			&:nth-child(1) {
				height: 60px;
				line-height: 60px;
				border-bottom: 1px dashed #64bbf8;
			}
			&:nth-child(2) {
				height: 50px;
				line-height: 50px;
			}
		}
		h4 {
			font-size: 16px;
			font-weight: bold;
		}
		span {
			margin-left: 40px;
		}
		.absolute {
			right: 30px;
		}
		a {
			padding: 0 20px;
			border-right: 1px solid #d7d7d7;
			&:last-child {
				border-right: 0;
			}
		}
	}
	.el-tabs__header {
		margin: 0 0 20px;
	}
	.el-tabs--card > .el-tabs__header {
		border-color: #ccc;
		.el-tabs__nav {
			border: none;
		}
		.el-tabs__item {
			border: 1px solid #ccc;
			font-size: 14px;
			margin-right: 5px;
			&.is-active {
				background-color: #409eff;
				color: #fff;
				border-color: #409eff;
			}
		}
	}
	.content-panel {
		padding: 20px 30px;
		margin-bottom: 20px;
		span {
			margin-left: 40px;
		}
		p {
			line-height: 24px;
			margin: 3px 0;
			color: #666;
		}
	}
	.order-message {
		padding: 20px 0;
		font-size: 0;
		margin-bottom: 40px;
		position: relative;
		&::after {
			content: '';
			border-bottom: 1px dashed #ccc;
			position: absolute;
			bottom: -20px;
			left: 0;
			width: 100%;
		}
		& > * {
			display: inline-block;
			vertical-align: top;
			font-size: 12px;
			width: 33.33%;
			padding: 0 30px;
			box-sizing: border-box;
			border-right: 1px solid #ccc;
			min-height: 200px;
			&:last-child {
				border-right: none;
			}
		}
		p {
			line-height: 24px;
			margin: 3px 0;
		}
	}
	.amount-total {
		p {
			line-height: 30px;
			span {
				color: #ff313b;
				width: 70px;
				display: inline-block;
			}
			em {
				background-color: #ff474f;
				font-size: 12px;
				padding: 0 2px;
				color: #fff;
				margin-right: 3px;
			}
		}
	}
	.panel-fe {
		height: 60px;
		line-height: 60px;
		font-size: 16px;
		color: #c3800f;
		padding-left: 30px;
		.icon-bao {
			position: absolute;
			top: 13px;
			left: 20px;
		}
	}

	.master-list {
		li {
			padding: 31px 47px 45px 47px;
			border: 1px solid #e8e8e8;
			position: relative;
			font-size: 0;
			.master-head {
				width: 114px;
				height: 114px;
				overflow: hidden;
				border-radius: 50%;
				border: 1px solid #e8e8e8;
				margin-right: 27px;
				cursor: pointer;
				img {
					width: 100%;
				}
			}
			& > * {
				display: inline-block;
				font-size: 14px;
				vertical-align: top;
			}
			h5 {
				font-size: 16px;
				line-height: 28px;
				font-weight: bold;
				cursor: pointer;
			}
			.master-info {
				width: 280px;
				.icon-bond {
					margin: 5px 0;
				}
			}
			.master-score {
				padding-top: 25px;
				width: 370px;
				p {
					line-height: 28px;
				}
			}
			.master-offer {
				width: 230px;
				padding-top: 29px;
				text-align: center;
				p {
					line-height: 28px;
				}
			}
			.style-orange {
				border-color: #ff6d22;
				color: #ff6d22;
				&:focus,
				&:hover {
					color: #ff6d22;
					background-color: rgba(255, 108, 34, 0.8);
					border-color: #ff6d22;
				}
			}
		}
	}
	.offer-table {
		border: 1px solid #e8e8e8;
		th,
		td {
			height: 42px;
			vertical-align: middle;
		}
		th {
			background-color: #f5f5f5;
			font-weight: normal;
		}
		.bottom-solid td {
			border-bottom: 1px solid #e8e8e8;
		}
		td {
			padding-left: 24px;
			&:last-child {
				padding-right: 24px;
			}
		}
		.pledge {
			i {
				margin: 0 6px 0 14px;
				&::before {
					content: '\E611';
					font-family: element-icons !important;
					border-radius: 50%;
					color: #fff;
					background-color: #409eff;
				}
			}
		}
		// tr:last-child th {
		// 	padding-left: 24px;
		// 	vertical-align: top;
		// 	height: 82px;
		// 	border-top: 1px solid #e8e8e8;
		// 	background-color: #fff;
		// 	text-align: left;
		// 	line-height: 42px;
		// }
	}
	.table-border {
		td {
			padding: 14px 20px;
		}
	}
	.done {
		margin: 10px 0;
	}
}
</style>