<template>
  <header>
    <div class="header_box">
      <img src="../assets/images/logo.png" />
      <h3 v-if="!state.userCtx.isLoggedIn">{{state.header.caption }}<span>客服电话：4009608388</span></h3>
      <div class="nav" v-if="state.userCtx.isLoggedIn">
        <ul>
          <li v-for="menu in menus" :key="menu.a">
            <router-link :to="menu.b">{{menu.a}}</router-link>
          </li>
        </ul>
        <el-button v-if="$route.path!=='/order/pre-order'" @click="publshEvent">立即下单</el-button>
        <el-menu mode="horizontal" class="header-menu" @select="handleSelect" v-if="state.userCtx.isLoggedIn">
          <el-submenu index="1">
            <template slot="title"><label>
                <ImgRender v-if="!comm.IsNullOrEmpty(state.userCtx.userHead)" type="headPort" class="usericon" :source="state.userCtx.userHead"></ImgRender>{{state.userCtx.linkIdentity.name}}
              </label></template>
            <el-menu-item index="1-1">个人中心</el-menu-item>
            <el-menu-item index="1-2">退出登录</el-menu-item>
            <el-submenu index="1-3">
              <template slot="title">切换企业</template>
              <el-menu-item :index="'1-3-'+index" v-for="(item,index) in companys" :key="index" @click="companyTab(item)">{{(index==0?"(当前)":"")+ item.companyName}}</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </div>
    </div>
    <el-dialog :visible.sync="order.visible" :close-on-click-modal="false" width="600px">
      <h2 slot="title">提示</h2>
      <p class="banner">您当前还有待处理订单，请先处理完再下单</p>
      <ul>
        <li v-for="item in order.handleContent" :key="item.a">
          您有<label>{{item.i}}</label>{{item.a}}<router-link :to="item.l.b" @click.native="order.visible=false">{{item.l.a}}</router-link>
        </li>
      </ul>
    </el-dialog>
  </header>
