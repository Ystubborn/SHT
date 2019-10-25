<template>
	<div>
		<BreadCrumb :data=" [{ a: '我要报案' }]"></BreadCrumb>
		<div class="main w block-center">
			<Menu></Menu>
			<div class="main-content-right insurehome">
				<h4 class="title border-bottom-solid margin-bottom">选择类目</h4>
				<div class="block">
					<p class="color-red font12 relative"><i class="icon red-warning"></i>发生意外时请第一时间上报相关信息，以免因为上报不及时影响您的理赔!</p>
				</div>
				<div class="entrance">
					<router-link :to="{path:'/droit/insure/person'}" class="color-gray accident">
						<i class="icon"></i>客户意外申报入口
					</router-link>
					<router-link :to="{path:'/droit/insure/assets'}" class="color-gray">
						<i class="icon"></i>客户财产损失申报入口
					</router-link>
				</div>
				<div class="block font14 margin-bottom">
					<ul class="margin-v">
						<li>说明：申请以上损失申报的条件及注意事项</li>
						<li class="color-gray">①用户需在下单时选择购买了相关类型的保障；</li>
						<li class="color-gray">②师傅在服务过程中造成的第三方（即客户）人身意外或财产损失（不包括安装产品的损坏）的责任；</li>
						<li class="color-gray">③申请需要提交相关信息的原件：病例本、证明、消费清单、收据、图片等；</li>
						<li class="color-gray">④平台会有专门客服核实情况，请您填写有效的电话号码。</li>
						<li>紧急联系电话:</li>
						<li class="color-gray">保险：0755-25177903</li>
						<li class="color-gray">平台：0755-26657687</li>
						<li class="color-red">注意：详细细则请点击详情了解！</li>
					</ul>
					<p class="color-blue relative pointer" @click="tagData.transportVisible=!0"><i class="icon blue-warning"></i>左右手运送保细则 >></p>
					<p class="color-blue relative pointer" @click="tagData.thirdVisible=!0"><i class="icon blue-warning"></i>左右手第三方保障细则 >></p>
				</div>
				<Agreement title="第三方责任险协议" :visible.sync="tagData.thirdVisible" show="third"></Agreement>
				<Agreement title="左右手平台运送保服务协议" :visible.sync="tagData.transportVisible" show="transport"></Agreement>
				<h4 class="title border-bottom-solid margin-bottom">申报记录</h4>
				<table cellpadding="0" cellspacing="0" class="table theme-gray font14 margin-top lineheight-three">
					<colgroup>
						<col width="333" />
						<col width="333" />
						<col width="332" />
					</colgroup>
					<tr>
						<th>申请日期</th>
						<th>申报类目</th>
						<th>操作</th>
					</tr>
					<tr v-for="item in uiData.listData" :key="item.fid">
						<td>{{comm.DateToString(comm.toDate(item.fcreatedate),'yyyy-MM-dd HH:mm')}}</td>
						<td>{{item.fsafetype=='fsafe_type_01'?'客户意外申报':'客户财产损失申报'}}</td>
						<td><router-link :to="{path:'/droit/det-insure',query:{id:item.fbillhead_id}}">查看详情</router-link></td>           
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
import indexPlugIn from './indexPlugIn';
const listView = {
	extends: base
};
listView.formId = 'ydj_safesettle';
listView.plugs = [new indexPlugIn({})];
listView.mixins = [
	{ 
 	}
];
export default listView;
</script>
<style lang="scss">
.insurehome {
	.block {
		border: 1px solid #e8e8e8;
		background-color: #f5f5f5;
		padding: 5px 20px;
		& > p {
			padding-left: 20px;
		}
		& > ul {
			li {
				padding: 2px 0;
			}
		}
		.red-warning {
			position: absolute;
			left: 0px;
			top: 1px;
		}
		.blue-warning {
			position: absolute;
			top: 5px;
			left: 3px;
		}
	}
	.entrance {
		padding: 20px 0;
		& > * {
			font-size: 16px;
			width: 230px;
			height: 190px;
			border-radius: 10px;
			border: 1px solid #e8e8e8;
			display: inline-block;
			margin-right: 45px;
			text-align: center;
			&:hover {
				border-color: #0086e4;
			}
			& > .icon {
				display: block;
				width: 120px;
				height: 100px;
				background-position: -431px 0;
				margin: 35px auto 20px auto;
			}
		}
		.accident {
			& > .icon {
				background-position: -561px 0;
			}
		}
	}
}
</style>