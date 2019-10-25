<template>
  <div>
    <BreadCrumb :data="[{ a: '个人资料' }]"></BreadCrumb>
    <div class="main w block-center">
      <Menu></Menu>
      <div class="main-content-right">
        <h4 class="title border-bottom-solid margin-bottom">个人资料</h4>
        <el-form label-width="100px" class="personal-content" label-position="left" v-if="!comm.IsNullOrEmpty(uiData)">
          <el-form-item label="头像">
            <Upload :limit="1" v-model="uiData.fimage" v-if="tagData.isEdit" :size="50"></Upload>
            <ImgRender type="headPort" class="userhead" :source="uiData.fimage.id" v-if="!tagData.isEdit"></ImgRender>
          </el-form-item>
          <el-form-item label="商户名称">
            <el-input type="text" v-model="uiData.fname" placeholder="商户名称" :disabled="!tagData.isEdit"></el-input>
          </el-form-item>
          <el-form-item label="联系人" required>
            <el-input type="text" v-model="uiData.fcontacts" placeholder="请输入联系人姓名" :disabled="!tagData.isEdit"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-col :span="18" class="margin-right">
              <el-input type="text" v-model="uiData.fphone" placeholder="" :disabled="true"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button :disabled="$store.state.userCtx.companys.length>1" @click="confirm" :title="$store.state.userCtx.companys.length>1?'由于您的账号有在多个企业，无法修改电话功能':''">修改电话</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="经营区域">
            <City v-model="tagData.city" :disabled="!tagData.isEdit" :len="1"></City>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input type="textarea" v-model="uiData.faddress" :disabled="!tagData.isEdit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Save">{{tagData.isEdit?'保存修改':'修改资料'}}</el-button>
          </el-form-item>
        </el-form>
        <el-dialog title="变更联系电话" :visible.sync="tagData.visible" :top="'30vh'" v-if="!comm.IsNullOrEmpty(tagData.Phonechange)">
          <el-form label-width="80px" class="personal-content" label-position="right" :model="tagData.Phonechange" ref="setphone">
            <el-form-item label="手机号" prop="phone" is-required :rules="comm.rules.phone">
              <el-col :span="16">
                <el-input type="text" v-model="tagData.Phonechange.phone" placeholder="请填写手机号">
                </el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="验证码" prop="code" is-required :rules="comm.rules.code">
              <Verifcode :value.sync="tagData.Phonechange.code" :phone="tagData.Phonechange.phone"></Verifcode>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="setPhone">确认变更</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {billView as base} from '../../../lib';
import customerPlugIn from './indexPlugIn';

const billView = {
	extends: base
};
billView.formId = 'ydj_customer';
billView.plugs = [new customerPlugIn({})];
billView.mixins = [
	{
		dependencies: ['authService'],
		methods: {
			Save() {
				let t = this;
				if (t.tagData.isEdit) {
					if (t.comm.IsNullOrEmpty(t.uiData.fcontacts)) {
						t.$message({
							message: '请输入联系人姓名',
							type: 'warning'
						});
						return;
					}
					if (t.comm.IsNullOrEmpty(t.uiData.fimage.id)) {
						t.uiData.fimage = t.tagData.headIcon;
					}
					t.menuItemClick({opcode: 'save', event: 'uiData'});
					t.tagData.headIcon = t.uiData.fimage;
					let linkIdentity = JSON.parse(JSON.stringify(t.$store.state.userCtx.linkIdentity));
					linkIdentity.name = t.uiData.fname;
					t.$store.commit('userCtx', {userHead: t.uiData.fimage.id, linkIdentity: linkIdentity});
					window.location.reload();
				} else {
					t.uiData.fimage = {id: ''};
				}
				t.tagData.isEdit = !t.tagData.isEdit;
			},
			confirm() {
				let t = this;
				t.$confirm('<span class="color-red">您将修改您注册时的手机，修改成功后将使用修改后的手机号进行登录,密码不变。<br/>若有一个账户对应多个角色或多企业切换的(可能导致其他企业账号无法使用)，请慎用改功能</span>', '警告', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					dangerouslyUseHTMLString: true
				})
					.then(() => {
						t.tagData.visible = !0;
					})
					.catch(() => {});
			},
			setPhone() {
				let t = this;
				t.$refs['setphone'].validate(valid => {
					if (!valid) {
						t.$message({
							message: '请完善当前订单信息',
							type: 'warning'
						});
						return false;
					}
					let t = this;
					t.axios.get('/sms/code/validate.json?mobilePhone=' + t.tagData.Phonechange.phone + '&authCode=' + t.tagData.Phonechange.code, {}).then(res => {
						if (res.data.operationResult.isSuccess === true) {
							t.axios.post('/dynamic/ydj_customer?operationno=setphone', {selectedRows: [{PKValue: t.uiData.id}], simpleData: {phone: t.tagData.Phonechange.phone}}).then(res => {
								t.$alert('恭喜您，联系电话变更成功', '温馨提示', {
									confirmButtonText: '确定',
									callback: action => {
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
											t.$localStorage.set('userName', t.tagData.Phonechange.phone);
											t.$router.push('/login');
										});
									}
								});
							});
						} else {
							t.$message.error('验证码错误');
						}
					});
				});
			}
		},
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
.userhead {
	width: 80px;
	height: 80px;
	border-radius: 40px;
	border: 1px solid #e8e8e8;
	overflow: hidden;
	> img {
		width: 80px;
		height: 80px;
	}
}
</style>
