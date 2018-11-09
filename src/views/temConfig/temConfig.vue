<template>
	<div id="app_container">
		<div class="expand">
			<div>
				<el-button type="primary" @click="addMedicie">新增药品</el-button>
				<!--<el-button type="primary" @click="dowloadTem">保存模板</el-button>-->
				<a id="downA" :href="htmlSrc" download hidden="true"><span id="downFile" @click="downloadSpan"></span></a>
			</div>
			<div class="block_left">
				<!--使用图标展示增删改-->
				<!--:load="loadNode1" lazy-->
				<el-tree class="expand-tree" accordion check-on-click-node ref="tree" v-if="isLoadingTree" :load="loadNode1" lazy :data="setTree" node-key="id" highlight-current :props="defaultProps" :expand-on-click-node="true" :render-content="renderContent" :default-expanded-keys="defaultExpandKeys" @node-click="handleNodeClick">
				</el-tree>
			</div>
		</div>
		<div class="add-page" v-if="isAction">
			<!--使用组件方式引入vue，数据传递不可控-->
			<!--直接采用页面-->
			<div id="add-app-container">
				<!--
			        	作者：offline
			        	时间：2018-10-16
			        	描述：展示增加药品信息，包括名称和工厂信息
			        -->
				<!--  label属性      -->
				<div v-if="isAddMed">
					<div class="label-title">
						<span class="label-title-span">添加药品</span>
						<div>
							<el-button type="primary" @click="contiAddMedicie('addForm')">继续添加</el-button>
							<el-button type="primary" @click="confirmAddMed('addForm')">完成</el-button>
							<!--<el-button type="primary" @click="addFirstType">添加类别</el-button>-->
						</div>
					</div>
					<div class="custom-tree-container">
						<el-tabs type="card" style="width: 100%;border: 0;">
							<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
								<el-form-item label="药品名称" prop="drugName">
									<el-input style="width: 20%;" v-model="addForm.drugName" auto-complete="off"></el-input>
								</el-form-item>
								<el-form-item label="工厂信息" prop="factory">
									<el-input style="width: 20%;" v-model="addForm.factory" auto-complete="off"></el-input>
								</el-form-item>
							</el-form>
						</el-tabs>
					</div>
				</div>

				<!--
			        	作者：offline
			        	时间：2018-10-16
			        	描述：展示增加类型（大类信息）
			        -->
				<div v-if="isAddFirst">
					<div class="label-title">
						<span class="label-title-span">添加类别</span>
						<div>
							<el-button type="primary" @click="contiAddType('addForm')">继续添加</el-button>
							<el-button type="primary" @click="comfirmAddFir('addForm')">完成</el-button>
							<!--<el-button type="primary" @click="addSecondType">添加鉴定方法</el-button>-->
						</div>
					</div>
					<div class="custom-tree-container">
						<el-tabs type="card" style="width: 100%;border: 0;">
							<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
								<el-form-item label="类别名称" prop="firstType">
									<el-input style="width: 20%;" v-model="addForm.firstType" auto-complete="off"></el-input>
								</el-form-item>
							</el-form>
						</el-tabs>
					</div>
				</div>
				<!--
			        	作者：offline
			        	时间：2018-10-16
			        	描述：添加小类并导入模板
			        -->
				<div v-if="isAddSec">
					<div class="label-title">
						<span class="label-title-span">添加鉴定方法</span>
						<div>
							<el-button type="primary" @click="contiAddType('addForm')">继续添加</el-button>
							<el-button type="primary" @click="comfirmAddSec('addForm')">完成</el-button>
						</div>
					</div>
					<div class="custom-tree-container">
						<el-tabs type="card" style="width: 100%;border: 0;">
							<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
								<el-form-item label="鉴定方法" prop="secondType">
									<el-input style="width: 20%;" v-model="addForm.secondType" auto-complete="off"></el-input>
								</el-form-item>
							</el-form>
						</el-tabs>
					</div>
				</div>
				<div v-if="isShowUpload">
					<div class="label-title">
						<span class="label-title-span">无模板导入,请导入模板</span>
					</div>
					<div class="custom-tree-container">
						<el-tabs type="card" style="width: 100%;border: 0;">

							<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
								<el-form-item label="选择模板" prop="secondType">
									<el-upload class="upload-demo" ref="upload" :action="importFileUrl" :data="upLoadData" :before-upload="beforeAvatarUpload" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :limit="fileNum" :auto-upload="false">
										<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
										<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
										<div slot="tip" class="el-upload__tip">只能上传html文件，且只能上传一个</div>
									</el-upload>
								</el-form-item>
							</el-form>
						</el-tabs>
					</div>
				</div>
			</div>
		</div>
		<!--
        	作者：offline
        	时间：2018-10-18
        	描述：html模板加载
        -->
		<div v-if="isShowPanel" id="get_iframe" class="show-html-panel" v-bind:style="{height: clientHeight.height}">
			<iframe id="child_iframe" class="iframe_class" v-bind:style="{height: clientHeight.height}" :src="htmlSrc" frameborder="1" scrolling="auto"></iframe>
		</div>
		<!-- v-bind:style="{height: clientHeight.height}"-->
		<!--
        	作者：offline
        	时间：2018-10-18
        	描述：模板操作页
        -->
		<div v-if="isShowPaCfg" class="show-config-panel" v-bind:style="{height: clientHeight.height}">
			<!--v-bind:style="{height: clientHeight.height}"-->
			<el-tabs type="border-card" style="overflow: auto;" v-bind:style="{height: clientHeight.height}">
				<el-tab-pane label="参数管理">
					<el-form class="config-form-item" :rules="formCfgRules" ref="formCfg" :model="form" label-width="120px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;font-size: 12px;">
						<div style="margin-bottom: 20px;">
							<el-button @click="createCfg('formCfg')" type="primary">完成创建</el-button>
							<el-button @click="cancelCfg">取消</el-button>
						</div>
						<el-form-item label="方法：" prop="funcModel">
							<!--方法参数动态绑定-->
							<el-select v-model="form.funcModel" requeir=true placeholder="请选择方法" @change="funcSelect">
								<el-option v-for="item in funcObj.optionFunc" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<!--方法为table时，展示行、值、列信息-->
						<el-form-item v-if="formView.codeShow" label="方法属性:" prop="codeModel">
							<el-select v-model="form.codeModel" placeholder="请选择行定位" @change="codeSelect">
								<el-option v-for="item in funcObj.optionCode" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="杂质名称：" v-if="formView.valueShow" prop="valueModel">
								<el-select v-model="form.valueModel" placeholder="请选择值">
									<!-- @change="valueSelect"-->
									<el-option v-for="item in funcObj.optionValue" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="计算结果属性：" v-if="formView.subSelectShow" prop="subSelectModel">
								<el-select v-model="form.subSelectModel" placeholder="请选择列定位">
									<!-- @change="subSelect"-->
									<el-option v-for="item in funcObj.optionSubSelect" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						<el-form v-if="isShowParams" class="config-form-item" :label-position="labelPosition" ref="formCfg" :model="form" label-width="80px" @submit.prevent="onSubmit" style="width:60%;min-width:600px;margin-top: -30px;">
							<el-form-item label="参数列表：" prop="paramRule">
								<el-form-item v-for="item in paramsList" :key="item.value">
									<div class="param-select">
										<span>{{item.paramDes}}</span>
										<el-button class="param-select-child" type="primary" plain icon="fa fa-chain-broken" size="mini" circle @click="paramsCh(item)"></el-button>
										<label class="param-select-child">{{item.select_params_a}}</label>
										<el-button v-if="item.isShowAddBtn" class="param-select-child" type="primary" plain icon="el-icon-plus" size="mini" circle @click="addParam(item)"></el-button>
										<el-button v-if="!item.isShowAddBtn" class="param-select-child" type="primary" plain icon="el-icon-minus" size="mini" circle @click="removeParam(item)"></el-button>
									</div>
									<!--清除浮动-->
									<div style="clear: both;"></div>
								</el-form-item>
							</el-form-item>
						</el-form>

						<el-form class="config-form-item" ref="formCfg" :model="form" label-width="120px" @submit.prevent="onSubmit" style="width:60%;min-width:600px;">
							<el-form-item v-if="isVerify">
								<el-button type="primary">验证计算：</el-button>
							</el-form-item>
							<el-form-item v-if="isVerify" label="验证结果">
								<el-input v-model="form.testCase" placeholder="验证结果"></el-input>
							</el-form-item>
							<el-form-item label="位数：" prop="unitRule">
								<el-input v-model="form.units" placeholder="请输入精确位数"></el-input>
							</el-form-item>
							<el-form-item label="风格：" prop="styleRule">
								<el-select v-model="form.course" placeholder="请选择推导过程">
									<el-option v-for="item in funcObj.style" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
						</el-form>
					</el-form>
				</el-tab-pane>
			</el-tabs>

		</div>
		<!--
        	作者：offline
        	时间：2018-10-19
        	描述：为了选择参数之后屏蔽参数选择菜单，不可选择
        -->
		<div class="cannot-select" v-if="connotSelect" v-bind:style="{height: clientHeight.height}"></div>
		<!--
        	作者：offline
        	时间：2018-10-23
        	描述：方法配置
        	params: ref子组件在父组件的名称，在父调用子方法时使用，this.$ref...
        			@say 接收子组件传递的msg
        -->
		<method-view ref="methodView" class="method-cfg" v-show="isMethodView" :msg="1" @say="parentSay"></method-view>
		<method-cfg ref="methodCfg" class="method-cfg" v-show="isMethodCfg" :msg="2" @say="parentSay"></method-cfg>
	</div>
	<!--</div>-->
