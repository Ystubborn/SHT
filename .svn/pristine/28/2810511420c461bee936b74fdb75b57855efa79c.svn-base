<template>
  <div>
    <div class="corner-marker" :data-count="images.length" v-if="type==='marker'">
      <img @load.once="getUrl(images)" :src="setUrl(images[0])" @click="lookImages($event,images[0])" @keyup.esc="close()" />
    </div>
    <img v-if="type==='headPort'" @load.once="getUrl(images)" :src="setUrl(images[0],true)">
    <ul v-if="type==='list'&&!comm.IsNullOrEmpty(source)" class="img-array">
      <li v-for="item in images" :key="item">
        <img @load.once="getUrl(item)" :src="setUrl(item)" @click="lookImages($event,item)">
      </li>
    </ul>
    <div v-if="visible" class="lookimages-panel">
      <div class="close" @click="close()"></div>
      <div class="big-img">
        <img :src="lookData.url">
      </div>
      <i :class="[lookData.left,'el-icon-arrow-left']" @click="lookData.index--"></i>
      <i :class="[lookData.right,'el-icon-arrow-right']" @click="lookData.index++"></i>
    </div>
  </div>
</template>

<style lang="scss">
.corner-marker {
	position: relative;
	width: 80px;
	height: 80px;
	border: 1px solid #e8e8e8;
	border-radius: 4px;
	overflow: hidden;
	cursor: zoom-in;
	display: inline-block;
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		width: 0;
		height: 0;
		border-top: 26px solid #409eff;
		border-right: 26px solid transparent;
	}
	&::after {
		content: attr(data-count);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		display: block;
		color: #fff;
		font-size: 12px;
		position: absolute;
		line-height: 20px;
		width: 26px;
		height: 26px;
		text-indent: 4px;
		text-align: left;
	}
	img {
		width: 100%;
		height: 100%;
	}
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
		text-align: center;
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
	.el-icon-arrow-left,
	.el-icon-arrow-right {
		position: absolute;
		top: 50%;
		display: block;
		width: 60px;
		font-size: 60px;
		height: 120px;
		line-height: 120px;
		margin-top: -90px;
		left: 50%;
		cursor: pointer;
	}
	.el-icon-arrow-left {
		margin-left: -480px;
		border-radius: 8px 0 0 8px;
	}
	.el-icon-arrow-right {
		margin-left: 420px;
		border-radius: 0 8px 8px 0;
	}
	.el-icon-arrow-left.none,
	.el-icon-arrow-right.none {
		display: none;
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
.img-array {
	font-size: 0;
	li {
		display: inline-block;
		margin-right: 10px;
		border: 1px solid #e8e8e8;
		height: 80px;
		width: 80px;
		box-sizing: content-box;
		cursor: zoom-in;
		img {
			width: 80px;
			height: 80px;
		}
	}
}
</style>

<script>
export default {
	computed: {
		images() {
			this.imgArray = [];
			if (this.comm.IsNullOrEmpty(this.source)) {
				return [];
			}
			let ref = this.source instanceof Array ? this.source : this.source.split(',');
			let idarr = [];
			for (let i = 0; i < ref.length; i++) {
				let m = ref[i].match(/([\S]{32})\?/);
				if (m != null) {
					idarr.push(m[1]);
				}
			}
			if (idarr.length > 0) {
				return idarr;
			}
			return ref;
		},
		setUrl() {
			let t = this;
			return (a, b) => {
				if (b) {
					return (
						_.find(t.imgArray, o => {
							return o.id === a;
						}) || {url: require('../assets/images/default/head.png')}
					).url;
				}
				return (
					_.find(t.imgArray, o => {
						return o.id === a;
					}) || {url: require('../assets/images/default/image.png')}
				).url;
			};
		},
		lookIndex() {
			return this.lookData.index;
		}
	},
	data() {
		return {
			imgArray: [],
			visible: false,
			lookData: {left: 'none', right: 'none', url: '', index: 0, list: []}
		};
	},
	methods: {
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
				if (srvData instanceof Array) {
					for (let i = 0; i < srvData.length; i++) {
						let fileid = srvData[i].fileId;
						if (
							_.find(t.imgArray, o => {
								return o.id === fileid;
							}) == null
						) {
							t.imgArray.push({id: fileid, url: srvData[i].url});
						}
					}
				}
				t.lookData.list = t.imgArray;
			});
		},
		lookImages(dom, key) {
			let t = this;
			document.body.style.overflow = 'hidden';
			t.lookData.url = dom.path[0].src;
			t.lookData.index = t.comm.ObjectArrayIndex(t.imgArray, o => {
				return o.id === key;
			});
			t.lookData.left = t.lookData.index > 1 ? '' : 'none';
			t.lookData.right = t.lookData.index < t.imgArray.length - 1 ? '' : 'none';
			document.onkeydown = function() {
				let _key = window.event.keyCode;
				if (_key === 27) {
					t.close();
				}
			};
			t.visible = true;
		},
		close() {
			document.body.style.overflow = '';
			document.onkeydown = null;
			this.visible = false;
		}
	},
	props: ['source', 'type'],
	watch: {
		lookIndex(v) {
			let t = this;
			t.lookData.left = v > 0 ? '' : 'none';
			t.lookData.right = v < t.imgArray.length - 1 ? '' : 'none';
			t.lookData.url = t.imgArray[v].url;
		}
	}
};
</script>

