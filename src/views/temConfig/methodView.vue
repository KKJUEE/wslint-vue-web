<template>
	<section class="method-container" v-bind:style="{height: clientHeight.height}">
		<el-button class="method-add-btn" type="primary" size="mini" @click="created">新增公式配置</el-button>
		<el-button class="method-add-btn" type="primary" size="mini" @click="say">关闭</el-button>

		<el-form label-width="120px">
			<el-form-item label="方法选择：" prop="code" style="margin-top: 20px;">
				<el-select v-model="methodSelectValue" placeholder="请选择方法" @change="funcViewSelect">
					<el-option v-for="item in funcListView" :key="item.value" :label="item.label" :value="item.value">
						<span style="float: left">{{ item.label }}</span>
						<!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>-->
					</el-option>
				</el-select>
			</el-form-item>
			<div v-if="!isTypeDefault">
				<div v-if="!isMasterEmpty" class="title-class">
					<span>{{tableTitle}}</span>
					<el-row>
						<el-col>
							<el-table size="mini" class="method-table" :data="master_user.data" border highlight-current-row>
								<!--增加一列表头-->
								<el-table-column align="center" :label="tableName">
									<!--<el-table-column type="index"></el-table-column>-->
									<el-table-column v-for="(v,i) in master_user.columns" :prop="v.code" :label="v.label" :width="v.width">
										<template slot-scope="scope">
											<span v-if="scope.row.isSet">
				                                <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel[v.code]">
				                                </el-input>
				                            </span>
											<span v-else>{{scope.row[v.code]}}</span>
										</template>
									</el-table-column>
									<el-table-column label="操作" width="200" v-if="master_user.columns.length !== 0">
										<template slot-scope="scope">
											<span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,true)">
				                                {{scope.row.isSet?'保存':"修改"}}
				                            </span>
											<span v-if="!scope.row.isSet" class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;" @click="handleDelete(scope.$index, scope.row)">
				                                	删除
				                            </span>
											<span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,false)">
				                                	取消
				                            </span>
										</template>
									</el-table-column>
								</el-table-column>
							</el-table>
							<el-col v-if="master_user.columns.length !== 0">
								<div class="el-table-add-row" style="width: 95%;margin-left: 20px;" @click="addMasterUser()"><span>+ 添加</span></div>
							</el-col>
						</el-col>
	
					</el-row>
				</div>
				
				<div v-if="!isParamsEmpty" class="title-class">
					<span>{{tableParams}}</span>
					<el-row>
						<el-col>
							<el-table size="mini" class="method-table" :data="master_params.data" border highlight-current-row>
								<!--增加一列表头-->
								<el-table-column align="center" :label="tableName">
									<el-table-column v-for="(v,i) in master_params.columns" :prop="v.code" :label="v.value">
										<template slot-scope="scope">
											<span>
													<span>{{scope.row[v.code]}}</span>
											<i class="el-icon-setting" @click.stop="relationCfg(scope.row,scope.$index)"></i>
											</span>
										</template>
									</el-table-column>
								</el-table-column>
							</el-table>
						</el-col>
	
					</el-row>
				</div>
				
			</div>
			<!--公式展示-->
			<div v-if="isFormulaShow" class="title-class">
				<span>{{formulaTitle}}</span>
				<el-row>
				<el-col>
					<el-table size="mini" class="method-table" :data="master_formula.data" border highlight-current-row>
						<!--增加一列表头-->
						<el-table-column align="center" :label="tableName">
							<el-table-column v-for="(v,i) in master_formula.columns" :prop="v.code" :label="v.value">
							</el-table-column>
						</el-table-column>
					</el-table>
				</el-col>

			</el-row>
			</div>
			

		</el-form>

		<!--
        	作者：offline
        	时间：2018-10-30
        	描述：方法关联关系弹窗展示
        -->
		<el-dialog title="关联关系选择" :visible.sync="dialogTableVisible">

			<iframe id="child_iframe_rel" :src="htmlSrc" v-bind:style="{height: iframeHeight.height}" width="100%" frameborder="1" scrolling="auto"></iframe>

			<!--<el-table :data="gridData">
		    <el-table-column property="date" label="日期" width="150"></el-table-column>
		    <el-table-column property="name" label="姓名" width="200"></el-table-column>
		    <el-table-column property="address" label="地址"></el-table-column>
		  </el-table>-->
		</el-dialog>
		<el-dialog title="配置公式" :visible.sync="isMethodAddView" :close-on-click-modal="false">
			<el-form :model="formulaForm" label-width="120px" :rules="formulaFormRules" ref="formulaForm">
				<!--<el-form-item label="方法名称：" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="方法类型：" prop="delivery">
					<el-radio-group v-model="addForm.delivery" size="medium" @change="changeDelivery">
						<el-radio border label="table"></el-radio>
						<el-radio border label="default"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="isTypeTable" style="margin-left: -120px;">
					<el-form-item label="行属性：" prop="code">
						<el-checkbox-group v-model="addForm.code">
							<el-checkbox v-for="(v,i) in functionObj.funcCode.columns" :prop="v.code" :label="v.value" name="type"></el-checkbox>
						</el-checkbox-group>
						<el-input v-model="addForm.addCode" v-if="isShowAddCode" style="margin-bottom: 20px;"></el-input>
						<el-button v-if="!isShowAddCode" @click.prevent="addFuncCode()">增加</el-button>
						<el-button v-if="isShowAddCode" @click.prevent="confirmFuncCode()">保存</el-button>
					</el-form-item>
					<el-form-item label="列属性：" prop="subselect">
						<el-checkbox-group v-model="addForm.subselect">
							<el-checkbox v-for="(v,i) in functionObj.funcSelect.columns" :prop="v.code" :label="v.value" name="type"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="关联表属性：" prop="relation">
						<el-checkbox-group v-model="addForm.relation">
							<el-checkbox v-for="(v,i) in functionObj.funcRelation.columns" :prop="v.code" :label="v.value" name="type"></el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-form-item>-->
				<el-form-item label="方法选择：" prop="code" style="margin-top: 20px;">
					<el-select v-model="funcSelFormulaValue" placeholder="请选择方法">
						<el-option v-for="item in funcSelectFormula" :key="item.value" :label="item.label" :value="item.value">
							<span style="float: left">{{ item.label }}</span>
							<!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>-->
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-for="(domain, index) in formulaList.domains" :label="'公式' + (index + 1)" :key="domain.key" :prop="'domains.' + index  + '.value'" :rules="{
				      required: true, message: '公式选择不能为空', trigger: 'blur'
				    }">
					<el-select v-model="domain.value" placeholder="请选择公式" @change="formulaViewSelect">
						<el-option v-for="item in formulaListView" :key="item.value" :label="item.label" :value="item.value">
							<span style="float: left">{{ item.label }}</span>
						</el-option>
					</el-select>
					<el-button @click.prevent="removeDomain(domain)">移除</el-button>
				</el-form-item>
				<el-form-item>
					<el-button class="param-select-child" type="primary" plain icon="el-icon-plus" size="mini" @click="addDomain()">增加公式</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addCancel">取消</el-button>
				<!--<el-button @click.native="resetForm('addForm')">重置</el-button>-->
				<el-button type="primary" @click.native="addSubmit('formulaForm')" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>

