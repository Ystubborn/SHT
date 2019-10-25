<template>
  <div>
    <BreadCrumb :data="[{a: '我要报案', b: {path: '/droit/insure'}}, {a: '客户意外申报'}]"></BreadCrumb>
    <div class="main-content w block-center safeinsure" v-if="!comm.IsNullOrEmpty(uiData)">
      <div class="title border-bottom-solid margin-bottom">订单信息</div>
      <el-form :model="uiData" :rules="rules" ref="uiData" label-width="130px">
        <el-form-item label="关联订单号：" is-required>
          <el-col :span="9" class="margin-right">
            <el-form-item prop="fsourcenumber">
              <el-input type="text" v-model.trim="uiData.fsourcenumber" placeholder="请输入订单号" class="margin-right"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" class="relative color-blue lookorder">
            <i class="icon blue-warning"></i>如何查看单号
          </el-col>
          <el-col :span="4">
            <ImgRender type="list" :source="'4995cb4576db1e0ccbc3196ad205db64'"></ImgRender>
          </el-col>
        </el-form-item>
        <div class="title border-bottom-solid margin-bottom">个人信息</div>
        <el-form-item label="联系电话：" is-required prop="fphone">
          <el-input type="text" v-model.trim="uiData.fphone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="身份证信息：" is-required prop="fidcar1.id">
          <el-col :span="9">
            <el-form-item prop="fidcar1.id">
              <div class="card-panel">
                <Upload :limit="1" :multiple="false" v-model="uiData.fidcar1" class="z"></Upload>
                <p>身份证正面</p>
                <p class="color-gray font12">上传人像面</p>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item prop="fidcar2.id">
              <div class="card-panel">
                <Upload :limit="1" :multiple="false" v-model="uiData.fidcar2" class="f"></Upload>
                <p>身份证反面</p>
                <p class="color-gray font12">上传国徽面</p>
              </div>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="您的姓名：" is-required prop="fname">
          <el-input type="text" v-model.trim="uiData.fname" placeholder="请输入您的姓名"></el-input>
        </el-form-item>
        <el-form-item label="您的身份证号：" is-required prop="fidcard">
          <el-input type="text" v-model.trim="uiData.fidcard" placeholder="请输入您的身份证号"></el-input>
        </el-form-item>
        <div class="title border-bottom-solid margin-bottom">案件信息</div>
        <el-form-item label="损失费用：" is-required prop="fdamagesprice">
          <el-input type="number" v-model.trim="uiData.fdamagesprice" placeholder="请输入您的损失费用"></el-input>
        </el-form-item>
        <el-form-item label="事故现场照片：" prop="faccidentimage.id" is-required>
          <Upload :limit="5" v-model="uiData.faccidentimage"></Upload>
        </el-form-item>
        <el-form-item label="损伤照片：" prop="fendimage.id" is-required>
          <Upload :limit="5" v-model="uiData.fendimage"></Upload>
        </el-form-item>
        <el-form-item label="案情描述" prop="fdescription" is-required>
          <el-input :maxlength="200" class="textarea-big" :rows="4" type="textarea" v-model="uiData.fdescription" placeholder="请准确描述案情（100字以内）"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center btn-panel">
        <el-button type="orange" @click="Save">提交申请</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {billView as base} from '../../../lib';
import initbillPlugIn from './initbillPlugIn';
const billView = {
	extends: base
};
billView.formId = 'ydj_safesettle';
billView.plugs = [new initbillPlugIn({})];
billView.mixins = [
	{
		methods: {
			Save() {
				let t = this;
				t.$refs['uiData'].validate(valid => {
					if (!valid) {
						t.$message({
							message: '请完善当前信息',
							type: 'warning'
						});
						return;
					}
					t.uiData.fcode = t.$store.state.userCtx.linkIdentity.id; //商户id
					t.uiData.fsafetype.id = 'fsafe_type_01';
					t.menuItemClick({opcode: 'save', event: 'uiData'});
				});
			}
		}
	}
];
export default billView;
</script>
<style lang="scss">
.safeinsure {
	.el-input {
		width: 380px;
	}
	.lookorder {
		padding-left: 18px;
	}
	.blue-warning {
		position: absolute;
		top: 14px;
		left: 3px;
	}
	.img-array {
		li {
			width: 120px;
			height: 40px;
			box-sizing: border-box;
			& > img {
				width: 120px;
				height: 40px;
			}
		}
	}
	.card-panel {
		& > div {
			width: 242px;
			height: 153px;
			overflow: hidden;
		}
		.el-upload-list__item {
			width: 242px;
			height: 153px;
			border-radius: 0;
		}
		.el-upload--picture-card {
			width: 242px;
			height: 153px;
			border: none;
			background-image: url(../../../assets/images/icon.png);
			border-radius: 0;
			> i {
				display: none;
			}
		}
		.z {
			.el-upload--picture-card {
				background-position: -146px -412px;
			}
		}
		.f {
			.el-upload--picture-card {
				background-position: -398px -412px;
			}
		}
		width: 242px;
		text-align: center;
		line-height: 24px;
	}
}
</style>
