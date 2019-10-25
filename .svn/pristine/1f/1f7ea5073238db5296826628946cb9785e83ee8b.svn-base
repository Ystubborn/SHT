<template>
  <div>
    <BreadCrumb :data="[{ a: '投诉管理' }]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right order-list">
        <el-dialog v-if="!comm.IsNullOrEmpty(tagData.back)" title="回复" :visible.sync="tagData.back.visible" center :close-on-click-modal="false">
          <el-form label-width="120px" label-position="left" :model="tagData.back" ref="tagData" :rules="rules">
            <el-form-item label="回复说明" is-required prop="content">
              <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="tagData.back.content"></el-input>
            </el-form-item>
            <el-form-item label="图片">
              <Upload :limit="3" v-model="tagData.back.image"></Upload>
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="opClick('backExit')">取 消</el-button>
            <el-button type="primary" @click="opClick('backConfirm')">确定</el-button>
          </span>
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
          <li>订单信息</li>
          <li>原单金额</li>
          <li>赔付金额</li>
          <li>状态</li>
          <li>操作</li>
        </ul>
        <table width="100%" class="order-item" :key="item.fbillhead_id" v-for="item in uiData.listData">
          <colgroup>
            <col width="325">
            <col width="155">
            <col width="145">
            <col width="145">
            <col width="225">
          </colgroup>
          <tr>
            <th align="left" colspan="5">
              <strong>{{item.fcreatedate}}</strong><span>订单编号:{{item.fbillno}}</span>
            </th>
          </tr>
          <tr>
            <td>
              <p>{{item.flinkid}}　　{{item.fphone}}</p>
              <p>{{item.fcusaddress}}</p>
            </td>
            <td>￥{{Number(item.fexpectamount).toFixed(2)}}</td>
            <td class="color-red">￥{{Number(item.fitemmoney).toFixed(2)}}</td>
            <td v-html="statusInit(item)"></td>
            <td>
              <a href="javascript:void(0)" :key="button.b" v-for="button in btnOpInit(item)" @click="opClick(button.b,item)">{{button.a}}</a>
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
import ComplainListPlugIn from './indexPlugIn';
const listView = {
	extends: base
};
listView.formId = 'ser_complaintrecord';
listView.plugs = [new ComplainListPlugIn({})];
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
							filterArray.push(this.comm.StringFormat("(flinkid like '%{0}%' or fphone like '%{0}%')", t.tagData.cS));
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
      @param {Object} d tagData
      */
			cornerMarker(d) {
				let t = this;
				t.axios.post('/bill/ser_complaintrecord?operationno=getdealwithcount', {loadingOption: {target: '.order-panel'}, simpleData: {merchantId: t.$store.state.userCtx.linkIdentity.id}}).then(res => {
					let srvData = res.data.operationResult.srvData;
					if (srvData instanceof Array) {
						srvData.forEach(o => {
							d.tagData.tD.find(a => {
								return a.s.indexOf(o.fname) > -1;
							}).c = o.fcount;
						});
					}
				});
			},

			/*状态颜色*/
			statusInit(obj) {
				let t = this;
				let txt = obj.fcomplainstatus_fenumitem;
				let color = 'color-gray';
				if (obj.fcomplainstatus === 'complain_status01') {
					txt = '待平台处理';
					color = 'color-green';
				}
				if (obj.fcomplainstatus === 'complain_status02') {
					txt = '投诉成功';
				}
				return '<label class="' + color + '">' + txt + '</label>';
			},

			/**
      *
      列表操作按钮初始化
      *
      @method btnOpInit
      @param {String} obj 状态字符串
      @return {Array} Array[Object]
      */
			btnOpInit(obj) {
				let t = this;
				let btn = [{a: '查看', b: 'lookcomplain'}];
				switch (obj.fcomplainstatus) {
					case 'complain_status01':
						return [{a: '取消投诉', b: 'quest'}].concat(btn);
					case 'complain_status02':
						return [{a: '查看钱款', b: 'lookmoney'}].concat(btn);
					default:
						return btn;
				}
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
					case 'lookcomplain': //查看订单
						t.$router.push({
							path: '/droit/det-complain',
							query: {id: b.fbillhead_id}
						});
						break;
					case 'back':
						t.tagData.back = {id: b.fbillhead_id, image: {}, visible: !0, content: ''};
						break;
					case 'backExit':
						t.tagData.back = {id: '', image: {}, visible: !1, content: ''};
						break;
					case 'backConfirm':
						t.$refs['tagData'].validate(valid => {
							if (!valid) {
								t.$message({
									message: '请完善当前回复信息',
									type: 'warning'
								});
								return false;
							}
							t.axios.post('/bill/ser_complaintrecord?operationno=replyAppeal', {selectedRows: [{pkValue: t.tagData.back.id}], simpleData: {freplyimage: t.tagData.back.image.id, freplycontent: t.tagData.back.content}}).then(res => {
								t.tagData.back = {id: '', image: {}, visible: !1, content: ''};
								t.invokePlugIn('refresh');
								t.cornerMarker(t);
							});
						});
						break;
					case 'quest':
						t.axios.post('/bill/ser_complaintrecord?operationno=withdraw', {selectedRows: [{pkValue: b.fbillhead_id}]}).then(res => {
							t.invokePlugIn('refresh');
							t.cornerMarker(t);
						});
						break;
					case 'csinsert':
						t.axios.post('/bill/ser_complaintrecord?operationno=platintervent', {selectedRows: [{pkValue: b.fbillhead_id}], simpleData: {fsourcetype: 1}}).then(res => {
							t.$alert('您的投诉平台已受理，平台将于5日内处理完成，请您耐心等待', '提示', {
								confirmButtonText: '确定',
								callback: () => {
									t.invokePlugIn('refresh');
									t.cornerMarker(t);
								}
							});
						});
						break;
					case 'lookmoney':
						t.$router.push({path: '/settle'});
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
		li:nth-child(1) {
			width: 325px;
		}
		li:nth-child(2) {
			width: 155px;
		}
		li:nth-child(3) {
			width: 145px;
		}
		li:nth-child(4) {
			width: 145px;
		}
		li:nth-child(5) {
			width: 225px;
		}
	}
}
</style>