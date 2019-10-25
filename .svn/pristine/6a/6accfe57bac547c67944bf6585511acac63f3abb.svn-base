<template>
  <span v-html="out"></span>
</template>
<script>
export default {
	data() {
		return {
			outformat: '',
			start: new Date(),
			end: new Date(),
			stop: false,
			out: ''
		};
	},
	props: {
		value: {},
		endTime: {},
		startTime: {},
		day: {},
		format: ''
	},
	mounted() {
		this.Init();
	},
	watch: {
		endTime(v) {
			this.Init();
		}
	},
	beforeDestroy() {
		this.stop = !0;
	},
	methods: {
		Init() {
			if (this.comm.IsNullOrEmpty(this.startTime)) {
				this.start = new Date(new Date().setDate(new Date().getDate() + parseInt(this.day)));
			} else {
				this.start = this.comm.toDate(this.startTime);
			}
			this.end = this.comm.toDate(this.endTime);
			this.outformat = this.value || this.format;
			this.exec();
		},
		exec() {
			let t = this;
			let now = this.start;
			let end = this.end;
			now.setSeconds(now.getSeconds() + 1);
			let days = Math.floor((end - now) / 1000 / 60 / 60 / 24);
			let hours =t.comm.fillZero(Math.floor((end - now) / 1000 / 60 / 60 - 24 * days));
			let minutes = t.comm.fillZero(Math.floor((end - now) / 1000 / 60 - 24 * 60 * days - 60 * hours));
			let seconds = t.comm.fillZero(Math.floor((end - now) / 1000 - 24 * 60 * 60 * days - 60 * 60 * hours - 60 * minutes));
			if (days < 0 || hours < 0 || minutes < 0 || seconds < 0) {
				if (this.value) {
					t.$emit('input', t.comm.StringFormat(t.outformat, {dd: 0, HH: 0, mm: 0, ss: 0}));
				} else {
					this.out = t.comm.StringFormat(t.outformat, {dd: 0, HH: 0, mm: 0, ss: 0});
				}
				return;
			}
			if (this.stop) {
				return;
			}
			if (this.value) {
				t.$emit('input', t.comm.StringFormat(t.outformat, {dd: days, HH: hours, mm: minutes, ss: seconds}));
			} else {
				this.out = t.comm.StringFormat(t.outformat, {dd: days, HH: hours, mm: minutes, ss: seconds});
			}
			setTimeout(() => {
				t.exec();
			}, 1000);
		}
	}
};
</script>
