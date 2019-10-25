<template>
  <div :class="['diy-radio',comm.IsNullOrEmpty(type)?'':'radio-'+type]" @click="Click($event)" ref="slot">
    <div v-if="enable" value="default">{{defaultTxt}}</div>
    <slot></slot>
  </div>
</template>
<script>
export default {
	props: {
		value: {},
		multiple: {},
		type: {},
		defaults: {},
		defaultTxt: {},
		readonly: {},
		readonly_msg: {},
		exit: {}
	},
	mounted() {
		let v = this.value;
		if (this.comm.IsNullOrEmpty(v)) {
			v = ['default'];
		} else {
			v = String(v).split(',');
		}
		for (let i = 0; i < this.$refs['slot'].children.length; i++) {
			const element = this.$refs['slot'].children[i];
			if (v.indexOf(element.getAttribute('value')) > -1) {
				element.className = 'is-active';
			} else {
				element.className = '';
			}
		}
	},
	computed: {
		enable() {
			return typeof (this.defaults == 'boolean') ? this.defaults : false;
		}
	},
	methods: {
		Click(obj) {
			if (this.readonly === true) {
				this.$message({
					message: this.readonly_msg,
					type: 'warning'
				});
				return;
			}
			let j = 0;
			let dom = obj.target;
			while (this.comm.IsNullOrEmpty(dom.getAttribute('value')) && j < 3) {
				j++;
				dom = dom.parentNode;
			}
			let v = dom.getAttribute('value');
			if (this.comm.IsNullOrEmpty(v)) {
				return;
			}
			if (this.multiple === true) {
				let vv = this.value.split(',');
				if (!this.comm.IsNullOrEmpty(v)) {
					if (this.value.indexOf(v) > -1) {
						this.comm.ArrayRemove(vv, o => {
							return o === v;
						});
					} else {
						vv.push(v);
					}
					this.comm.ArrayRemove(vv, o => {
						return this.comm.IsNullOrEmpty(o);
					});
					this.$emit('input', vv.join(','));
				}
			} else {
				if (this.exit === true && !this.comm.IsNullOrEmpty(this.value)) {
					v = '';
				}
				this.$emit('input', v);
			}
		}
	},
	watch: {
		value(v) {
			if (this.comm.IsNullOrEmpty(v)) {
				v = ['default'];
			} else {
				v = String(v).split(',');
			}
			for (let i = 0; i < this.$refs['slot'].children.length; i++) {
				const element = this.$refs['slot'].children[i];
				if (v.indexOf(element.getAttribute('value')) > -1) {
					element.className = 'is-active';
				} else {
					element.className = '';
				}
			}
		}
	}
};
</script>

<style lang="scss">
.diy-radio {
	display: inline-block;
	font-size: 0;
	& > * {
		display: inline-block;
		position: relative;
		font-size: 14px;
	}
}
.radio-round {
	& > * {
		position: relative;
		padding-left: 28px;
		&::before {
			content: '';
			height: 20px;
			width: 20px;
			display: inline-block;
			border: 1px solid #bbb;
			border-radius: 50%;
			box-sizing: border-box;
			line-height: 20px;
			text-align: center;
			font-size: 18px;
			color: #fff;
			position: absolute;
			left: 0;
			top: 50%;
			margin-top: -10px;
			cursor: pointer;
		}
		&.is-active::before {
			content: '\E611';
			font-family: element-icons !important;
			border: 0;
			background-color: #409eff;
		}
	}
}
.radio-radius {
	& > * {
		margin-right: 15px;
		line-height: 20px;
		padding: 4px 15px;
		cursor: pointer;
		&.is-active {
			background-color: #0086e4;
			color: #fff;
			border-radius: 14px;
		}
	}
}
.radio-border {
	& > * {
		border: 1px solid #bdbdbd;
		line-height: 40px;
		border-radius: 4px;
		width: 100px;
		margin-right: 40px;
		text-align: center;
		position: relative;
		cursor: pointer;
		&.is-active {
			border-color: #409eff;
			&::before {
				content: '';
				position: absolute;
				bottom: 0;
				right: 0;
				z-index: 1;
				width: 0;
				height: 0;
				border-bottom: 18px solid #409eff;
				border-left: 18px solid transparent;
			}
			&::after {
				content: '\E611';
				font-family: element-icons !important;
				position: absolute;
				bottom: 0;
				right: 0;
				z-index: 2;
				color: #fff;
				font-size: 8px;
				line-height: 10px;
			}
		}
	}
}
</style>