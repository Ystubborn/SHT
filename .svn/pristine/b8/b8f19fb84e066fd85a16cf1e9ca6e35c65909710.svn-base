<template>
  <div>
    <BreadCrumb :data="[{ a: '问题单' }]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right order-list">
        <el-dialog v-if="!comm.IsNullOrEmpty(tagData.back)" title="受理" :visible.sync="tagData.back.visible">
          <el-form label-width="100px" label-position="left" :model="tagData.back" ref="tagData" :rules="rules">
            <el-form-item label="受理说明" is-required prop="content">
              <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="tagData.back.content"></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <Upload :limit="3" v-model="tagData.back.image"></Upload>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button @click="opClick('acceptExit')">取 消</el-button>
            <el-button type="primary" @click="opClick('acceptConfirm')">确定</el-button>
          </div>
        </el-dialog>
        <el-tabs v-model="tagData.tA" @tab-click="customEvent({opcode:'tabClick'})">
          <el-tab-pane v-for="item in tagData.tD" :key="item.a" :name="item.b">
            <span slot="label">{{item.a}}<label class="color-red" v-if="!comm.IsNullOrEmpty(item.c,0)">({{item.c}})</label></span>
          </el-tab-pane>
        </el-tabs>
        <div class="search">
          <label>客户信息</label>
          <el-input placeholder="客户姓名/手机号" v-model="tagData.cS" @keyup.enter.native="queryInit('search')"></el-input>
          <label>订单号</label>
          <el-input placeholder="订单号" v-model="tagData.oS" @keyup.enter.native="queryInit('search')"></el-input>
          <el-button @click="queryInit('search')">搜索</el-button>
          <el-button @click="opClick('reset')">重置</el-button>
        </div>
        <ul class="order-title">
          <li>服务类型</li>
          <li>订单信息</li>
          <li>服务商</li>
          <li>完工时间</li>
          <li>订单状态</li>
          <li>操作</li>
        </ul>
        <table width="100%" class="order-item" :key="item.fbillhead_id" v-for="item in uiData.listData">
          <colgroup>
            <col width="135">
            <col width="220">
            <col width="120">
            <col width="150">
            <col width="150">
            <col width="200">
          </colgroup>
          <tr>
            <th align="left" colspan="6">
              <strong>{{item.fcreatedate}}</strong><span>订单编号:{{item.fbillno}}</span>
            </th>
          </tr>
          <tr>
            <td>{{item.fservicetype_fenumitem}}</td>
            <td>
              <p>{{item.fname}}　　{{item.fphone}}</p>
              <p>{{item.faddress}}</p>
            </td>
            <td>
              {{item.fmasterid_fname}}<br>
              {{item.fmasterid_fphone}}
            </td>
            <td>{{item.freportdate}}</td>
            <td v-html="statusInit(item.fhandlestatus,item.ffeeder)"></td>
            <td>
              <a href="javascript:void(0)" :key="button.b" v-for="button in btnOpInit(item.fhandlestatus,item.ffeeder)" @click="opClick(button.b,item)">{{button.a}}</a>
            </td>
          </tr>
        </table>
        <template>
          <div class="text-center">
            <el-pagination @size-change="customEvent({opcode:'pageSizeChanged',value:$event})" @current-change="customEvent({opcode:'pageIndexChanged',value:$event})" :current-page="uiData.listDesc.pageIndex" :page-sizes="[10, 30, 50]" :page-size="uiData.listDesc.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="uiData.listDesc.records"></el-pagination>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {listView as base} from '../../../lib';
