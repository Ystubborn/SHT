<template>
</template>
<script>
export default {
	created() {
		let _route = JSON.parse(localStorage.getItem('Alipay'));
		localStorage.removeItem('Alipay');
		this.$router.push(_route);
	}
};
</script>

