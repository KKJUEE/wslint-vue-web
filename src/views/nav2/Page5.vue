<template>
	<div>
		<HtmlPanel :url.asyc="url1"></HtmlPanel>
	</div>
</template>

<script>

export default{
  data () {
   return {
    url1: '',
    url2: ''
   }
  },
  mounted () {
   this.url1 = '/static/upload.htm'
  },
  methods: {
  }
 }
</script>

<style lang="scss" scoped>
	
</style>