import ProblemListPlugIn from './indexPlugIn';
const listView = {
	extends: base
};
listView.formId = 'ser_servicefeed';
listView.plugs = [new ProblemListPlugIn({})];
listView.mixins = [
	{
		methods: {
			/**
      *
      load数据
      *
			@method queryInit
			@param {string} type 类型
      @param {string} name tabs name/
      @param {Object} [data] Vm.data/this
      */
			queryInit(type, name, data) {
				let t = data || this;
				let filterArray = [t.tagData.mS];
				switch (type) {
					case 'search':
						if (!this.comm.IsNullOrEmpty(t.tagData.cS)) {
							filterArray.push(this.comm.StringFormat("(fname like '%{0}%' or fphone like '%{0}%')", t.tagData.cS));
						}
						if (!this.comm.IsNullOrEmpty(t.tagData.oS)) {
							filterArray.push(this.comm.StringFormat("(fbillno like '%{0}%')", t.tagData.oS));
						}
						break;
					default:
						t.tagData.tA = name;
						t.tagData.cS = '';
						t.tagData.oS = '';
						t.tagData.tS = t.tagData.tD.find(o => {
							return o.b === name;
						}).s;
						break;
				}
				filterArray.push(t.tagData.tS);
				if (t.tagData.cMload) {
					this.cornerMarker(t);
					t.tagData.cMload = !1;
				}
				this.comm.ArrayRemove(filterArray, o => {
					return this.comm.IsNullOrEmpty(o);
				});
				if (!t.query) {
					t.query = {filterString: filterArray.join(' and ')};
				} else {
					t.query.filterString = filterArray.join(' and ');
				}
			},
			/**
      *
      状态对应条数角标
      *
      @method cornerMarker
      @param {Object} d this
      */
			cornerMarker(d) {
				let t = this;
				t.axios.post('/bill/ser_servicefeed?operationno=getdealwithcount', {loadingOption: {target: '.order-panel'}, simpleData: {merchantId: t.$store.state.userCtx.linkIdentity.id}}).then(res => {
					let srvData = res.data.operationResult.srvData;
					if (srvData instanceof Array) {
						srvData.forEach(o => {
							d.tagData.tD.find(a => {
								return a.n === o.fname;
							}).c = o.fcount;
						});
					}
				});
			},
			/*状态颜色*/
			statusInit(status, ffeeder) {
				let t = this;
				switch (status) {
					case 'handle_sta002':
						if (t.comm.IsNullOrEmpty(ffeeder)) {
							return '<label class="color-green">待师傅处理</label>';
						}
						return '<label class="color-red">待商户处理</label>';
					case 'handle_sta003':
						if (t.comm.IsNullOrEmpty(ffeeder)) {
							return '<label class="color-gray">商户已取消</label>';
						}
						return '<label class="color-gray">师傅已取消</label>';
					case 'handle_sta004':
						if (t.comm.IsNullOrEmpty(ffeeder)) {
							return '<label class="color-gray">师傅已处理</label>';
						}
						return '<label class="color-gray">商户已处理</label>';
				}
				return '';
			},

			/**
      *
      列表操作按钮初始化
      *
      @method btnOpInit
      @param {String} a 状态字符串
      @return {Array} Array[Object]
      */
			btnOpInit(a, b) {
				let t = this;
				if (a === 'handle_sta002') {
					if (!t.comm.IsNullOrEmpty(b)) {
						return [{a: '受理', b: 'accept'}, {a: '查看', b: 'lookfeedback'}];
					}
					return [{a: '查看', b: 'lookfeedback'}, {a: '取消', b: 'exit'}];
				}
				return [{a: '查看', b: 'lookfeedback'}];
			},
			/**
      *
      按钮事件
      *
      @method opClick
      @param {String} a 操作Code
      @param {Object} [b] 数据
      */
			opClick(a, b) {
				let t = this;
				switch (a) {
					case 'reset': //重置搜索条件
						t.tagData.cS = '';
						t.tagData.oS = '';
						break;
					case 'lookfeedback': //查看
						t.$router.push({
							path: '/order/det-problem',
							query: {id: b.fbillhead_id}
						});
						break;
					case 'exit': //取消
						t.$confirm('取消问题反馈后，本次申请将关闭，您还可以再次发起,确定继续吗？', '操作提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							t.invokeFormOperation({formId: t.formCtx.formId, opcode: 'Feedback_cancel', param: {selectedRows: [{pkValue: b.fbillhead_id}]}}).then(() => {
								t.invokePlugIn('refresh');
								t.cornerMarker(t);
							});
						});
						break;
					case 'accept': //受理
						t.tagData.back = {id: b.fbillhead_id, image: {}, visible: !0, content: ''};
						break;
					case 'acceptExit': //受理
						t.tagData.back = {id: '', image: {}, visible: !1, content: ''};
						break;
					case 'acceptConfirm':
						t.$refs['tagData'].validate(valid => {
							if (!valid) {
								t.$message({
									message: '请完善当前回复信息',
									type: 'warning'
								});
								return false;
							}
							t.axios.post('/bill/ser_servicefeed?operationno=replyservicefeed', {selectedRows: [{pkValue: t.tagData.back.id}], simpleData: {freplyimage: t.tagData.back.image.id, freplycontent: t.tagData.back.content}}).then(res => {
								t.tagData.back = {id: '', image: {}, visible: !1, content: ''};
								t.queryInit('', 'three');
								t.cornerMarker(t);
							});
						});
						break;
				}
			}
		},
		computed: {
			TabsWatch() {
				return this.tagData.tA;
			}
		},
		watch: {
			TabsWatch(val) {
				this.$store.commit('pageStatus', {orderTab: val});
			}
		}
	}
];
export default listView;
</script>
<style lang="scss" scoped>
.order-list {
	.order-title {
		li {
			&:nth-child(1) {
				width: 135px;
			}
			&:nth-child(2) {
				width: 220px;
			}
			&:nth-child(3) {
				width: 120px;
			}
			&:nth-child(4) {
				width: 150px;
			}
			&:nth-child(5) {
				width: 150px;
			}
			&:nth-child(6) {
				width: 200px;
			}
		}
	}
	.order-item td p {
		padding-left: 0;
	}
}
</style>
 
