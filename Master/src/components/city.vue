<template>
  <div class="city_box">
    <el-cascader expand-trigger="hover" :options="options" change-on-select v-model="vmodel" @change="handleChange" :disabled="enable" :placeholder="placeold" :size="size">
    </el-cascader>
  </div>
</template>

<script>
import {vueCityDatas} from './../services/city-picker.data';
export default {
	data() {
		return {
			vmodel: [],
			options: [],
			placeold: '请选择省市区'
		};
	},
	props: {
		value: {},
		disabled: {},
		size: {},
		len: {default: 3},
		level: {default: 3}
	},
	methods: {
		handleChange(val) {
			if (val.length >= parseInt(this.len)) {
				this.$emit('input', val);
			}
		}
	},
	computed: {
		enable() {
			return typeof (this.disabled == 'boolean') ? this.disabled : false;
		}
	},
	mounted() {
		if (typeof this.value === 'object') {
			for (let i in this.value) {
				this.vmodel.push(this.value[i]);
			}
		}
		if (this.level == 3) {
			this.options = vueCityDatas;
		} else {
			let t = this;
			this.options = vueCityDatas.map(o => {
				if (t.level == 1) {
					delete o.children;
				} else {
					o.children.map(a => {
						delete a.children;
						return a;
					});
				}
				return o;
			});
			t.placeold = t.level == 1 ? '请选择省' : '请选择省市';
		}
	},
	watch: {
		value(v) {
			this.vmodel = v;
		}
	}
};
</script>
<style scoped>
.city_box span {
	width: 100%;
}
</style>