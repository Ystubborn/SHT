<template>
  <div>
    <BreadCrumb :data="[{ a: '师傅中心' }]"></BreadCrumb>
    <div class="main-content w block-center master">
      <div class="title border-bottom-solid margin-bottom">师傅中心</div>
      <el-form label-width="100px">
        <el-form-item label="服务城市：">
          <City v-model="tagData.city" :len="1"></City>
        </el-form-item>
        <el-form-item label="服务类型：">
          <Radio type="radius" v-model="tagData.servicetype" :defaults='true' defaultTxt="不限">
            <div v-for="item in tagData.profie" :key="item.id" :value="item.id">{{item.name}}</div>
          </Radio>
        </el-form-item>
        <el-form-item label="师傅姓名：">
          <div class="search">
            <el-input placeholder="请输入师傅姓名" v-model="tagData.iS" @keyup.enter.native="queryInit()"></el-input>
            <el-button @click="queryInit()">搜索</el-button>
            <el-button @click="opClick('reset')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <ul>
        <li v-for="item in uiData.listData" :key="item.fbillhead_id">
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
          <div class="fav">
            <el-button type="orange" v-if="item.isFavorites" @click="opClick('favMaster',item)">取消收藏</el-button>
            <el-button type="orange" v-if="!item.isFavorites" @click="opClick('favMaster',item)" plain>收藏他　</el-button>
          </div>
        </li>
      </ul>
      <template>
        <div class="text-center">
          <el-pagination @size-change="customEvent({opcode:'pageSizeChanged',value:$event})" @current-change="customEvent({opcode:'pageIndexChanged',value:$event})" :current-page="uiData.listDesc.pageIndex" :page-sizes="[10, 30, 50]" :page-size="uiData.listDesc.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="uiData.listDesc.records"></el-pagination>
        </div>
      </template>
    </div>
  </div>
</template> 
<script>
import {listView as base} from '../../lib';
import MasterListPlugIn from './indexPlugIn';
const listView = {
	extends: base
};
listView.formId = 'ydj_master';
listView.plugs = [new MasterListPlugIn({})];
listView.mixins = [
	{
		created() {
			this.axios.post('/bill/ydj_master?operationno=querycombo&fieldkey=fprofield', {loadingOption: {target: '.element-loading'}}).then(res => {
				this.tagData.profie = res.data.operationResult.srvData.data;
			});
		},
		methods: {
			queryInit(data) {
				let t = data || this;
				let filterArray = [t.tagData.mS];
				let cityfilter = '';
				if (t.tagData.city.length == 1) {
					cityfilter = " fprovinceid='" + t.tagData.city[0] + "'";
				}
				if (t.tagData.city.length == 2) {
					cityfilter = " fcityid='" + t.tagData.city[1] + "'";
				}
				if (t.tagData.city.length == 3) {
					cityfilter = " fregionid='" + t.tagData.city[2] + "'";
				}
				if (!this.comm.IsNullOrEmpty(cityfilter)) {
					filterArray.push(' fid in (select fid from t_ydj_masterserviceareaentry where ' + cityfilter + ') ');
				}
				if (t.tagData.servicetype !== 'default' && t.tagData.servicetype !== '') {
					filterArray.push(" fprofield like'%" + t.tagData.servicetype + "%'");
				}
				if (!this.comm.IsNullOrEmpty(t.tagData.iS)) {
					filterArray.push(this.comm.StringFormat("(fname like '%{0}%' )", t.tagData.iS));
				}
				this.comm.ArrayRemove(filterArray, o => {
					return this.comm.IsNullOrEmpty(o);
				});
				if (!t.query) {
					t.query = {selectFields: ['fphone'], filterString: filterArray.join(' and '), simpleData: {fmerchantid: this.$store.state.userCtx.linkIdentity.id}, orderByString: 'fgrade desc,fstar desc'};
				} else {
					t.query.filterString = filterArray.join(' and ');
					t.query.selectFields = ['fphone'];
					t.query.OrderByString = 'fgrade desc,fstar desc';
					t.query.simpleData = {fmerchantid: this.$store.state.userCtx.linkIdentity.id};
				}
			},
			opClick(type, data) {
				let t = this;
				switch (type) {
					case 'favMaster':
						t.axios.post('/bill/ydj_masterfavorites?operationno=Favorites', {loadingOption: {target: '.element-loading'}, simpleData: {fmerchantid: t.$store.state.userCtx.linkIdentity.id, fmasterid: data.fbillhead_id}}).then(res => {
							data.isFavorites = res.data.operationResult.srvData.code == 1;
						});
						break;
					case 'reset': //重置搜索条件
						t.tagData.cS = '';
						t.tagData.iS = '';
						t.tagData.servicetype = 'default';
						break;
					case 'lookMaster':
						t.$router.push({
							path: '/master/detail',
							query: {id: data}
						});
						break;
				}
			}
		}
	}
];
export default listView;
</script>
<style lang="scss">
.master {
	.el-form {
		border: 1px solid #e8e8e8;
		padding-top: 22px;
		margin-bottom: 30px;
		.el-input {
			width: 200px;
		}
	}
	& > ul {
		li {
			font-size: 0;
			padding: 30px;
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
		}
	}
}
</style>