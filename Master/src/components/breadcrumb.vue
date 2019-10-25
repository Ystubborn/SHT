<template>
  <div class="w block-center breadcrumb">
    您的位置：
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in data" :key="item.a" :to="item.b">{{item.a}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
	props: ['data']
};
</script>
<style lang="scss">
.breadcrumb {
	height: 40px;
	line-height: 40px;
	position: relative;
	font-size: 14px;
}
.breadcrumb .el-breadcrumb {
	position: absolute;
	left: 80px;
	top: 13px;
}
</style>

