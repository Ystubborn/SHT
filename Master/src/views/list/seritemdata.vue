<template>
  <div class="seritem">
    <div class="search">
      <el-input placeholder="服务名称" v-model="tagData.search"  @keyup.enter.native="search"></el-input>
      <el-button @click="search">搜索</el-button>
    </div>
    <div class="seritem-list-box" style="height:300px;">
      <el-checkbox-group v-model="tagData.listDataCheckList">
        <el-checkbox v-for="item in uiData.listData" :key="item.fentity_id" :label="item.fentity_id">
          <div class="seritem-list-name">{{item.fprofield_fenumitem}}</div>
          <div class="seritem-list-name">{{item.fseritemid_fname}}</div>
          <div class="seritem-list-name">{{item.fmaterial_fenumitem}}</div>
          <div class="seritem-list-price">{{item.fsellprice.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}}元/{{item.funitid_fname}}</div>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="text-center">
      <el-pagination @size-change="customEvent({opcode:'pageSizeChanged',value:$event})" @current-change="customEvent({opcode:'pageIndexChanged',value:$event})" :current-page="uiData.listDesc.pageIndex" :page-sizes="[10, 30, 50]" :page-size="uiData.listDesc.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="uiData.listDesc.records">
      </el-pagination>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </div>
</template>
<script>
import {listView as base} from '../../lib';
import seritemlistplugin from './seritemlistplugin';
const listView = {
	extends: base
};
listView.formId = 'ydj_seritemprice';
listView.plugs = [new seritemlistplugin({})];
// 可以通过混合机制提供插件之上的实例方法
listView.mixins = [
	{
		methods: {
			confirm() {
				let t = this;
				if (t.tagData.listDataCheckList.length !== 0) {
					let tData = [];
					t.uiData.listData.forEach(o => {
						if (t.tagData.listDataCheckList.indexOf(o.fentity_id) > -1) {
							tData.push({id:t.comm.Guid(),fseritemid: {id: o.fseritemid, fname: o.fseritemid_fname}, fmaterial: {id: o.fmaterial, fname: o.fmaterial_fenumitem}, funitid: {id: o.funitid, fname: o.funitid_fname}, fprice: o.fsellprice, fqty: 1, frequire: 0,froomno:{id:'',name:''},fprofieldentry:{id:o.fprofield}});
						}
					});
					t.$emit('listenData', 'seritemch', tData);
					t.tagData.listDataCheckList = [];
				} else {
					t.$message({
						message: '请选择需要的服务项目',
						type: 'warning'
					});
				}
			},
			search()
			{
					this.query.filterString = "fservicetype='" + this.servicetype + "' and fprofield in ('" + this.profield.split(',').join("','") + "')  and  fdealerid='" + this.$store.state.userCtx.linkIdentity.id + "'" + " and  fseritemid in(select fid from t_ydj_seritem where fname like '%"+this.tagData.search+"%')";
			}
		},
		props: {
			profield: {},
			servicetype: {}
		},
		watch: {
			profield() {
				this.query.filterString = "fservicetype='" + this.servicetype + "' and fprofield in ('" + this.profield.split(',').join("','") + "')  and  fdealerid='" + this.$store.state.userCtx.linkIdentity.id + "'";
			},
			servicetype() {
				this.query.filterString = "fservicetype='" + this.servicetype + "' and fprofield in ('" + this.profield.split(',').join("','") + "')  and  fdealerid='" + this.$store.state.userCtx.linkIdentity.id + "'";
			}
		}
	}
];
export default listView;
</script>
<style>
.dialog-footer {
	display: block;
	text-align: center;
}
.seritem-list-box {
	overflow-y: auto;
}
.seritem-list-box .el-checkbox {
	width: 100%;
	height: 50px;
}
.seritem-list-box .el-checkbox__input {
	float: right;
	margin-right: 30px;
	margin-top: 18px;
}
.seritem-list-box .el-checkbox__label {
	display: inline-block;
	height: 50px;
	line-height: 50px;
}
.seritem-list-box .el-checkbox + .el-checkbox {
	margin-left: 0px;
}
.seritem-list-box .el-checkbox__label div {
	display: inline-block;
}
.seritem-list-box .seritem-list-name {
	width: 140px;
	text-indent: 20px;
}
.seritem-list-box .seritem-list-price {
	width: 220px;
	text-indent: 20px;
}
</style>
<style scoped>
.seritem-checklist {
	margin-bottom: 20px;
}
.seritem-list-box {
	border: 1px #e8e8e8 solid;
}
</style>