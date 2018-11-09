<template>
	<section>
		<el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane name="first">
		    	<span slot="label"><i class="el-icon-date"></i> 服务配置</span>
		    	<service-cfg v-show="isShowService"></service-cfg>
		    </el-tab-pane>
		    <el-tab-pane label="系统启动配置" name="second">系统启动配置</el-tab-pane>
		    <el-tab-pane label="药品配置" name="third">药品配置</el-tab-pane>
		    <el-tab-pane label="方法库配置" name="four">方法库配置</el-tab-pane>
		 </el-tabs>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import ServiceCfg from './serviceCfg'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				activeName: 'first',
				isShowService: true
			}
		},
		methods: {
			handleClick(tab, event) {
				if(tab.index === '0') {
					this.isShowService = true;
				}
		        console.log(tab, event);
	     	}
		},
		components: {
			'service-cfg': ServiceCfg
		},
		mounted() {
			
		}
	}

</script>

<style scoped>

</style>