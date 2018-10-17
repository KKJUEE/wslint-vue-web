<template>
	<div v-html="path"></div>
</template>

<script>

export default {
	data() {
		return {
			path: "./upload.htm"
		}
	},
	methods: {
      	uploadHtml() {
      		path: "./upload.htm"
      	}
    }
};
</script>

<style lang="scss" scoped>
	
</style>