<template>
  <div>
    <BreadCrumb :data="tagData.crumb"></BreadCrumb>
    <div class="main w block-center complain">
      <div class="problem_detail">
        <div class="title text-center border-bottom-solid margin-bottom">{{uiData.ftitle}}</div>
				<div v-html="uiData.fcontent"></div>
      </div>
      <div class="question">
        <div class="title margin-bottom border-bottom-solid">常见问题</div>
        <ul class="list padding-bottom">
          <li v-for="(item,index) in tagData.problem" :key="item.fbillhead_id">
            <router-link :to="{path:'/personal/det-problem',query:{id:item.fbillhead_id}}">{{index+1}}.{{item.ftitle}}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumb from '../../../components/breadcrumb';
import {billView as base} from '../../../lib';
import detailPlugIn from './detailPlugIn';
const billView = {
	extends: base
};
billView.formId = 'news_customerservice';
billView.plugs = [new detailPlugIn({})];
billView.mixins = [
	{
		methods: {
			getData() {
				let t = this;
				t.axios.post('/list/news_customerservice.json?operationno=querydata', {filterString: "fservicetype='common_problem'", loadingOption: {target: '.element-loading'}, pageSize: 10, pageIndex: 1}).then(res => {
					t.tagData.problem = res.data.operationResult.srvData.data;
				});
			}
		},
		components: {BreadCrumb}
	}
];
export default billView;
</script>
<style lang="scss">
.problem_detail {
	font-size: 14px;
	width: 890px;
	background-color: #fff;
	display: inline-block;
	vertical-align: top;
	padding: 20px 30px;
	box-sizing: border-box;
 
}
.question {
	display: inline-block;
	box-sizing: border-box;
	background-color: #fff;
	font-size: 14px;
	width: 300px;
	vertical-align: top;
	margin-left: 10px;
	padding: 10px;
	.list {
		text-indent: 1em;
	}
}
</style>
