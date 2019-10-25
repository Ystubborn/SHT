<template>
  <div style="display:inline-block;vertical-align: middle" class="margin-right">
    <el-upload :disabled="enable" :action="config.fsApiUrl+'FileInfo/AjaxUpload'" list-type="picture-card" :headers="{authCode:config.authCode,sysCode:config.sysCode,isThumbnail: false, isPrintText: false, isPrintPic: false }" :file-list="loadlist" :limit="limit" :multiple="multiple" :on-success="successEvent" :on-remove="removeEvent" :on-preview="handlePictureCardPreview" :before-upload="beforeAvatarUpload">
      <i class="el-icon-plus"></i>
    </el-upload>
    <div v-if="visible" class="lookimages-panel">
      <div class="close" @click="visible=!1"></div>
      <div class="big-img">
        <img :src="imageUrl">
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.el-upload--picture-card,
.el-upload-list--picture-card .el-upload-list__item {
	width: 86px;
	height: 86px;
}
.el-upload--picture-card {
	line-height: 86px;
}
.lookimages-panel {
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 3000;
	background-color: #000;
	.close {
		width: 30px;
		height: 30px;
		line-height: 0;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 50%;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-top: -335px;
		margin-left: 365px;
		z-index: 3002;
		&::before {
			content: '\E60F';
			font-size: 22px;
			line-height: 30px;
			font-family: element-icons !important;
			color: #ccc;
			cursor: pointer;
		}
	}
	.big-img {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 800px;
		height: 600px;
		overflow: auto;
		z-index: 3001;
		margin-left: -400px;
		margin-top: -340px;
		box-sizing: border-box;
		&::-webkit-scrollbar {
			width: 0px;
		}
		img {
			width: 100%;
		}
	}
}
</style>

<script>
export default {
	data() {
		return {
			config: this.$store.state.userCtx.upApi,
			imageUrl: '',
			visible: false,
			filelist: [],
			loadlist: []
		};
	},
	props: {
		limit: {},
		value: {},
		disabled: {},
		size: {default: 0},
		multiple: {default: true}
	},
	created() {
		this.getUrl(this.value.id);
	},
	computed: {
		enable() {
			return typeof (this.disabled == 'boolean') ? this.disabled : false;
		}
	},
	methods: {
		beforeAvatarUpload(file) {
			if (this.size == 0) {
				return true;
			}
			const isLt2M = file.size / 1024 < this.size;
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 ' + this.size + 'KB!');
			}
			return isLt2M;
		},
		handlePictureCardPreview(file) {
			this.imageUrl = file.url;
			this.visible = true;
		},
		successEvent(file) {
			let t = null;
			if (this.filelist.length > 0) {
				t = this._.find(this.filelist, o => {
					return o.id === file.fileId;
				});
			}
			if (t == null) {
				this.filelist.push({
					id: file.fileId,
					name: file.fileName,
					url: file.url,
					size: file.fileSize
				});
			}
		},
		removeEvent(file, fileLists) {
			this.comm.ArrayRemove(this.filelist, o => {
				return o.size == file.size && o.name == file.name;
			});
		},
		getUrl(data) {
			let t = this;
			if (this.comm.IsNullOrEmpty(data)) {
				return;
			}
			if (data instanceof Array) {
				data = data.join();
			}
			t.axios.post('/fileinfo', {fileId: data, thumbnail: false}).then(res => {
				let srvData = res.data.operationResult.srvData;
				let temp = [];
				srvData.forEach(element => {
					temp.push({id: element.fileId, name: '', url: element.url, size: 0});
					t.loadlist.push({id: element.fileId, url: element.url});
				});
				t.filelist = temp;
			});
		}
	},
	watch: {
		filelist(v) {
			this.$emit('input', {id: _.map(this.filelist, 'id').join(), fname: _.map(this.filelist, 'name').join()});
		}
	}
};
</script>

