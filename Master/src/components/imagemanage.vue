<template>
  <dl class="images-dialog">
    <dt>
      <el-upload :action="config.fsApiUrl+'FileInfo/AjaxUpload'" :show-file-list="false" :headers="{authCode:config.authCode,sysCode:config.sysCode,isThumbnail: false, isPrintText: false, isPrintPic: false }" multiple :limit="limit" :before-upload="beforeEvent" :on-success="successEvent" ref="upload" :disabled="disabled" :on-exceed="exceedEvent">
        <el-button plain type="warning" class="margin-right">点击上传</el-button>
        <slot></slot><br><span class="color-red">(最多上传{{limit}}个文件)</span>
      </el-upload>
    </dt>
    <dd>
      <label>已添加的图片：</label>
      <ul>
        <li v-for="item in fileArray" :key="item.id">
          <div><img :src="item.url"></div><i @click="removeEvent(item)" class="el-icon-error"></i>
        </li>
      </ul>
    </dd>
  </dl>
</template>
<script>
export default {
	data() {
		return {
			config: this.$store.state.userCtx.upApi,
			temp_file: [],
			fileArray: [],
			disabled: false,
			filetype: ['image/png', 'image/jpg', 'image/jpeg'],
			isCall: false
		};
	},
	props: {
		value: {},
		limit: {},
		clear: {}
	},
	methods: {
		beforeEvent(file) {
			//通过文件名和大小校验文件重复
			let Exists = _.find(this.temp_file, o => {
				return o.size === file.size && o.name === file.name;
			});
			if (Exists != null) {
				this.$alert('这个文件已上传过了');
				return false;
			}
			if (this.temp_file.length < this.limit) {
				this.temp_file.push(file);
			} else {
				this.$alert('文件个数超出了限制');
				return false;
			}
			let t = this;
			if (t.filetype instanceof Array) {
				if (t.filetype.indexOf(file.type) == -1) {
					t.$alert('文件类型不符合');
					return false;
				}
			}
		},
		exceedEvent(a) {
			this.$alert('文件个数超出了限制');
			return false;
		},
		removeEvent(obj) {
			let t = this;
			if (t.fileArray.length == 1) {
				this.$alert('至少保留一个文件');
				return;
			}
			t.comm.ArrayRemove(t.fileArray, o => {
				return o.id === obj.id;
			});
			t.comm.ArrayRemove(t.temp_file, o => {
				return o.name == obj.name && o.size == obj.size;
			});
			this.isCall = !1;
			this.$refs.upload.clearFiles();
		},
		successEvent(file) {
			let t = null;
			if (this.fileArray.length > 0) {
				t = this._.find(this.fileArray, o => {
					return o.id === file.fileId;
				});
			}
			if (t == null) {
				this.fileArray.push({
					id: file.fileId,
					name: file.fileName,
					url: file.url,
					size: file.fileSize
				});
				this.isCall = !1;
			}
		}
	},
	mounted() {
		this.fileArray = this.value;
		//这里有个很神奇的Bug 如果直接把 V 赋值给 temp_file  当temp_file 变化了 fileArray 也变化了
		this.temp_file = this.value.map(o => {
			return o;
		});
	},
	watch: {
		fileArray(v) {
			if (!this.comm.IsNullOrEmpty(v) && !this.isCall) {
				this.$emit('input', v);
			}
		},
		value(v) {
			this.fileArray = v;
			//这里有个很神奇的Bug 如果直接把 V 赋值给 temp_file  当temp_file 变化了 fileArray 也变化了
			this.temp_file = v.map(o => {
				return o;
			});
			this.isCall = !0;
		},
		clear(v) {
			this.$refs.upload.clearFiles();
		}
	}
};
</script>
<style lang="scss" scoped>
.images-dialog {
	border: 1px solid #e7e7e7;
}
.images-dialog dt {
	border-bottom: 1px solid #e7e7e7;
	padding: 15px 30px;
}
.images-dialog dd {
	padding: 15px 30px;
}
.images-dialog dd ul {
	font-size: 0;
	margin: 10px -13px;
	height: 266px;
}
.images-dialog dd ul li {
	display: inline-block;
	margin: 13px;
	border: 1px solid #e7e7e7;
	box-sizing: content-box;
	position: relative;
}
.images-dialog dd ul li div {
	width: 100px;
	height: 100px;
	overflow: hidden;
}
.images-dialog dd ul li img {
	width: 100%;
}
.images-dialog-footer {
	text-align: center;
	padding: 20px 0 10px 0;
}
.el-icon-error {
	position: absolute;
	top: -10px;
	right: -10px;
	font-size: 20px;
}
</style>