</template>
<script>
import ImgRender from './imagerender';
export default {
	data() {
		return {
			menus: [{a: '首页', b: {path: '/home'}}, {a: '订单管理', b: {path: '/order'}}, {a: '维权中心', b: {path: '/droit'}}, {a: '结算中心', b: {path: '/settle'}}, {a: '个人中心', b: {path: '/personal'}}, {a: '师傅中心', b: {path: '/master'}}],
			state: this.$store.state,
			order: {
				visible: false,
				handleContent: []
			},
			company: []
		};
	},
	dependencies: ['authService'],
	methods: {
		logout() {
			let t = this;
			t.authService.logout().then(resp => {
				t.$store.commit('header', {caption: ''});
				t.$store.commit('userCtx', {
					linkIdentity: {},
					userId: '',
					company: {}
				});
				t.acnum = 0;
				t.$store.commit('userCtx', {userHead: ''});
				t.$store.commit('userCtx', {isLoggedIn: false});
				sessionStorage.clear();
				t.$router.push('/login');
			});
		},
		publshEvent() {
			let t = this;
			t.axios.post('/bill/ydj_merchantorder?operationno=checknewbill', {simpleData: {merchantId: t.$store.state.userCtx.linkIdentity.id}, loadingOption: {target: '.element-loading'}}).then(res => {
				let reslut = res.data.operationResult.srvData.linkUnclosedBills;
				if (!t.comm.IsNullOrEmpty(reslut.ydj_merchantorder) || !t.comm.IsNullOrEmpty(reslut.ydj_refund) || !t.comm.IsNullOrEmpty(reslut.ydj_servicechange)) {
					t.publishInit(reslut);
				} else {
					this.$router.push({
						path: '/order/pre-order'
					});
				}
			});
		},
		publishInit(data) {
			let t = this;
			let temp = [];
			if (!t.comm.IsNullOrEmpty(data.ydj_merchantorder)) {
				temp.push({
					a: '张订单待验收，现在去',
					i: data.ydj_merchantorder.length,
					l: {
						a: '验收',
						b: {path: '/order', name: 'order', params: {tab: 'nine'}}
					},
					r: true
				});
			}
			if (!t.comm.IsNullOrEmpty(data.ydj_servicechange)) {
				temp.push({
					a: '张补价单需要处理，现在去',
					i: data.ydj_servicechange.length,
					l: {
						a: '处理',
						b: {path: '/order/supply', name: 'supply', params: {tab: 'one'}}
					},
					r: true
				});
			}
			if (!t.comm.IsNullOrEmpty(data.ydj_refund)) {
				temp.push({
					a: '张退款单需要处理，现在去',
					i: data.ydj_refund.length,
					l: {
						a: '处理',
						b: {path: '/droit', name: 'refund', params: {tab: 'one'}}
					},
					r: true
				});
			}
			t.order = {visible: true, handleContent: temp};
		},
		handleSelect(key) {
			let t = this;
			switch (key) {
				case '1-1':
					t.$router.push('/personal');
					break;
				case '1-2':
					t.logout();
					break;
			}
		},
		companyTab(d) {
			let t = this;
			var url = t.$util.format('/company/switch/{0}', d.companyId);
			t.axios
				.post(url, {})
				.then(resp => {
					let rejson = JSON.parse(resp.data.meta.merchantData);
					t.$store.commit('userCtx', {
						company: {
							companyId: d.companyId,
							companyName: d.companyName
						},
						linkIdentity: {
							id: rejson.id || '',
							name: rejson.name || '',
							city: rejson.city || ''
						}
					});
					window.location.reload();
					t.$eventbus.$emit('onRefresh', {target: d});
					t.$router.push({path: '/home'});
				})
				.catch(error => {
					console.log(error);
				});
		}
	},
	computed: {
		companys() {
			let t = this;
			let temp = [];
			t.$store.state.userCtx.companys.forEach(o => {
				temp = temp.concat(o.value);
			});
			let f = temp.find(o => {
				return o.companyId === t.$store.state.userCtx.company.companyId;
			});
			t.comm.ArrayRemove(temp, o => {
				return o.companyId === t.$store.state.userCtx.company.companyId;
			});
			temp.unshift(f);
			return temp;
		}
	},
	components: {ImgRender}
};
</script>
<style lang="scss">
.el-menu--horizontal {
	.el-menu {
		.el-menu-item {
			color: #333;
		}
		.el-submenu__title {
			color: #333;
		}
	}
}
header {
	height: 90px;
	width: 100%;
	background: #ffffff;
	border-bottom: 1px #cacccd solid;
	.header_box {
		width: 975px;
		height: 100%;
		margin: 0 auto;
		position: relative;
		padding-left: 225px;
		box-sizing: content-box;
		> img {
			width: 168px;
			height: 70px;
			position: absolute;
			left: 0;
			top: 10px;
		}
		h3 {
			height: 90px;
			line-height: 90px;
			font-size: 22px;
			font-weight: normal;
			display: inline-block;
			color: #005aa0;
			position: relative;
			padding-left: 50px;
			width: 925px;
			&::before {
				content: '';
				background-image: url(../assets/images/icon.png);
				width: 40px;
				height: 27px;
				display: block;
				position: absolute;
				left: 0;
				top: 34px;
				background-position: -41px -219px;
			}
			span {
				position: absolute;
				right: 0;
			}
		}
		.el-button {
			width: 120px;
			height: 40px;
			background-color: #0086e4;
			color: #fff;
			right: 201px;
			top: 25px;
			position: absolute;
			z-index: 0;
			padding: 0;
			border-color: #0086e4;
			::after {
				content: '';
				width: 37px;
				height: 73px;
				position: absolute;
				z-index: 1;
				display: block;
				background: url(../assets/images/icon.png) -294px 0;
				top: -17px;
				right: -11px;
			}
		}
		.exit {
			position: absolute;
			right: 150px;
			top: 37px;
			background-position: 0 -128px;
			display: block;
			width: 16px;
			height: 16px;
			text-indent: -999em;
		}
		.exit:hover {
			background-position: 0 -154px;
		}
	}
	.nav {
		font-size: 0;
		li {
			line-height: 90px;
			font-size: 16px;
			color: #333333;
			display: inline-block;
			padding: 0 12px;
			a {
				font-weight: normal;
				color: #333333;
			}
			a.router-link-active {
				color: #0086e4;
			}
		}
	}
	.el-menu {
		width: 160px;
		position: absolute;
		right: 0;
		top: 30px;
		&.el-menu--horizontal {
			border-bottom: 0;
			& > .el-submenu {
				&.is-active {
					.el-submenu__title {
						border: 0;
					}
				}
				line-height: 30px;
				padding: 0;
				.el-submenu__title {
					height: 30px;
					line-height: 30px;
					padding: 0;
					label {
						padding-left: 40px;
						display: inline-block;
						width: 100px;
						overflow: hidden;
						.usericon {
							width: 30px;
							height: 30px;
							border-radius: 50%;
							position: absolute;
							overflow: hidden;
							left: 0;
							top: 0;
							> img {
								width: 30px;
								height: 30px;
							}
						}
					}
				}
			}
		}
	}
	.el-dialog__body {
		padding: 10px 20px;
		color: #333;
		.banner {
			background-color: #e2f3ff;
			padding: 15px;
			border: 1px solid #64bbf8;
		}
		ul {
			padding: 15px 0;
			li {
				line-height: 32px;
				padding-left: 15px;
				label {
					color: #0086e4;
				}
				a {
					color: #ff6d22;
				}
			}
		}
	}
}
.name-drop a {
	color: #333;
}
</style>