</template>
<!-- 树形控件添加增删改功能按钮 -->
<!--
	作者：wsl-rzg
	时间：2018-10-17
	描述：树形控件添加增删改功能按钮
-->
<script>
	import TreeRender from './tree_render'
	import { mapState, mapActions } from 'vuex'
	//引入方法预览
	import MethodView from './methodView'
	import MethodCfg from './methodCfg'
	//数据结构
	import api from '../../api/tree_api'
	//模拟空格的参数关联
	import config_api from '../../api/config_api'

	export default {
		name: 'tree',
		//父组件通过props属性传递进来的数据
		props: {
			msg: {}
		},
		data() {
			return {
				relateListAll: [],
				maxexpandId: api.maxexpandId, //新增节点开始id
				non_maxexpandId: api.maxexpandId, //新增节点开始id(不更改)
				isLoadingTree: false, //是否加载节点树
				setTree: [], //节点树数据
				exapTree: api.treelist,
				defaultProps: {
					children: 'children',
					label: 'name',
					//是否为叶子节点，仅在指定了 lazy 属性的情况下生效
					isLeaf: 'leaf'
				},
				defaultExpandKeys: [], //默认展开节点列表
				//是否展示添加页面
				//文件模板导入
				dialogImageUrl: '',
				dialogVisible: false,
				addFormRules: {
					drugName: [{
						required: true,
						message: '请输入药品名称',
						trigger: 'blur'
					}],
					factory: [{
						required: true,
						message: '请输入工厂信息',
						trigger: 'blur'
					}],
					firstType: [{
						required: true,
						message: '请输入类别名称',
						trigger: 'blur'
					}],
					secondType: [{
						required: true,
						message: '请输入工厂信息',
						trigger: 'blur'
					}]
				},
				//新增界面数据
				addForm: {
					drugName: '',
					factory: '',
					firstType: '',
					secondType: ''
				},
				//编辑界面控制
				isAction: false,
				isAddMed: false,
				isAddFirst: false,
				isAddSec: false,
				//模板url
				panel_url: '',
				//展示模板
				isShowPanel: false,
				//展示模板空格编辑
				isShowPaCfg: false,
				//保存空格配置时的空格id
				configPassId: '',
				//模板空格编辑
				form: {
					testCase: '',
					units: '',
					course: '',
					funcModel: '',
					codeModel: '',
					valueModel: '',
					subSelectModel: ''
				},
				//判断方法的行、值、列是否展示
				formView: {
					codeShow: false,
					valueShow: false,
					subSelectShow: false
				},
				//空格配置中的方法选择
				funcObj: {
					optionFunc: [],
					optionCode: [],
					optionValue: [],
					optionSubSelect: [],
					style: []
				},
				//保存界面展示的参数列表
				paramsList: [],
				//判断是否是参数最后一项,初始化
				isAddBtnShow: true,
				isRemBtnShow: false,
				valueList: [],
				//保存增/删/改的节点信息
				nodes: {
					s: '',
					d: '',
					n: ''
				},
				//已选择的参数保存
				select_params_a: [],
				//是否屏蔽右侧配置界面
				connotSelect: false,
				//控制数据源选择窗口，位数/风格的form风格，是单独设置的
				labelPosition: 'top',
				//编辑树节点时的title
				editNodeTitle: '修改',
				//编辑tree时的参数回填
				editTreeMess: '',
				//方法配置
				numMsg: 1,
				//允许上传的文件个数
				fileNum: 1,
				//上传的文件列表
				fileList: [],
				isMethodView: false,
				isMethodCfg: false,
				//根据空格配置界面的方法选择展示内容
				isShowFormula: false,
				//选择了杂质之后，会出现下拉选择
				isShowSecForm: false,
				//是否验证计算
				isVerify: false,
				//显示参数
				isShowParams: false,
				//方法配置中的方法是否选择
				isHasFuncCfg: false,
				//检测浏览器高度
				clientHeight: {
					height: ''
				},
				//方法参数配置触发的配置
				isMethodParam: false,
				//方法配置传递的参数
				method_params: [],
				//在添加药品界面打开添加类别的界面，保存已生成的药品id
				afterPostMed: '',
				//在添加类别界面打开添加类别的界面，保存已生成的类别id
				afterPostFir: '',
				htmlSrc: '',
				//'http://192.168.1.125:8080/opt/server/product/1/document/html/htmlTemplate/度他雄胺-性状/TR 01-008-01.02度他雄胺检验记录_性状_外观.htm'
				//保存html模板查询的信息,重要信息！！！
				htmlTemData: [],
				//获取小类信息之后，保存小类的节点信息
				temNode: [],
				//上传模板的地址
				uploadSrc: '',
				importFileUrl: '',
				upLoadData: {
					medicineId: '',
					//大类id
					firstClassId: '',
					//获取节点id
					secondClassId: ''
				},
				//保存当前的spaceid
				spaceId: '',
				//是否展示模板上传,查询小类info，如果没有模板则展示
				isShowUpload: false,
				//判断页面切换的标识，
				originPage: '',
				//模板空格配置中的表单验证
				formCfgRules: {
					funcModel: [{
						required: true,
						message: '请选择方法',
						trigger: 'change'
					}],
					codeModel: [{
						required: true,
						message: '请选择行信息',
						trigger: 'change'
					}],
					valueModel: [{
						required: true,
						message: '请选择值',
						trigger: 'change'
					}],
					subSelectModel: [{
						required: true,
						message: '请选择列信息',
						trigger: 'change'
					}],
					paramRule: [{
						required: true,
						message: '请选择参数',
						trigger: 'change'
					}],
					unitRule: [{
						required: true,
						message: '请填写显示位数',
						trigger: 'blur'
					}],
					styleRule: [{
						required: true,
						message: '请选择风格',
						trigger: 'change'
					}]
				}
			}
		},
		components: {
			...mapState({
				messages: state => state.messages
			}),
			//引入方法的两个组件
			'method-view': MethodView,
			//引入配置方法组件
			'method-cfg': MethodCfg,
		},
		mounted() {
			//作用域问题，需要保存this方便运行showPaCfg
			let let_this = this;
			console.log(let_this.relateListAll);

			//获取数据
			let_this.getRootData();
			//测试默认展开
			//			let_this.testDefault();
			let_this.initExpand();

			//			let_this.panel_url = '/static/2.htm'
			//'http://192.168.1.125:8080/opt/server/file/product/1/document/html/htmlTemplate/度他雄胺-性状/TR 01-008-01.02度他雄胺检验记录_检查_有关物质1.htm',
			//			let_this.downloadHtml(let_this.panel_url)
			//接收iframe子页面信息
			/*
			 * iframe中child_key(parent_key)的定义：
			 * 0、打开/初始化模板
			 * 1、取消当前空格配置（仅本次已选择的）
			 * 2、完成当前配置
			 * 3、选择参数
			 * 4、生成html页头（server端数据）
			 * 5、方法预览界面，选择其关联关系配置
			 * 6、下载已配置模板
			 * 7、打开空格，获取空格信息
			 * 8、打开空格，传递空格的关联关系
			 */
			let_this.boxheight();
			let_this.isShowPaCfg = false;
			window.onmessage = function(e) {
				//方法关联关系配置
				if(e.data.child_key === "5") {
					/*
					 * ref="methodView"是子组件在父组件中的名字
					 * 在父组件的方法中调用子组件的方法， this.$refs.methodView.relationCfgOk()
					 */
					let_this.$refs.methodView.relationCfgOk(e.data.id);
					return;
				}
				//获取空格信息
				if(e.data.child_key === "7") {
					//从模板获取空格id,并查询信息
					let_this.spaceId = e.data.id
					let_this.getInputInfo(e.data.id);
					//空格信息返回之后，传递关联关系到模板
				}

				if(e.data.id !== "") {
					//已经选择参数
					if(e.data.child_key === "3" && e.data.hasSelectParam) {
						let_this.chooseFN(e.data.id, e.data.item);
					} else {
						//选择参数的id不传入
						let_this.configPassId = e.data.id;
					}
					let_this.showPaCfg();

				}
				console.log(e.data);
			}

			// 动态设置背景图的高度为浏览器可视区域高度

			// 首先在Virtual DOM渲染数据时，设置下背景图的高度．
//			let_this.clientHeight.height = `${parseInt(document.body.clientHeight) * 0.80}px`;
			// 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
			
//			window.onresize = function temp() {
//				let_this.clientHeight.height = `${parseInt(document.body.clientHeight) * 0.80}px`;
//			};
		},
		//		watch: {
		//			afterPostMed(val) { // 实时监听数据变化
		//				this.getNodeClick(val);
		//			}
		//		},
		methods: {
			boxheight() { //函数：获取尺寸
				//获取浏览器窗口高度
				let _this = this;
				let winHeight = 0;
				if(window.innerHeight)
					winHeight = window.innerHeight;
				else if((document.body) && (document.body.clientHeight))
					winHeight = document.body.clientHeight;
				//通过Document对body进行检测，获取浏览器可视化高度
				if(document.documentElement && document.documentElement.clientHeight)
					winHeight = document.documentElement.clientHeight;
					_this.clientHeight.height = winHeight * 0.9 + "px"
				//DIV高度为浏览器窗口高度
				document.getElementById("app_container").style.height = winHeight * 0.9 + "px";

			},
			//控制窗口显示，不相容
			boolIncompatible(code) {
				let _this = this;
				/*
				 * 根据传入的code判断页面展示
				 * 1、增加药品
				 * 2、增加类别
				 * 3、增加鉴定方法
				 * 4、配置方法
				 * 5、配置模板
				 * 6、配置完成，全部关闭
				 * 7、方法配置参数,打开模板及参数选择
				 * 8、新增方法配置
				 * 9、上传模板界面
				 */
				switch(code) {
					case 1:
						_this.isAddMed = true;
						_this.isMethodView = _this.isMethodCfg = _this.isShowPanel = _this.isAddFirst = _this.isAddSec = _this.isShowPaCfg = _this.isMethodParam = _this.isShowUpload = false;
						break;
					case 2:
						_this.isAddFirst = true;
						_this.isMethodView = _this.isMethodCfg = _this.isShowPanel = _this.isAddMed = _this.isAddSec = _this.isShowPaCfg = _this.isMethodParam = _this.isShowUpload = false;
						break;
					case 3:
						_this.isAddSec = true;
						_this.isMethodView = _this.isMethodCfg = _this.isShowPanel = _this.isAddMed = _this.isAddFirst = _this.isShowPaCfg = _this.isMethodParam = _this.isShowUpload = false;
						break;
					case 4:
						_this.isMethodView = true;
						_this.isAddSec = _this.isMethodCfg = _this.isShowPanel = _this.isAddMed = _this.isAddFirst = _this.isShowPaCfg = _this.isMethodParam = _this.isShowUpload = false;
						break;
					case 5:
						_this.isShowPanel = true;
						_this.isAddSec = _this.isMethodCfg = _this.isMethodView = _this.isAddMed = _this.isAddFirst = _this.isShowPaCfg = _this.isMethodParam = _this.isShowUpload = false;
						break;
					case 6:
						_this.isShowPanel = _this.isAddSec = _this.isMethodView = _this.isAddMed = _this.isAddFirst = _this.isShowPaCfg = _this.isMethodParam = _this.isMethodCfg = _this.isShowUpload = false;
						break;
					case 7:
						_this.isShowPanel = true;
						_this.isMethodParam = true;
						_this.isAddSec = _this.isMethodCfg = _this.isMethodView = _this.isAddMed = _this.isAddFirst = _this.isShowPaCfg = _this.isShowUpload = false;
						break;
					case 8:
						_this.isMethodCfg = true;
						_this.isShowPanel = _this.isAddSec = _this.isMethodView = _this.isAddMed = _this.isAddFirst = _this.isShowPaCfg = _this.isMethodParam = _this.isShowUpload = false;
						break;
					case 9:
						_this.isShowUpload = true;
						_this.isAction = true;
						_this.isShowPanel = _this.isAddSec = _this.isMethodView = _this.isAddMed = _this.isAddFirst = _this.isShowPaCfg = _this.isMethodParam = _this.isMethodCfg = false;
						break;
					default:
						break;
				}
			},
			/*
			 * 页面切换时的提示窗口
			 * return: true则切换，false撤销切换
			 * origin为原页面
			 * 1、添加药品、大类、小类界面（药品、大类、小类分层次）
			 * 2、方法配置界面
			 * 3、模板预览界面(模板预览界面存在模板之间的切换)
			 * 4、空格配置中
			 */
			emptyAndPoint(origin) {
				switch(origin) {
					case 1:
						this.$confirm('新增界面数据未保存, 是否继续?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							return true;
						}).catch(() => {
							return false;
						});
						break;
					case 2:
						this.$confirm('即将关闭方法配置, 是否继续?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							return true;
						}).catch(() => {
							return false;
						});
						break;
					case 3:
						this.$confirm('即将当前节点模板配置, 是否继续?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							return true;
						}).catch(() => {
							return false;
						});
						break;
					case 4:
						this.$alert('正在配置空格，请先关闭空格配置', '配置空格属性中...', {
							confirmButtonText: '确定',
							callback: action => {
								this.$message({
									type: 'info',
									message: `action: ${ action }`
								});
							}
						});
						break;
					default:
						break;
				}
			},
			/*检测是否有其他界面正在运行
			 * targetIfCode: 要跳转的界面的view-if值
			 * origin为原页面,参数类同emptyAndPoint
			 * viewList: 保存当前view的if值
			 */
			testOtherView(targetIfCode, origin) {
				let _this = this;
				let count = 0;
				let viewList = {
					//					isAction: _this.isAction,
					isAddMed: _this.isAddMed,
					isAddFirst: _this.isAddFirst,
					isAddSec: _this.isAddSec,
					isShowUpload: _this.isShowUpload,
					isShowPanel: _this.isShowPanel,
					isShowPaCfg: _this.isShowPaCfg,
					connotSelect: _this.connotSelect,
					isMethodView: _this.isMethodView,
					isMethodCfg: _this.isMethodCfg
				}

				for(let i in viewList) {
					//除去目标界面的if之后，检测其他界面的if是否为true，为true：提示是否跳转
					if(targetIfCode !== viewList.i) {
						if(viewList[i]) {
							_this.emptyAndPoint(origin);
						}
					}
				}
			},
			//用于服务器文件加载css样式
			loadjscssfile(filename, filetype) {
				if(filetype == "js") {
					var fileref = document.createElement('script');
					fileref.setAttribute("type", "text/javascript");
					fileref.setAttribute("src", filename);
				} else if(filetype == "css") {
					var fileref = document.createElement('link');
					fileref.setAttribute("rel", "stylesheet");
					fileref.setAttribute("type", "text/css");
					fileref.setAttribute("href", filename);
				}
				if(typeof fileref != "undefined") {
					document.getElementsByTagName("head")[0].appendChild(fileref);
				}
			},
			//下载html模板
			downloadHtml(url) {
				try {             
					let elemIF = document.createElement('iframe');
					elemIF.src = url;
					elemIF.style.display = 'none';
					document.body.appendChild(elemIF);
					// 防止下载两次           
					setTimeout(function() {             
						document.body.removeChild(elemIF);         
					}, 1000);  
				} catch(e) {         
					console.log(e);      
				}
			},
			//get树形结构
			getRootData() {
				let params = {};
				let _this = this;
				this.$get('/config/document/medicine/get', params).then(res => {
					for(let i in res.data) {
						res.data[i].isEdit = false;
						res.data[i].children = [];
					}
					_this.setTree = res.data;
				}).catch(() => {})
			},
			//懒加载树形结构
			loadNode1(node, resolve) {
				let _this = this;
				//懒加载，查询大类
				let params = {};
				let medicineId; //药品节点id
				let firstClassId; //level=2时的类别节点id
				//初次加载
				if(node.level === 0) {
					return resolve(_this.setTree);
				} else if(node.level == 1) {
					medicineId = node.data.id; //当前节点id
					_this.$get('/config/document/firstclass/get?medicineId=' + medicineId, params).then(res => {
						for(let i in res.data) {
							res.data[i].isEdit = false;
						}
						return resolve(res.data)
					}).catch(() => {});
				}
				//鉴定方法需要药品id和大类(类别)id
				else if(node.level == 2) {
					medicineId = node.parent.data.id; //药品节点id
					firstClassId = node.data.id; //当前节点id
					_this.$get('/config/document/secondclass/get?medicineId=' + medicineId +
						'&firstClassId=' + firstClassId, params).then(res => {
						for(let i in res.data) {
							res.data[i].isEdit = false;
							res.data[i].leaf = true;
						}
						return resolve(res.data)
					}).catch(() => {});
				} else {
					return resolve([]);
				}
			},
			//方法选择
			//方法选择之后，与方法列表对比，是否是type=table的方法，判断是否展开行、值、列定位
			funcSelect(value) {
				let _this = this;
				let _obj = _this.funcObj.optionFunc;
				for(let i in _obj) {
					if(value === _obj[i].value) {
						//根据func的value获取公式及参数
						//判断codeview中的值
						
						//type为table，展开行、值、列
						//type为table时，不展示参数列表，default时，展示参数列表
						_this.getFormulaInfo(_obj[i].id);
						if(_obj[i].type === "table") {
							//获取方法的公式参数信息
							_this.setOptions(_obj[i]);
							_this.isShowParams = false;
							if(_this.formView.codeShow) {
								_this.formView.valueShow = false;
								_this.formView.subSelectShow = false;
							}
						} else {
							_this.isShowParams = true;
							_this.formView.codeShow = false;
							_this.emptyTemCfg(2);
						}
					}
				}

			},
			//设置code,value和subselect的值
			setOptions(_obj) {
				let _this = this;
				_this.funcObj.optionCode = [];
				_this.form.codeModel = '';
				_this.form.valueModel = '';
				_this.form.subSelectModel = '';
				_this.formView.codeShow = false;
				_this.formView.valueShow = false;
				//避免报错 
				if(_obj.outputs && _obj.outputs[0].selects) {
					_this.formView.codeShow = true;
					if(Array.isArray(_obj.outputs[0].selects)) {
						_this.funcObj.optionCode = _obj.outputs[0].selects.map(item => {
							return {
								value: item.value,
								label: item.value,
								code: item.code,
								leaf: item.leaf
							};
						});
					}
					
					if(_obj.outputs && _obj.outputs[0].subSelects) {
//					if (_this.formView.codeShow) {
//						_this.formView.subSelectShow = false;
//					} else {
						_this.formView.subSelectShow = true;
//					}
						//判断是否为array
							if(Array.isArray(_obj.outputs[0].subSelects)) {
								//选择了code行信息之后，保存列信息
								_this.funcObj.optionSubSelect = _obj.outputs[0].subSelects.map(item => {
									return {
										value: item.value,
										label: item.value,
										code: item.code,
										leaf: item.leaf
									};
								});
							}
					} else {
						_this.formView.subSelectShow = true;
					}
					
					if(_obj.params) {
						//选择了code行信息之后，保存值信息
						for(let j in _this.valueList) {
							if(_this.valueList[j].functionId === _obj.id) {
								_this.formView.valueShow = true;
								let originValue = _this.valueList[j].tables[0].rows;
								let secondValueList = [];
	
								for(let n in originValue) {
									let valueObj = {
										code: originValue[n].columns[0].code,
										value: originValue[n].columns[0].value
									}
									secondValueList.push(valueObj);
								}
								_this.funcObj.optionValue = secondValueList.map(item => {
									return {
										value: item.value,
										label: item.value,
										code: item.code
									};
								});
							}
						}
					} else {
						_this.formView.valueShow = false;
					}
				} else {
					_this.formView.codeShow = false;
					_this.formView.valueShow = false;
					
					if(_obj.outputs && _obj.outputs[0].subSelects) {
//					if (_this.formView.codeShow) {
//						_this.formView.subSelectShow = false;
//					} else {
						_this.formView.subSelectShow = true;
//					}
						//判断是否为array
							if(Array.isArray(_obj.outputs[0].subSelects)) {
								//选择了code行信息之后，保存列信息
								_this.funcObj.optionSubSelect = _obj.outputs[0].subSelects.map(item => {
									return {
										value: item.value,
										label: item.value,
										code: item.code,
										leaf: item.leaf
									};
								});
							}
					} else {
						_this.formView.subSelectShow = true;
					}
					
				}
				
				
//				if(_obj.outputs && _obj.outputs[0].selects) {
//					_this.formView.codeShow = true;
//					if(Array.isArray(_obj.outputs[0].selects)) {
//						_this.funcObj.optionCode = _obj.outputs[0].selects.map(item => {
//							return {
//								value: item.value,
//								label: item.value,
//								code: item.code,
//								leaf: item.leaf
//							};
//						});
//					}
//
//					//选择了code行信息之后，保存值信息
//					for(let j in _this.valueList) {
//						if(_this.valueList[j].functionId === _obj.id) {
//							let originValue = _this.valueList[j].tables[0].rows;
//							let secondValueList = [];
//
//							for(let n in originValue) {
//								let valueObj = {
//									code: originValue[n].columns[0].code,
//									value: originValue[n].columns[0].value
//								}
//								secondValueList.push(valueObj);
//							}
//							_this.funcObj.optionValue = secondValueList.map(item => {
//								return {
//									value: item.value,
//									label: item.value,
//									code: item.code
//								};
//							});
//						}
//					}
//
//					//判断是否为array
//					if(Array.isArray(_obj.outputs[0].subSelects)) {
//						//选择了code行信息之后，保存列信息
//						_this.funcObj.optionSubSelect = _obj.outputs[0].subSelects.map(item => {
//							return {
//								value: item.value,
//								label: item.value,
//								code: item.code,
//								leaf: item.leaf
//							};
//						});
//					}
//
//				} else if(_obj.outputs && _obj.outputs[0].subSelects) {
//					//判断是否为array
//					if(Array.isArray(_obj.outputs[0].subSelects)) {
//						_this.formView.subSelectShow = true;
//						//选择了code行信息之后，保存列信息
//						_this.funcObj.optionSubSelect = _obj.outputs[0].subSelects.map(item => {
//							return {
//								value: item.value,
//								label: item.value,
//								code: item.code,
//								leaf: item.leaf
//							};
//						});
//					}
//					//选择了code行信息之后，保存值信息
//					for(let j in _this.valueList) {
//						if(_this.valueList[j].functionId === _obj.id) {
//							_this.formView.valueShow = true;
//							let originValue = _this.valueList[j].tables[0].rows;
//							let secondValueList = [];
//
//							for(let n in originValue) {
//								let valueObj = {
//									code: originValue[n].columns[0].code,
//									value: originValue[n].columns[0].value
//								}
//								secondValueList.push(valueObj);
//							}
//							_this.funcObj.optionValue = secondValueList.map(item => {
//								return {
//									value: item.value,
//									label: item.value,
//									code: item.code
//								};
//							});
//						} else {
//							_this.formView.valueShow = false;
//						}
//					}
//				} else {
//					_this.emptyTemCfg(2);
//				}
			},
			//获取公式的信息，得到参数个数
			getFormulaInfo(funcId) {
				let _this = this;
				//每次获取数据时，清空参数列表
				_this.paramsList = [];
				let paramDes = 1;
				let obj = {
					functionId: funcId
				}
				_this.$get("/config/document/method/formulas/get?functionId=" + obj.functionId).then(res => {
					//获取到formula参数,参数赋值
					if(res.data && res.data.length) {
						let paramObj = {};
						if(Array.isArray(res.data)) {
							_this.isShowParams = true;
							_this.paramsList = res.data.map(item => {
								return {
									value: '',
									label: item.name,
									paramDes: "参数" + paramDes++,
									select_params_a: '未配置参数',
									isShowAddBtn: item.paramCount < 0 ? true : false
								}
							});
							//paramCount === -1时，无限增加参数
							let length = _this.paramsList.length;
							//遍历list，设置最后一项的addshow为true，其他为false
							for(let i in _this.paramsList) {
								//最后一项
								if(i == length - 1) {
									_this.paramsList[i].isShowAddBtn = true;
								} else {
									_this.paramsList[i].isShowAddBtn = false;
								}
							}
						}
						return resolve(res.data)
					} else {
						//关闭参数列表
						_this.isShowParams = false;
						_this.emptyTemCfg(2);
						return resolve(res.data)
					}

				}).catch(() => {});
			},
			//			//code定位
			codeSelect(value) {
				let _this = this;
				let _obj = _this.funcObj.optionCode;
				for(let i in _obj) {
					//行定位非叶子节点
					if(_obj[i].value == value) {
						if(!_obj[i].leaf) {
//							_this.setOptions(_obj[i]);
							_this.formView.valueShow = true;
							_this.formView.subSelectShow = true;
							//结束循环，否则一直为最后一个值
							return;
						} else {
							_this.formView.valueShow = false;
							_this.formView.subSelectShow = false;
						}
					}
				}
			},
			redioSelect(value) {
				if(value == "杂质") {
					this.isShowSecForm = true;
				} else {
					this.isShowSecForm = false;
				}
			},
			// 参数就是子组件传递出来的数据
			/*
			 * msg:
			 * 1、打开新增方法配置
			 * 2、关闭方法配置
			 */
			parentSay(msg) {
				//自组件传递参数之后，关闭窗口
				let _this = this;
				console.log(msg)
				if(msg.code == 1) {
					//新增方法配置
					_this.boolIncompatible(8);
				} else if(msg.code == 2) {
					//关闭方法配置
					_this.isMethodView = false;
				} else {
					//完成方法配置，返回方法预览
					_this.boolIncompatible(4);
				}

				console.log(msg) // hello, parent
			},
			showPaCfg() {
				this.isShowPaCfg = true;
			},
			//此方法必须是有iframe，否则报错
			dowloadTem() {
				let _this = this;
				let commitObj = window.frames["child_iframe"]; //获得对应iframe的window对象
				//发送消息给子iframe
				let targetOrigin = "*";
				//parent_key： 6、下载已配置模板
				let input_params = {
					parent_key: "6"
				};

				commitObj.contentWindow.postMessage(input_params, targetOrigin);
				_this.isShowPanel = false;
			},
			createCfg(formName) {
				let _this = this;
//				this.$refs[formName].validate((valid) => {
//					if(valid) {
						let funcId = '';
						for(let i in _this.funcObj.optionFunc) {
							if(_this.funcObj.optionFunc[i].value === _this.form.funcModel) {
								funcId = _this.funcObj.optionFunc[i].id;
							}
						}

						let obj = {
							autoCal: true,
							autoInput: true,
							id: parseInt(_this.spaceId),
							medicineId: _this.temNode.parent.parent.data.id,
							position: {
								code: _this.form.codeModel,
								functionId: funcId,
								subSelect: _this.form.subSelectModel,
								value: _this.form.valueModel
							},
							relations: [],
							secondClassId: _this.temNode.data.id,
							styleId: _this.form.course !== "" ? 1 : 0,
							type: parseInt(_this.form.units)
						};
						obj.relations = _this.select_params_a;
						_this.$post('/config/document/space/save', obj).then(res => {
							let commitObj = window.frames["child_iframe"]; //获得对应iframe的window对象
							//发送消息给子iframe
							let targetOrigin = "*";

							//创建空格关系
							let createRelate = {
								input_id: _this.spaceId,
								relate_input: _this.select_params_a
							};
							//传递模板的空格关系到iframe
							//parent_key：2、完成当前配置
							setTimeout(function() {
								let input_params = {
									id: _this.configPassId,
									status: true,
									parent_key: "2",
									relate_list: _this.createRelate //必须判断是否选择参数，才可以下发relate_list
								};

								commitObj.contentWindow.postMessage(input_params, targetOrigin);
							}, 100);
							_this.isShowPaCfg = false;
							//1、清空所有
							_this.emptyTemCfg(1);
							console.log(commitObj)
							_this.$message({
								showClose: true,
								message: '已完成配置点' + _this.spaceId + '配置',
								type: 'success'
							});
							//重新获取模板数据
							_this.getTemInfo(_this.temNode);
							//已选择的参数列表清空
							_this.select_params_a = [];
							//必须清空参数列表
							_this.paramsList = [];
							//清空输入
							return resolve(res.data)
						}).catch(() => {});
//					} else {
//						return false;
//					}
//				});

			},
			cancelCfg() {
				let _this = this;
				//并且传递给子iframe，说明未配置且关闭
				let commitObj = window.frames["child_iframe"]; //获得对应iframe的window对象
				//发送消息给子iframe
				let targetOrigin = "*";
				//parent_key: 1、取消当前空格配置（仅本次已选择的）

				setTimeout(function() {
					let input_params = {
						id: _this.configPassId,
						status: false,
						parent_key: "1"
					};

					commitObj.contentWindow.postMessage(input_params, targetOrigin);
				}, 100);
				//重新获取模板数据
				_this.getTemInfo(_this.temNode);
				_this.isShowPaCfg = false;
				//1、清空所有
				_this.emptyTemCfg(1);
				//testing...清空数据
				_this.select_params_a = [];
				//必须清空参数列表
				_this.paramsList = [];
			},
			/*
			 * key值含义：
			 * 1、空格配置全部清空(关闭、完成配置)
			 * 2、除function之外全部清空（只作用code,select和参数）方法变化
			 * 3、除code行信息之外全部清空（只作用select和参数）=
			 */
			//清空模板信息
			emptyTemCfg(key) {
				let _this = this;
				if(key === 1) {
					_this.form = {
						testCase: '',
						units: '',
						course: '',
						funcModel: '',
						codeModel: '',
						valueModel: '',
						subSelectModel: ''
					};
					_this.formView.codeShow = _this.formView.valueShow = _this.formView.subSelectShow = false;
				} else if(key === 2) {
					_this.form.testCase = _this.form.units = _this.form.course = _this.form.codeModel = _this.form.valueModel = _this.form.subSelectModel = '';
					_this.formView.valueShow = _this.formView.subSelectShow = false;

				} else if(key === 3) {
					_this.form.valueModel = _this.form.subSelectModel = '';
					_this.formView.valueShow = _this.formView.subSelectShow = false;
				}

			},
			...mapActions(['newMessage']),
			initExpand() {
				this.setTree.map((a) => {
					this.defaultExpandKeys.push(a.id)
				});
				this.isLoadingTree = true;
			},
			//
			downloadSpan() {
				let link = document.getElementById('downA');
				link.click();

				//				let btn = $(e.currentTarGET);
				//			    let now_token = Date.now();
				//			    let oldHref = btn.attr('href')
				//			    btn.attr('href', `${oldHref}&token=${now_token}`)
				//			    btn.addClass('disabled').html('下载中...');
				//			    let timer = setInterval(function () {
				//			        let cookie_token =  $.cookie('token')
				//			        if( now_token == cookie_token ){
				//			            clearInterval(timer);
				//			            timer = null;
				//			            $.removeCookie('token'); // 清除cookie
				//			            btn.removeClass('disabled').html('下载数据');
				//			        }
				//			    }, 1000);
			},
			//点击节点时，判断是否是选择参数界面，是则不关闭参数选择界面
			handleNodeClick(d, n, s) { //点击节点
				//模板配置界面，code=5
				let _this = this;
				//				if(n.level === 3) {
				//					_this.downloadSpan();
				//				}

				_this.boolIncompatible(5);
				_this.isAddSec = false;
				//鉴定方法节点则可upload模板并渲染生成
				if(n.level === 3) {
					//获取小类信息之后，保存小类的节点信息
					_this.temNode = n;
					//打开模板界面
					/*
					 * 跨模板配置暂时禁用
					 * _this.connotSelect ? _this.isShowPaCfg : _this.isShowPaCfg = false;
					 */
					
					//暂时模拟
					//获取模板消息
					_this.getTemInfo(n); 
					_this.connotSelect = false;
					_this.isShowPaCfg = false;
					//					if(n.data.id !== 12) {
					//						_this.isShowUpload = true;
					//						_this.isAction = true;
					//						_this.isShowPanel = false;
					//						return;
					//					} else {
					//						//获取模板消息
					//						_this.getTemInfo(n);
					//						_this.isShowUpload = false;
					//						_this.isShowPanel = true;
					//						return;
					//					}
					//					_this.isShowPanel = true;
					_this.isAction = false;
					_this.closeTemAndCfg();

				} else {
					_this.isShowPanel = false;
					_this.isShowPaCfg = false;
				}
				// console.log(d,n)
				d.isEdit = false; //放弃编辑状态
			},
			//vuex方式更新数据
			addMedicies() {
				console.log(this.$store.getters.getMessage)
				console.log(this.newMessage({
					text: 'test'
				}))
			},
			//点击小类，获取模板信息
			getTemInfo(n) {
				let params = {
					//从小类节点获取药品id
					medicineId: n.parent.parent.data.id,
					//大类id
					firstClassId: n.parent.data.id,
					//获取节点id
					secondClassId: n.data.id
				};
				//保存已经配置了的空格信息
				let configInputList = [];
				let _this = this;

				_this.$get('/config/document/template/get?medicineId=' + params.medicineId +
					'&firstClassId=' + params.firstClassId +
					'&secondClassId=' + params.secondClassId, {}).then(res => {
					_this.funcObj.style = [];
					if(!res.data) {
						_this.isShowUpload = true;
						_this.isAction = true;
						_this.isShowPanel = false;
						return;
					}
					if(res.data.filePath !== '' && res.data.fileName !== '') {
						//获取模板文件
						_this.getTemFile(res.data.filePath, res.data.fileName);
					}
					//保存方法信息
					let styleObj = {
						value: "值显示",
						label: "值显示"
					}
					_this.funcObj.style.push(styleObj);
					for(let i in res.data) {
						//保存接口返回的模板信息
						_this.htmlTemData = res.data;
						//						_this.htmlSrc = res.data.htmlUrl;
						//						_this.readAsDataURL(_this.htmlSrc);
						//判断是否为array
						if(Array.isArray(_this.htmlTemData.method.functions)) {

							_this.funcObj.optionFunc = _this.htmlTemData.method.functions.map(item => {
								return {
									value: item.name,
									label: item.name,
									id: item.id,
									outputs: item.outputs,
									params: item.params,
									type: item.type
								};
							});
						}

						//保存数据
						_this.valueList = _this.htmlTemData.param;

						//已配置的空格list
						configInputList = res.data.ids;
						//传递模板的空格关系到iframe
						//0、打开/初始化模板
						setTimeout(function() {
							let commitObj = window.frames["child_iframe"]; //获得对应iframe的window对象
							//发送消息给子iframe
							let targetOrigin = "*";
							let input_params = {
								parent_key: "0",
								configInput: configInputList,
								relate_list_all: _this.relateListAll
							};

							commitObj.contentWindow.postMessage(input_params, targetOrigin);
						}, 100);
					}
				}).catch(() => {})
			},
			//获取模板文件
			getTemFile(filePath, fileName) {
				let _this = this;
				let obj = {
					filePath: filePath,
					fileName: fileName
				}
				_this.$get('/config/document/template/download', obj, {
					responseType: 'arraybuffer'
				}).then(res => {
					console.log("download success")
					let blob = new Blob([res], {
						type: "text/html"
					});
					var reader = new FileReader();
					reader.readAsDataURL(blob); // 转换为base64，可以直接放入a标签href
					reader.onload = function(e) {
						_this.htmlSrc = e.target.result;
					}
				}).catch(res => {
					_this.htmlSrc = res;
					console.log("download error")
				});
			},
			//获取iframe
			readAsDataURL(file) {
				//检验是否为图像文件
				//			    let file = document.getElementById("file").files[0];

				let reader = new FileReader();
				//将文件以Data URL形式读入页面
				reader.readAsDataURL(file);
				reader.onload = function(e) {
					let result = document.getElementById("get_iframe");
					//显示文件
					result.innerHTML = '<iframe src="' + this.result + '"/>';
				}
			},
			getInputInfo(input_id) {
				let _this = this;
				//_this.temNode为保存的节点信息
				let params = {
					//从小类节点获取药品id
					medicineId: _this.temNode.parent.parent.data.id,
					//获取节点id
					secondClassId: _this.temNode.data.id,
					//空格id
					spaceId: input_id //input_id
				};
				//展示参数的title信息
				let paramDes = 1;
				_this.isShowParams = false;
				_this.$get('/config/document/space/get?medicineId=' + params.medicineId +
					'&secondClassId=' + params.secondClassId +
					'&spaceId=' + params.spaceId, {}).then(res => {
					//接口返回的空格信息
					//如果有select值，赋值,并控制select窗口的展示
					if(res.data.position) {
						//先判断存在方法
						if(res.data.position.functionId !== "") {
							_this.inputSelectInfo(_this.funcObj.optionFunc, res.data.position);
						}
					}
					//风格和位数赋值
					if(res.data.styleId) {
						let styleObj = {
							value: "值显示",
							label: "值显示"
						};
						let list = [];
						list.push(styleObj);
						_this.funcObj.style = list;
						_this.form.course = "值显示";
					}
					if(res.data.type) {
						_this.form.units = res.data.type;
					}
					
					//参数需要判断function type
					for(let item of _this.funcObj.optionFunc) {
						if(item.id == res.data.position.functionId) {
							if(item.type === "default") {
								_this.isShowParams = true;
							} else {
								_this.isShowParams = false;
							}
						}
					}

					//paramsList传值
					if(res.data.relations && res.data.relations.length > 0 || (res.data.relations.length === 1 && res.data.relations[0] !== "")) {
						//判断是否为数组
						
						if(Array.isArray(res.data.relations)) {
							//有关联关系，所以需要查询formula获取参数名称
//							_this.getFormulaInfo(res.data.position.functionId);
							_this.paramsList = res.data.relations.map(item => {
								return {
									value: item,
									label: item,
									paramDes: '参数' + paramDes++,
									select_params_a: '配置点' + item,
									isShowAddBtn: true
								}
							});
//							let length = _this.paramsList.length;
//							//遍历list，设置最后一项的addshow为true，其他为false
//							for(let i in _this.paramsList) {
//								//最后一项
//								if(i == length - 1) {
//									_this.paramsList[i].isShowAddBtn = true;
//								} else {
//									_this.paramsList[i].isShowAddBtn = false;
//								}
//							}
						}
						//传递空格的关联信息到模板
						//8、传递空格的关联关系
						setTimeout(function() {
							let commitObj = window.frames["child_iframe"]; //获得对应iframe的window对象
							//发送消息给子iframe
							let targetOrigin = "*";
							let input_params = {
								parent_key: "8",
								relate_list_all: res.data.relations
							};

							commitObj.contentWindow.postMessage(input_params, targetOrigin);
						}, 100);
					} else {
						//function的type为default，但是无参数关联
						if(_this.isShowParams) {
							_this.getFormulaInfo(res.data.position.functionId);
						}
					}
				}).catch(() => {})
			},
			//获取空格信息之后的回显控制
			inputSelectInfo(funcList, position) {
				let _this = this;
				for(let i of funcList) {
					if(i.id === position.functionId) { //在方法列表中找到此方法
						_this.form.funcModel = i.value;
						//是否展示codeShow
						//type为table，展开行、值、列
						if(i.type === "table") {
							_this.setOptions(i);
							//获取方法的公式参数信息
							//							_this.getFormulaInfo(i.id);
							if(position.code !== "") {
								for(let j of i.outputs) {
									if(j.selects) {
										_this.form.codeModel = position.code;
										_this.formView.codeShow = true;
										for(let k of j.selects) {
											if(position.code === k.value && !k.leaf) { //code非叶子节点
												_this.formView.valueShow = true;
												_this.formView.subSelectShow = true,
												_this.form.codeModel = position.code;
												//此时匹配值和列
												_this.form.valueModel = position.value;
												_this.form.subSelectModel = position.subSelect;
											}
										}
									} else if(j.subSelects) {
										_this.formView.codeShow = false;
										for(let k of j.subSelects) {
											if(position.subSelect === k.value) { //code非叶子节点 ,目前只支持两级菜单
//												_this.formView.valueShow = true;
												_this.formView.subSelectShow = true,
												//此时匹配值和列
												_this.form.valueModel = position.value;
												_this.form.subSelectModel = position.subSelect;
											}
										}
									}
								}
							} else if(position.subSelect!== "") {
								for(let j of i.outputs) {
									if(j.subSelects) {
										_this.formView.codeShow = false;
										for(let k of j.subSelects) {
											if(position.subSelect === k.value) { //code非叶子节点 ,目前只支持两级菜单
//												_this.formView.valueShow = true;
												_this.formView.subSelectShow = true,
												//此时匹配值和列
												_this.form.valueModel = position.value;
												_this.form.subSelectModel = position.subSelect;
											}
										}
									}
								}
							 	
							}
							//获取code,value,subselect的option
							
						} else {
							_this.formView.codeShow = false;

						}
					}
				}
			},
			renderContent(h, {
				node,
				data,
				store
			}) { //加载节点
				let that = this;
				return h(TreeRender, {
					props: {
						DATA: data,
						NODE: node,
						STORE: store,
						maxexpandId: that.non_maxexpandId
					},
					on: {
						//在节点改变之前，先包装一层
						nodeAdd: ((s, d, n) => that.getAddNodes(s, d, n)),
						nodeAddForm: ((s, d, n) => that.handleFormula(s, d, n)),
						nodeEdit: ((s, d, n) => that.handleEdit(s, d, n)),
						nodeDel: ((s, d, n) => that.handleDelete(s, d, n)),
						uploadTem: ((s, d, n) => that.handleUploadTem(s, d, n))
					}
				});
			},
			/*
			 * 有关药品的操作
			 * 打开新增药品界面
			 */
			addMedicie() {
				let _this = this;
				_this.addForm.drugName = _this.addForm.factory = '';
				_this.isAction = true;
				//				testOtherView();
				//首先新增药品，code=1
				_this.boolIncompatible(1);
			},
			//完成药品添加
			confirmAddMed(formName) {
				let _this = this;
				//校验...
				this.$refs[formName].validate((valid) => {
					if(valid) {
						//校验通过
						_this.handleAddTop();
						//关闭添加页面
						_this.isAddMed = false;
					} else {
						return false;
					}
				});

			},
			//继续添加药品
			contiAddMedicie(formName) {
				let _this = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						_this.handleAddTop();
					} else {
						return false;
					}
				});

			},
			//增加药品节点
			handleAddTop() {
				let _this = this;

				let obj = {
					name: _this.addForm.drugName,
					factory: _this.addForm.factory
				};
				_this.$post('/config/document/medicine/add', obj).then(res => {
					//是否成功返回，判断
					//重新获取药品列表，刷新tree
					_this.getRootData();
					_this.afterPostMed = res.data.id;
					//让药品节点默认展开
					setTimeout(function() {
						_this.defaultExpandKeys.push(res.data.id)
					}, 200);
					//完成药品节点添加之后，默认点击展开此药品
					_this.$message({
						showClose: true,
						message: '已完成药品添加',
						type: 'success'
					});
					//点开刚刚
					//清空输入
					_this.addForm.drugName = _this.addForm.factory = '';
					return resolve(res.data)
				}).catch(() => {});

			},
			//展开创建的节点
			clickCreateNode(id) {
				//保证延时
				setTimeout(function() {
					let obj = document.getElementsByClassName('el-tree-node__content')[id];
					obj.click();
				}, 1000);
			},
			//test
			testDefault() {
				let _this = this;
				//				_this.defaultExpandKeys.push(2,3);
				setTimeout(function() {
					let obj = document.getElementsByClassName('el-tree-node__content')[0];
					obj.click();
				}, 1000);　　　　　　　　
				//触发节点点击事件
				//				obj.click();
			},
			//保存节点信息，判断调用类别/鉴定方法
			getAddNodes(s, d, n) {
				this.nodes.s = s;
				this.nodes.d = d;
				this.nodes.n = n;
				if(n.level > 2) {
					return;
				}
				n.level === 1 ? this.addFirstType() : this.addSecondType();
			},
			//打开小类的方法配置界面
			handleFormula(s, d, n) {
				let _this = this;
				_this.temNode = n;
				//先查询模板信息，查看模板是否存在
				_this.getTemInfo(n); 
				setTimeout(function() {
					//模板存在
					if(!_this.isShowUpload) {
						
						//方法配置界面，code=4
						_this.boolIncompatible(4);
						//调用子组件方法界面的初始化函数
						_this.$refs.methodView.getFuncInfo(n);
					}
				}, 200);
//				_this.boolIncompatible(4);
				
			},
			//打开新增类别界面
			addFirstType(formName) {
				let _this = this;
				_this.isAction = true;
				//两个入口，此处是从添加药品的界面进入的
				if(_this.isAddMed) {
					_this.contiAddMedicie(formName);
					//在新增药品处点击添加类别，此处手动选定节点
					!_this.isAddMed;
				}
				//新增类别界面，code=2
				_this.boolIncompatible(2);　
			},
			//全局的药品ID/大类ID变化，说明接口已返回，调用节点click事件
			getNodeClick(num) {
				let _this = this;
				//检测刚刚添加的药品序列
				for(let i in _this.setTree) {
					if(_this.setTree[i].id == _this.afterPostMed) {
						let obj = document.getElementsByClassName('el-tree-node__content')[i];　　　　　　　　
						//触发节点点击事件
						obj.click();　　
					}
				}
			},
			//继续添加类别/小类
			contiAddType(formName) {
				let _this = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						//判断调用类别/鉴定方法
						_this.handleAdd(this.nodes.s, this.nodes.d, this.nodes.n);
						_this.nodes.n.level === 1 ? this.addForm.firstType = '' : this.addForm.secondType = '';
					} else {
						return false;
					}
				});

			},
			//确认保存类别信息
			comfirmAddFir(formName) {
				let _this = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						//判断调用类别/鉴定方法
						_this.handleAdd(this.nodes.s, this.nodes.d, this.nodes.n);
						_this.isAddFirst = false;
					} else {
						return false;
					}
				});
			},
			//确认保存鉴定方法信息
			comfirmAddSec(formName) {
				let _this = this;
				this.$refs[formName].validate((valid) => {
					if(valid) {
						_this.handleAdd(this.nodes.s, this.nodes.d, this.nodes.n);
						_this.isAddSec = false;
					} else {
						return false;
					}
				});

			}, //打开新增鉴定方法界面
			addSecondType(formName) {
				this.isAction = true;
				//两个入口，此处屏蔽添加类别入口的界面
				if(this.isAddMed) {
					this.contiAddType(formName);
					!this.isAddFirst;
				}
				//				this.isAddSec = true;
				//新增鉴定方法，code=3
				this.boolIncompatible(3);
			},
			//增加节点
			handleAdd(s, d, n) {
				let _this = this;
				console.log(s, d, n)
				//特殊处理，如果s，d，n为空,为创建
				if(s === '') {

				}
				if(n.level >= 3) {
					_this.$message.error("最多只支持2级！")
					return false;
				}
				//添加数据
				//判断?添加类别:鉴定方法
				let this_name = n.level === 1 ? _this.addForm.firstType : _this.addForm.secondType;

				if(n.level === 1) { //类别
					let obj = {
						medicineId: n.data.id,
						name: this_name
					};
					//判断是否选择了节点，如果d.children == undefined,则用同level下的最后一项数据
					_this.$post('/config/document/firstclass/add', obj).then(res => {
						//是否成功返回，判断
						//重新获取药品列表，刷新tree
						//保存大类的id
						_this.afterPostFir = res.data.id;
						//刷新树之后，需要设置默认展开值
						_this.getRootData();
						//让药品节点默认展开
						setTimeout(function() {
							_this.defaultExpandKeys.push(_this.afterPostMed, res.data.id)
						}, 200);
						_this.$message({
							showClose: true,
							message: '已完成类别添加',
							type: 'success'
						});
						return resolve(res.data)
					}).catch(() => {});
				} else { //鉴定方法
					let obj = {
						medicineId: n.parent.data.id,
						firstClassId: n.data.id,
						name: this_name
					};
					//判断是否选择了节点，如果d.children == undefined,则用同level下的最后一项数据
					_this.$post('/config/document/secondclass/add', obj).then(res => {
						//是否成功返回，判断
						//重新获取药品列表，刷新tree
						//刷新树之后，需要设置默认展开值
						_this.getRootData();
						_this.$message({
							showClose: true,
							message: '已完成鉴定方法添加',
							type: 'success'
						});
						return resolve(res.data)
					}).catch(() => {});
				}
				//设置默认展开
				if(!n.expanded) {
					n.expanded = true;
				}
			},
			handleEdit(s, d, n) { //编辑节点
				
			},
			handleUploadTem(s, d, n) {
				this.temNode = n;
				this.boolIncompatible(9);
			},
			//暂时不需要删除功能
			handleDelete(s, d, n) { //删除节点
				console.log(s, d, n)
				let that = this;
				//有子级不删除
				if(d.children && d.children.length !== 0) {
					this.$message.error("此节点有子类，不可删除！")
					return false;
				} else {
					//新增节点直接删除，否则要询问是否删除
					let delNode = () => {
						let list = n.parent.data.children || n.parent.data, //节点同级数据
							_index = 99999; //要删除的index
						/*if(!n.parent.data.children){//删除顶级节点，无children
						  list = n.parent.data
						}*/
						list.map((c, i) => {
							if(d.id == c.id) {
								_index = i;
							}
						})
						let k = list.splice(_index, 1);
						//console.log(_index,k)
						this.$message.success("删除成功！")
					}
					let isDel = () => {
						that.$confirm("是否删除此类别？", "提示", {
							confirmButtonText: "确认",
							cancelButtonText: "取消",
							type: "warning"
						}).then(() => {
							delNode()
						}).catch(() => {
							return false;
						})
					}
					//每一个删除节点都需要确认
					isDel();
				}
			},
			// 上传前对文件的大小的判断
			beforeAvatarUpload() {
				let _this = this;
				_this.upLoadData = {
					//从小类节点获取药品id
					medicineId: _this.temNode.parent.parent.data.id,
					//大类id
					firstClassId: _this.temNode.parent.data.id,
					//获取节点id
					secondClassId: _this.temNode.data.id
				};
				return new Promise((resolve, reject) => {
					_this.$nextTick(() => {
						_this.importFileUrl = _this.$ajax.defaults.baseURL + "/config/document/template/upload?medicineId=" + _this.upLoadData.medicineId + "&firstClassId=" + _this.upLoadData.firstClassId + "&secondClassId=" + _this.upLoadData.secondClassId;
						
						resolve()
					})
				})
			},
			//文件上传中的提交
			submitUpload() {
				let _this = this;

				_this.$refs.upload.submit();
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			//文件提交前
			handlePreview(file) {
				console.log(file);
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//从模板中选择参数
			paramsCh(item) {
				//屏蔽配置界面
				let _this = this;
				_this.connotSelect = true;

				let obj1 = window.frames["child_iframe"]; //获得对应iframe的window对象
				//发送消息给子iframe
				let targetOrigin = "*";
				//选择参数

				setTimeout(function() {
					//parent_key：3、选择参数
					let input_params = {
						id: _this.configPassId,
						item: item.paramDes,
						status: true,
						isSelected: true,
						parentId: _this.configPassId,
						parent_key: "3"
					};
					obj1.contentWindow.postMessage(input_params, targetOrigin);
				}, 100);
			},
			//添加参数
			addParam(item) {
				let _this = this;
				let count = parseInt(item.paramDes.substring(2));

				let paramObj = {
					value: '',
					label: item.label + count++,
					paramDes: '参数' + count,
					select_params_a: '未配置参数',
					isShowAddBtn: true
				}
				_this.paramsList.push(paramObj);
				//添加完成之后，list最后一个的addshow为true
				let length = _this.paramsList.length;
				//遍历list，设置最后一项的addshow为true，其他为false
				for(let i in _this.paramsList) {
					//最后一项
					if(i == length - 1) {
						_this.paramsList[i].isShowAddBtn = true;
					} else {
						_this.paramsList[i].isShowAddBtn = false;
					}
				}
			},
			//移除参数
			removeParam(item) {
				let _this = this;
				if(_this.paramsList.length > 1) {
					//移除之后判断按钮
					_this.paramsList.pop();
					//移除之后，list最后一个的addshow为true
					let length = _this.paramsList.length;
					//遍历list，设置最后一项的addshow为true，其他为false
					for(let i in _this.paramsList) {
						//最后一项
						if(i == length - 1) {
							_this.paramsList[i].isShowAddBtn = true;
						} else {
							_this.paramsList[i].isShowAddBtn = false;
						}
					}
				}
			},
			//已经选择id并传递到parent
			chooseFN(childId, targetItem) {
				//已成功选择，开放配置界面
				let _this = this;
				_this.connotSelect = false;
				_this.select_params_a.push(childId);
				for(let i of _this.paramsList) {
					if(i.paramDes === targetItem) {
						i.select_params_a = '配置点' + childId;
					}
				}
			},
			//关闭模板及关闭模板配置窗口
			closeTemAndCfg() {
				let _this = this;
				//并且传递给子iframe，说明未配置且关闭
				let commitObj = window.frames["child_iframe"]; //获得对应iframe的window对象
				//发送消息给子iframe
				let targetOrigin = "*";
				//parent_key: 1、取消当前空格配置（仅本次已选择的）
				//重新获取模板数据
				_this.isShowPaCfg = false;
				let input_params = {
					id: _this.configPassId,
					status: false,
					parent_key: "1"
				};

				commitObj.contentWindow.postMessage(input_params, targetOrigin);
				
				//1、清空所有
				_this.emptyTemCfg(1);
				//testing...清空数据
				_this.select_params_a = [];
				//必须清空参数列表
				_this.paramsList = [];
			}
		}

	}
