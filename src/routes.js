import Login from './views/login/index.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import HomeLogo from './views/homeLogo.vue'
import ServiceCfg from './views/system/serviceCfg.vue'
import SfsCfg from './views/system/sfsCfg.vue'
//import Form from './views/system/Form.vue'
//import user from './views/system/user.vue'
//import Page4 from './views/nav2/Page4.vue'
//import Page5 from './views/nav2/Page5.vue'
import temConfig from './views/temConfig/temConfig.vue'
import AddPage from './views/temConfig/addPage.vue'
import MethodView from './views/temConfig/methodView.vue'

import edit from './views/system/edit_table.vue'
import editall from './views/system/edit_all.vue'
import addtable from './views/system/add_table.vue'
//import echarts from './views/charts/echarts.vue'
//import Upload from './views/nav2/upload.htm'

let routes = [
	{ path: '/login', component: Login, name: '登录Admin', hidden: true },
  	{ path: '/404', component: NotFound, hidden: true },
  	
//  {
//      path: '/login',
//      component: Login,
//      name: '',
//      hidden: true
//  },
//  {
//      path: '/404',
//      component: NotFound,
//      name: '',
//      hidden: true
//  },
//  {
//      path: '/upload',
//      component: Upload,
//      name: '',
//      hidden: true
//  },
//  {
//  	path: '/',
//      component: Home,
//      name: '首页',
//      iconCls: 'el-icon-message',//图标样式class
//      children: [
//          { path: '/main', component: Main, name: '主页', hidden: true },
//      ]
//  },
    { 
    	path: '/', 
    	component: Home,
//  	name: '',
    	meta: { title: 'HomeLogo', icon: 'fa fa-address-card' },
    	iconCls: 'fa fa-address-card',//图标样式class
    	leaf: true,//只有一个节点
        children: [
            { path: '/main', component: HomeLogo, name: '主页',meta: { title: 'HomeLogo', icon: 'fa fa-address-card' }},
        ]
    },
//  {
//      path: '/',
//      component: Home,
//      name: '系统配置',
//      iconCls: 'fa fa-id-card-o',//图标样式class
//      children: [
//          { path: '/table', component: Table, name: 'Table' },
//          { path: '/form', component: Form, name: 'Form' },
//          { path: '/user', component: user, name: '列表' },
//      ]
//  },
	{ 
    	path: '/', 
    	component: Home,
//  	name: '',
    	meta: { title: 'SfsCfg', icon: 'fa fa-id-card-o' },
    	iconCls: 'fa fa-id-card-o',//图标样式class
    	leaf: true,//只有一个节点
        children: [
            { path: '/sfsCfg', component: SfsCfg, name: '系统配置',meta: { title: 'SfsCfg', icon: 'fa fa-id-card-o' }},
        ]
    },
//  {
//      path: '/',
//      component: Home,
//      name: '',
//      iconCls: 'fa fa-id-card-o',
//      leaf: true,//只有一个节点
//      children: [
//          { path: '/sfsCfg', component: SfsCfg, name: '系统配置' }
//      ]
//      children: [
//          { path: '/serviceCfg', component: ServiceCfg, name: '系统服务配置' },
//          { path: '/page4', component: Page4, name: '文件管理配置' },
//          { path: '/page5', component: Page5, name: '文档引擎配置' },
//          { path: '/addPage', component: AddPage, name: '增加药品info' }
//      ]
//  },
	{ 
    	path: '/', 
    	component: Home,
//  	name: '',
    	meta: { title: 'temConfig', icon: 'fa fa-address-card' },
    	iconCls: 'fa fa-id-card-o',//图标样式class
    	leaf: true,//只有一个节点
        children: [
            { path: '/temConfig', component: temConfig, name: '模板配置',meta: { title: 'temConfig', icon: 'fa fa-address-card' }},
        ]
    },
//  {
//      path: '/',
//      component: Home,
//      name: '',
//      iconCls: 'fa fa-address-card',
//      leaf: true,//只有一个节点
//      children: [
//          { path: '/temConfig', component: temConfig, name: '模板配置' }
//      ]
//  },
//  {
//      path: '/',
//      component: Home,
//      name: 'Charts',
//      iconCls: 'fa fa-bar-chart',
//      children: [
//          { path: '/echarts', component: echarts, name: 'echarts' }
//      ]
//  },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;