</template>

<script>
	//数据结构
	import api from '../../api/methodList'
	export default {
		//父组件通过props属性传递进来的数据
		props: {
			msg: {}
		},
		data() {
			return {
				table: api,
				//动态数据
				tableData: [],
				returnNum: 1,
				tableName: '',
				paramCols: api.methodList[0].relations,
				generateId: {
					_count: 1,
					get() {
						return((+new Date()) + "_" + (this._count++))
					}
				},
				master_user: {
					sel: null, //选中行   
					//columns表头动态从server读取
					columns: [],
					data: [],
					//保存当前的tableid
					tableId: '',
					//保存当前table所属的方法id
					functionId: ''
				},
				//参数表
				master_params: {
					sel: null, //选中行   
					//columns表头动态从server读取
					columns: [],
					data: [],

				},
				//公式表
				master_formula: {
					sel: null, //选中行   
					//columns表头动态从server读取
					columns: [],
					data: [],
				},
				cols: api.methodList[0].children,
				//检测浏览器高度
				clientHeight: {
					height: ''
				},
				//iframe高度自适应
				iframeHeight: {
					height: ''
				},
				//属性表名：
				tableTitle: '',
				//参数表名
				tableParams: '',
				//公式表名
				formulaTitle: '',
				//打开模板弹窗
				dialogTableVisible: false,
				//打开模板时，保存需要配置的relation_id
				relation_id: '',
				//方法的list，保存方法的params、select和relation
				funcList: [],
				funcListView: [],
				//保存新增公式配置中的方法select
				funcSelectFormula: [],
				//保存点击的小类节点信息
				secondClassInfo: [],
				//保存配置关联时的row信息
				relConfigRow: [],
				//表头是否为空
				isNoData: false,
				//关联关系窗口
				htmlSrc: '',
				fileInfoObj: {
					fileName: '',
					filePath: ''
				},
				//新增方法界面控制
				isMethodAddView: false,
				/*
				 * 新增界面数据
				 */
				formulaForm: {
					name: '',
				},
				//tyle为table
				isTypeTable: true,
				//复选框内置行/列信息
				functionObj: {
					funcCode: {
						columns: [{
							code: "name",
							value: "物质名"
						}, {
							code: "chromatogramNo",
							value: "色谱图号"
						}]
					},
					funcSelect: {
						columns: [{
							code: "name",
							value: "物质名"
						}, {
							code: "time",
							value: "相对保留时间"
						}, {
							code: "factor",
							value: "矫正因子"
						}, {
							code: "sill",
							value: "阀值"
						}, {
							code: "timeFactor",
							value: "相对保留时间校正"
						}]
					},
					funcRelation: {
						columns: [{
							code: "average_area",
							value: "对照品峰面积平均值"
						}]
					}
				},
				addLoading: false,
				//校验
				formulaFormRules: {
					name: [{
							required: true,
							message: '请输入方法名称',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 15,
							message: '长度在 3 到 15 个字符',
							trigger: 'blur'
						}
					],
					region: [{
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					date1: [{
						type: 'date',
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					date2: [{
						type: 'date',
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					type: [{
						type: 'array',
						required: true,
						message: '请至少选择一个列属性',
						trigger: 'change'
					}],
					resource: [{
						required: true,
						message: '请选择',
						trigger: 'change'
					}],
					desc: [{
						required: true,
						message: '请填写活动形式',
						trigger: 'blur'
					}]
				},
				//增加方法中的行属性增加按钮控制
				isShowAddCode: false,
				//增加方法中的列属性增加按钮控制
				isShowAddSelect: false,
				//增加方法中的关联属性增加按钮控制
				isShowAddRelation: false,
				//方法选择的值
				methodSelectValue: '',
				funcSelFormulaValue: '',
				//是否为table/default判断
				isTypeDefault: false,
				//增加公式相关
				formulaSelectValue: '',
				//可选的公式列表
				formulaListView: [],
				//可增加的方法选择
				formulaList: {
					domains: [{
						
					}]
				},
				//公式是否展示
				isFormulaShow: false,
				//是否为空
				isMasterEmpty: false, 
				isParamsEmpty: false
			}
		},
		mounted() {
			let _this = this;
			_this.boxheight();
		},
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
				_this.clientHeight.height = winHeight * 0.9 + "px";
				_this.iframeHeight.height = winHeight * 0.7 + "px";
				//DIV高度为浏览器窗口高度
				document.getElementById("app_container").style.height = winHeight * 0.9 + "px";

			},
			// 参数就是子组件传递出来的数据
			/*
			 * msg:
			 * 1、关闭新增方法配置（完成/取消，重新获取数据）
			 */
			addViewSay(msg) {
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
			// 子组件通过emit方法触发父组件中定义好的函数，从而将子组件中的数据传递给父组件
			created() {
				//打开新增方法配置
				this.isMethodAddView = true;
				this.getFormulaAll();
				//				let returnObj = {};
				//				returnObj.code = 1;
				//				
				//	          	this.$emit('say' , returnObj);
			},
			say() {
				//关闭方法预览
				let returnObj = {};
				returnObj.code = 2;
				this.$emit('say', returnObj);
			},
			//方法选择
			//方法选择之后，判断展示的对应的table
			funcViewSelect(value) {
				let _this = this;
				//每次选择清空数据
				_this.master_user.data = [];
				_this.master_user.columns = [];
				_this.master_params.data = [];
				_this.master_params.columns = [];
				let _obj = _this.funcList;
				//重新获取模板信息，获得要展示的表格
				for(let itemFunc of _this.funcList) {
					let index = _this.funcList.indexOf(itemFunc);
					if(itemFunc.value === value) {
						_this.getFormulaInfo(itemFunc.id);
						if(itemFunc.type === "default") {
							//可增加公式
							_this.isTypeDefault = true;
							_this.tableName = itemFunc.value;
						} else {
							_this.isTypeDefault = false;
							//根据htmlTemData下的params列表中的functionId,来展示方法
							//表头赋值
							if(itemFunc.params) {
								//如果无数据，不展示属性表和关联关系表
								_this.tableName = itemFunc.value;
								_this.tableTitle = _this.tableName + "属性表";
								_this.tableParams = _this.tableName + "关联关系表";
								_this.master_user.columns = itemFunc.params[0].head.columns.map(item => {
									return {
										label: item.value,
										code: item.code,
									};
								});
								//表格id赋值,在增加、修改和删除操作时需要表格id
								_this.master_user.tableId = itemFunc.params[0].id;
								//保存对应的方法id
								_this.master_user.functionId = itemFunc.id;

								//表格数据赋值
								//原始数据处理
								let paramObj = {};
								if(_this.htmlTemData.param) {
									for(let itemParam of _this.htmlTemData.param) {
										//param下存在对应方法的参数列表
										if(itemParam.functionId === itemFunc.id) {
											let originValue = itemParam.tables[0].rows;
											//数组的遍历for...of（ES6特性）
											for(let n of originValue) {
												let obj = {};
												n.columns.map(function(e, item) { 
													obj[e.code] = e.value; 
												});
												obj.id = n.id;
												_this.master_user.data.push(obj);
											}

											if(itemParam.tables[0].relations) {
												itemParam.tables[0].relations.map(function(e, item) { 
													paramObj[e.code] = e.value; 
												});

											} else {
												let _code = itemFunc.inputs[0].relations[0].code
												paramObj[_code] = "未配置";
											}
											_this.master_params.data.push(paramObj);
										}
									}
								} else {
									//对于关联关系的配置目前只有一项
									let _code = itemFunc.inputs[0].relations[0].code
									paramObj[_code] = "未配置";
									_this.master_params.data.push(paramObj);
								}
								//两个columns为空时的展示
								_this.master_params.columns = itemFunc.inputs[0].relations;
							} else {
								_this.tableName = '';
								_this.tableTitle = '';
								_this.tableParams = '';
							}
						}
					}
				}
				//表头为空，不展示
				if(_this.master_params.columns.length === 0) {
					_this.isParamsEmpty = true;
				}
				if(_this.master_user.columns.length === 0) {
					_this.isMasterEmpty = true;
				}
			},
			//药品/小类信息获取方法参数及关联关系
			getFuncInfo(n) {
				let _this = this;
				_this.secondClassInfo = n;
				let params = {
					//从小类节点获取药品id
					medicineId: n.parent.parent.data.id,
					//大类id
					firstClassId: n.parent.data.id,
					//获取节点id
					secondClassId: n.data.id
				};
				_this.$get('/config/document/template/get?medicineId=' + params.medicineId + '&firstClassId=' + params.firstClassId + '&secondClassId=' + params.secondClassId, {}).then(res => {
					_this.isNoData = true;
					//必须初始化，否则一直添加
					_this.master_user.data = [];
					_this.master_params.data = [];
					//保存接口返回的模板信息
					_this.htmlTemData = res.data;
					//保存方法信息
					_this.funcList = _this.htmlTemData.method.functions.map(item => {
						return {
							value: item.name,
							label: item.name,
							id: item.id,
							outputs: item.outputs,
							inputs: item.inputs,
							params: item.params,
							type: item.type
						};
					});

					//数组深拷贝
					_this.funcListView = JSON.parse(JSON.stringify(_this.funcList));
					_this.funcSelectFormula = JSON.parse(JSON.stringify(_this.funcList));
					//					_this.funcListView = _this.funcListView.filter(item => item.type !== "default");

					if(_this.funcListView.length !== 0) {
						_this.methodSelectValue = _this.funcListView[0].value;
						_this.funcViewSelect(_this.methodSelectValue);
					}

					_this.fileInfoObj = {};
					if(res.data.filePath !== '' && res.data.fileName !== '') {
						//获取模板文件
						_this.fileInfoObj = {
							fileName: res.data.fileName,
							filePath: res.data.filePath
						}
					}
				}).catch(() => {
					_this.isNoData = false;
				})
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
			//获取公式的信息，展示表格
			getFormulaInfo(funcId) {
				let _this = this;
				//每次获取数据时，清空参数列表
				_this.paramsList = [];
				let paramDes = 1;
				let obj = {
					functionId: funcId
				}
				_this.master_formula.columns = [];
				_this.master_formula.data = [];
				_this.$get("/config/document/method/formulas/get?functionId=" + obj.functionId).then(res => {
					//获取到formula参数,参数赋值
					if(res.data && res.data.length) {
						_this.isFormulaShow = true
						for(let itemFunc of _this.funcList) {
							if(itemFunc.id == funcId) {
								_this.tableName = itemFunc.value;
								_this.formulaTitle = itemFunc.value + "公式表";
							}
						}
						
//						_this.master_formula.data = res.data.map(item => {
//							return {
//								id: item.id,
//								value: item.name,
//								label: item.name,
//								paramCount: item.paramCount
//							}
//						})
						_this.master_formula.columns = [{
							code: "id",
							value: "公式id"
						}, {
							code: "name",
							value: "名称"
						}, {
							code: "paramCount",
							value: "参数个数"
						}]
						
						for(let n of res.data) {
							//无限个数
							if(n.paramCount < 0) {
								n.paramCount = "无限制"
							}
							_this.master_formula.data.push(n);
						}
//						let paramObj = {};
//						res.data.map(function(e, item) { 
//							paramObj[e.id] = e.value; 
//						});
//						_this.master_formula.data.push(paramObj);
//											
											
						return resolve(res.data)
					} else {
						_this.isFormulaShow = false
						return resolve(res.data)
					}

				}).catch(() => {});
			},
			//获取全部公式列表
			getFormulaAll() {
				let _this = this;
				_this.$get("/config/document/method/formulas/all").then(res => {
					//获取到formula列表
					if(res.data && res.data.length) {
						_this.formulaListView = res.data.map(item => {
							return {
								id: item.id,
								value: item.name,
								label: item.name,
								paramCount: item.paramCount
							}
						});
						return resolve(res.data)
					} else {
						return resolve(res.data)
					}

				}).catch(() => {});
			},
			//增加公式select
			addDomain() {
		        this.formulaList.domains.push({
		          value: ''
		        });
		     },
		     //移除公式select
		     removeDomain(item) {
		        var index = this.formulaList.domains.indexOf(item)
		        if (index !== -1 && this.formulaList.domains.length > 1) {
		          this.formulaList.domains.splice(index, 1)
		        }
		      },
			//读取表格数据
			readMasterUser() {
				let _this = this;
				//传入id
				_this.master_user.data.map(i => {
					i.id = _this.generateId.get(); //模拟后台插入成功后有了id
					return i;
				});
			},
			//添加账号
			addMasterUser() {
				for(let i of this.master_user.data) {
					if(i.isSet) return this.$message.warning("请先保存当前编辑项");
				}
				let j = {
					"isSet": true
				};
				this.master_user.data.push(j);
				this.master_user.sel = JSON.parse(JSON.stringify(j));
			},
			/*新增、修改
			 * row.id == null为新增  
			 */
			pwdChange(row, index, cg) {
				let _this = this;
				//点击修改 判断是否已经保存所有操作
				for(let i of _this.master_user.data) {
					if(i.isSet && i.id != row.id) {
						_this.$message.warning("请先保存当前编辑项");
						return false;
					}
				}
				//是否是取消操作
				if(!cg) {
					//重新读取表格数据
					_this.getFuncInfo(_this.secondClassInfo);
				}
				//提交数据
				if(row.isSet) {
					//项目是模拟请求操作  自己修改下
					(function() {
						let data = JSON.parse(JSON.stringify(_this.master_user.sel));
						//保存方法参数
						let obj = {
							columnDTOList: [],
							functionId: _this.master_user.functionId,
							medicineId: _this.secondClassInfo.parent.parent.data.id,
							secondId: _this.secondClassInfo.data.id,
							tableId: _this.master_user.tableId
						};

						let columnObj = _this.master_user.sel;
						delete columnObj.isSet;

						if(row.id) { //修改方法参数
							
//							_this.$confirm('即将修改参数, 是否继续?', '提示', {
//								confirmButtonText: '确定',
//								cancelButtonText: '取消',
//								type: 'warning'
//							}).then(() => {
								obj.rowId = row.id;
								delete columnObj.id;
								for(let i in columnObj) {
									let toPram = {};
									toPram.code = i;
									toPram.value = columnObj[i];
									obj.columnDTOList.push(toPram)
								}
								_this.$post('/config/document/method/update', obj).then(res => {
									_this.$message({
										type: 'success',
										message: "修改参数成功!"
									});
									//重新读取表格数据
									_this.getFuncInfo(_this.secondClassInfo);
									row.isSet = false;
									return resolve(res.data)
								}).catch(() => {});
//							}).catch(() => {
//								
//							});
						} else { //新增方法参数
							for(let i in columnObj) {
								let toPram = {};
								toPram.code = i;
								toPram.value = columnObj[i];
								obj.columnDTOList.push(toPram)
							}
							_this.$post('/config/document/method/add', obj).then(res => {
								_this.$message({
									type: 'success',
									message: "保存参数成功!"
								});
								//重新读取表格数据
								_this.getFuncInfo(_this.secondClassInfo);
								row.isSet = false;
								return resolve(res.data)
							}).catch(() => {});
						}
					})();
				} else {
					_this.master_user.sel = JSON.parse(JSON.stringify(row));
					row.isSet = true;
				}
			},
			//方法关联关系配置
			relationCfg(row, index) {
				//弹窗展示模板界面，提供选择，并且提供关闭按钮，关闭回到此页面
				this.dialogTableVisible = true;
				this.getTemFile(this.fileInfoObj.filePath, this.fileInfoObj.fileName);
				this.relConfigRow = row;
				let _this = this;
				_this.relation_id = row.relation_id;
				//传递模板的空格关系到iframe
				setTimeout(function() {
					let commitObj = window.frames["child_iframe_rel"]; //获得对应iframe的window对象
					//发送消息给子iframe
					let targetOrigin = "*";
					// 5、方法预览界面，选择其关联关系配置
					let input_params = {
						parent_key: "5"
					};

					commitObj.contentWindow.postMessage(input_params, targetOrigin);
				}, 1000);
			},
			//保存信息，并弹窗提示选择成功，关闭弹窗，并且更新方法预览的数据
			relationCfgOk(input_id) {
				let _this = this;
				let obj = {
					value: input_id,
					functionId: _this.master_user.functionId,
					medicineId: _this.secondClassInfo.parent.parent.data.id,
					secondId: _this.secondClassInfo.data.id,
					tableId: _this.master_user.tableId
				};
				for(var i in _this.relConfigRow) {
					obj.code = i;
				}

				_this.$post('/config/document/method/relation/save', obj).then(res => {
					_this.dialogTableVisible = false;
					_this.$message({
						type: 'success',
						message: "已成功选择关联关系!"
					});

					//重新读取表格数据
					_this.getFuncInfo(_this.secondClassInfo);
					return resolve(res.data)
				}).catch(() => {});
			},
			//删除
			handleDelete(index, row) {
				//需要弹窗提示
				let _this = this;
				
				_this.$confirm('即将删除参数, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let obj = {
						functionId: _this.master_user.functionId,
						medicineId: _this.secondClassInfo.parent.parent.data.id,
						rowId: row.id,
						secondId: _this.secondClassInfo.data.id,
						tableId: _this.master_user.tableId
					};
					_this.$delete('/config/document/method/delete', obj).then(res => {
						_this.$message({
							type: 'success',
							message: "删除参数成功!"
						});
						//重新读取表格数据
						_this.getFuncInfo(_this.secondClassInfo);
						return resolve(res.data)
					}).catch(() => {});
				}).catch(() => {
					
				});
				
			},
			//公式选择时的事件
			formulaViewSelect() {
				console.log();
			},
			//增加方法行属性
			addFuncCode() {
				let _this = this;
				_this.isShowAddCode = true;
			},

			//保存属性
			confirmFuncCode() {
				let _this = this;
				let obj = {
					code: _this.addForm.addCode,
					value: _this.addForm.addCode
				}
				_this.functionObj.funcCode.columns.push(obj)
				_this.isShowAddCode = false;
			},
			//type属性变化
			changeDelivery(value) {
				if(value === "table") {
					this.isTypeTable = true;
				} else {
					this.isTypeTable = false;
				}
			},
			addCancel() {
				this.isMethodAddView = false;
				this.resetFormula();
			},
			addSubmit(formName) {
				let _this = this;
				
				//公式id列表
				let idList = _this.formulaList.domains.map(item=> {
					for(let formulaItem of _this.formulaListView) {
						if(formulaItem.value == item.value) {
							return {
								id: formulaItem.id
							}
						}
					}
				})
				
				let funcId = '';
				for(let funcItem of _this.funcSelectFormula) {
					if(funcItem.value == _this.funcSelFormulaValue) {
						funcId = funcItem.id
					}
				}
				
				let params = {
					formulas: idList,
					functionId: funcId
				}
				_this.$post("/config/document/method/formulas/save", params).then(res => {
					//重新获取公式列表数据
					//重新读取表格数据
					_this.getFuncInfo(_this.secondClassInfo);
					_this.isMethodAddView = false;
					_this.resetFormula();
					return resolve(res.data)
				}).catch(() => {});
				
			},
			//重置表格
			resetForm(formName) {
				this.isShowAddCode = false;
				this.$nextTick(() => {
					this.$refs[formName].resetFields();
				});
			},
			//清空公式配置界面
			resetFormula() {
				this.funcSelFormulaValue = '';
				//只保留第一项
//				if(this.formulaList.domains.length > 1) {
//					this.formulaList.domains = this.formulaList.domains.filter(item => {
//						this.formulaList.domains.indexOf(item) !== 0
//					});
////					item.type !== "default");
//				}
//				var index = this.formulaList.domains.indexOf(item)
//		        if (index !== -1 && this.formulaList.domains.length > 1) {
//		          this.formulaList.domains.splice(index, 1)
//		        }
//				this.formulaList.domains
				this.formulaList = {
					domains: [{value: ''}]
				};
				this.formulaListView = [];
			}
		}
	}
</script>
<style>
	.method-container {
		float: left;
		width: 79%;
		/*height: 490px;*/
		overflow-y: auto;
	}
	
	.method-add-btn {
		margin: 20px 0px 0px 20px;
	}
	
	.method-table {
		width: 100%;
		padding: 20px;
	}
	
	.el-table--border,
	.el-table--group {
		border: 0 !important;
	}
	
	.title-class {
		padding: 20px 20px 0 20px;
		color: #909399;
		font-weight: bold;
	}
</style>