</script>

<style>
	.expand {
		/*width: 250px;*/
		width: 20%;
		height: auto;
		float: left;
		display: inline;
		overflow: hidden;
		/*解决浏览器窗口缩放问题*/
		min-width: 180px;
	}
	
	.expand>div {
		height: 85%;
		/*padding-top:20px;*/
		/*width:50%;*/
		/*margin:20px auto;*/
		/*max-width: 400px;*/
		overflow-y: auto;
	}
	
	.expand>div::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
		border-radius: 5px;
	}
	
	.expand>div::-webkit-scrollbar-thumb {
		background-color: rgba(50, 65, 87, 0.5);
		outline: 1px solid slategrey;
		border-radius: 5px;
	}
	
	.expand>div::-webkit-scrollbar {
		width: 10px;
	}
	
	.expand-tree {
		border: none;
		/*margin-top:10px;*/
	}
	
	.expand-tree .el-tree-node.is-current,
	.expand-tree .el-tree-node:hover {
		overflow: hidden;
	}
	
	.expand-tree .is-current>.el-tree-node__content .tree-btn,
	.expand-tree .el-tree-node__content:hover .tree-btn {
		display: inline-block;
	}
	
	.expand-tree .is-current>.el-tree-node__content .tree-label {
		font-weight: 600;
		white-space: normal;
	}
	
	.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
	}
	
	#app_container {
		bottom: 20px;
		top: 20px;
		position: relative;
	}
	
	.block_left {
		/*max-height: 440px;*/
		float: left;
		margin-top: 20px;
		width: 100%;
		margin-bottom: 20px;
		/*width: 300px;*/
	}
	
	.block_center {
		margin-top: 20px;
		width: 300px;
		margin-left: auto;
		margin-right: auto;
	}
	
	.block_right {
		float: right;
		margin-top: -20px;
		width: 300px;
	}
	/*嵌入页面样式*/
	
	.miao {
		position: absolute;
	}
	
	.add-page {
		width: 75%;
		height: auto;
		float: left;
		display: inline;
		margin-left: 20px;
	}
	
	#add-app-container {
		bottom: 20px;
		top: 0px;
		position: relative;
	}
	
	.label-title {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-left: 8px;
	}
	
	.label-title-span {
		font-weight: bolder;
		color: #475669;
	}
	
	.file-upload {
		float: left;
		position: absolute;
		margin-top: 70px;
		margin-left: 80px;
	}
	
	.file-upload-span {
		color: #48576a;
		position: absolute;
		margin-left: -70px;
	}
	
	.custom-tree-container {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 14px;
		padding-right: 8px;
		margin-top: 20px;
	}
	
	.add-drug {
		width: 20%;
	}
	
	.el-form-item__error {
		width: 200px;
	}
	
	.show-html-panel {
		float: left;
		width: 57%;
		/*transform: scale(0.9,0.75);*/
	}
	
	.show-config-panel {
		float: right;
		width: 22%;
	}
	
	.config-form-item {
		width: 100% !important;
		min-width: 180px !important;
		max-width: 280px !important;
	}
	/*.el-form config-form-item {
		margin: 0px !important;
	}*/
	
	.el-form {
		margin: 0px !important;
	}
	/*form {
		margin: 0px !important;
	}*/
	
	.el-tabs__content {
		/*height: 680px;*/
		padding: 0px;
		overflow-y: auto;
	}
	
	.img-preview {
		width: 100%;
	}
	
	.el-icon-edit:before {
		content: "\E61C";
	}
	/*
	 * 透明度
	 */
	
	.cannot-select {
		float: right;
		width: 22%;
		/*height: 498px;*/
		position: absolute;
		right: 0;
		background-color: #545c64;
		margin-top: 0px;
		opacity: 0.5;
		z-index: 999;
	}
	
	.param-select {
		width: 240px;
	}
	
	.param-input {
		width: 75px;
		float: left;
		margin-top: 10px;
	}
	
	.show-config-panel * {
		font-size: 12px;
	}
	
	.param-select-child {
		float: left;
		margin-right: 10px;
	}
	
	.param-select>span {
		float: left;
		margin-right: 5px;
	}
	
	.method-cfg {
		border-width: 1px;
		border-style: inset;
		border-color: initial;
		border-image: initial;
	}
	
	.iframe_class {
		width: 100%;
		/*height: 498px;*/
		margin-bottom: 20px;
	}
	
	input.text-not-edit {
		background-image: none;
		background-color: white;
	}
	
	input.text-editing {
		background-image: url('/static/poweroff-circle-fill-editing.svg');
		background-size: 16px 100%;
		background-position: center right;
		background-repeat: no-repeat;
		background-color: white;
	}
	
	input.text-related {
		background-image: url('/static/trademark-circle-fill-relate.svg');
		background-size: 16px 100%;
		background-position: center right;
		background-repeat: no-repeat;
		background-color: white;
	}
	
	input.text-complete {
		background-image: url('/static/check-circle-fill-edited.svg');
		background-size: 16px 100%;
		background-position: center right;
		background-repeat: no-repeat;
		background-color: white;
	}
</style>