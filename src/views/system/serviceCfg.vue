<template>
	<section>
		
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.paramDes" placeholder="参数描述"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="handleAddFnc">新增</el-button><!--@click="handleAdd"-->
				</el-form-item>
			</el-form>
		</el-col>
		<!--<template>
		<el-table :data="tableData" border style="width: 100%" @cell-click="cellClick">
			<el-table-column label="日期" width="180">
				<template scope="scope">
					<el-icon name="time"></el-icon>
					<span style="margin-left: 10px">{{ scope.row.date }}</span>
				</template>
			</el-table-column>
			<el-table-column label="姓名" width="180" >
				<template scope="scope">
					<el-input v-model="scope.row.name" v-if="scope.row.seen"
					
					@blur="loseFcous(scope.$index, scope.row)" > </el-input>
					
					<span style="margin-left: 10px" v-else>{{ scope.row.name }}</span>
				</template>
			</el-table-column>
		
		</el-table>
		</template>-->
		<!--<el-table-column prop="orderCount" label="排序序号">
            <template slot-scope="{row,$index}">
                <div  @click="{{chengenum($index)}}">
                <el-input v-if="editable[$index]" v-model='grade'></el-input>
                <span v-else>{{row.orderCount}}</span>
                </div>
            </template>
        </el-table-column>-->
		<!--列表-->
		<!--<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" @cell-dblclick="cellClick">
			<el-table-column type="index" width="50px">
			</el-table-column>
			<el-table-column prop="paramDes" label="参数描述" width="150px" sortable>
				<template scope="scope">
					<el-input v-model="scope.row.paramDes" v-if="scope.row.seen"
					
					@blur="loseFcous(scope.$index, scope.row)" > </el-input>
					
					<span style="margin-left: 10px" v-else>{{ scope.row.paramDes }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="paramCode" label="参数编码" width="150px" sortable>
			</el-table-column>
			<el-table-column prop="value" label="参数值" width="150px" sortable>
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="150px" sortable>
			</el-table-column>
			<el-table-column prop="details" label="详细信息" width="200px" sortable>
			</el-table-column>
			<el-table-column label="操作" min-width="20%">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>-->
		<!--
        	作者：offline
        	时间：2018-10-24
        	描述：v-for的方法
        -->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" @cell-dblclick="cellClick">
			<el-table-column type="index" width="50px">
			</el-table-column>
			<el-table-column v-for="{prop,label} in colConfigs" :key="prop" :prop="prop" :label="label" width="150px" sortable>
				<!--<template scope="scope">
					<el-input v-model="scope.row" v-if="scope.row.seen"
					
					@blur="loseFcous(scope.$index, scope.row)" > </el-input>
					
					<span style="margin-left: 10px" >{{ scope.row }}</span>
				</template>-->
			</el-table-column>
			<el-table-column label="操作" min-width="20%">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
<!--			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="参数描述" prop="paramDes">
					<el-input v-model="editForm.paramDes" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="参数编码">
					<el-input v-model="editForm.paramCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="参数值">
					<el-input-number v-model="editForm.value" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="备注">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.remark"></el-date-picker>
				</el-form-item>
				<el-form-item label="详细信息">
					<el-input type="textarea" v-model="editForm.details"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible":close-on-click-modal="false" >
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="参数描述" prop="paramDes">
					<el-input v-model="addForm.paramDes" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="参数编码">
					<el-input v-model="addForm.paramCode" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="参数值">
					<el-input-number v-model="addForm.value" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="备注">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.remark"></el-date-picker>
				</el-form-item>
				<el-form-item label="详细信息">
					<el-input type="textarea" v-model="addForm.details"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
//	import HelpDoc from '@/components/helpdoc.page'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			this.colConfigs= [
					{ prop: 'paramDes', label: '参数描述' },
					{ prop: 'paramCode', label: '参数编码' },
			        { prop: 'value', label: '参数值' },
			        { prop: 'remark', label: '备注' },
			        { prop: 'details', label: '详细信息' }
		        ]

			return {
				
				activeName: 'second',
				filters: {
					paramDes: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					paramDes: [
						{ required: true, message: '请输入参数值', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					paramDes: '',
					paramCode: '',
					value: -1,
					remark: 0,
					details: '',
					seen: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					paramDes: [
						{ required: true, message: '请输入参数值', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					paramDes: '',
					paramCode: '',
					value: -1,
					remark: 0,
					details: ''
				},
				editable: []

			}
		},
		methods: {
			add(scope1){
		      console.log(scope1)
		    },
    		loseFcous(index, row) {
//			debugger
				row.seen=false;
			},
			cellClick(row, column) {
			//debugger
				row.seen=true;
			},
			handleClick(tab, event) {
		        console.log(tab, event);
		      },
			//名称显示转换
			formatSex(row, column) {
				return row.sex == 1 ? '参数值' : row.sex == 0 ? '参数描述' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				let data = [{
					details: "app发布版本",
					value: "1.0.0",
					remark: "功能介绍",
					id: "B7c79698-a9b3-7dEb-035b-da4befF0c9C9",
					paramDes: "app版本",
					paramCode: "app_version",
					seen: false
				}]
				//模拟数据
				let _this = this;
				_this.listLoading = true;
				_this.users = data;
				_this.total = 85;
				
				let len = data.length;
//              _this.editabl这个是控制显示隐藏的量
                _this.editable = new Array(len);

				
				//作用域问题思考：setTimeout设置延时之后，再次加载listLoading为undefined，对this重新赋值
				setTimeout(function(){
					_this.listLoading = false;
				},1000)
				//NProgress.start();
//				getUserListPage(para).then((res) => {
//					this.total = res.data.total;
//					this.users = res.data.users;
//					this.listLoading = false;
//					//NProgress.done();
//				});
			},
			
			//删除
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					let _this = this;
					_this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					//暂时处理loading
					setTimeout(function(){
						_this.listLoading = false;
					},1000)
					
//					removeUser(para).then((res) => {
//						this.listLoading = false;
//						//NProgress.done();
//						this.$message({
//							message: '删除成功',
//							type: 'success'
//						});
//						this.getUsers();
//					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit(index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAddFnc() {
				this.addFormVisible = true;
				this.addForm = {
					paramDes: '',
					paramCode: '',
					value: -1,
					remark: 0,
					details: ''
				};
			},
			//编辑
			editSubmit() {
				let _this = this;
				_this.$refs.editForm.validate((valid) => {
					if (valid) {
						_this.$confirm('确认提交吗？', '提示', {}).then(() => {
							_this.editLoading = true;
							//NProgress.start();
							setTimeout(function(){
								_this.editLoading = false;
								_this.editFormVisible = false;
							},2000)
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
//							editUser(para).then((res) => {
//								this.editLoading = false;
//								//NProgress.done();
//								this.$message({
//									message: '提交成功',
//									type: 'success'
//								});
//								this.$refs['editForm'].resetFields();
//								this.editFormVisible = false;
//								this.getUsers();
//							});
						});
					}
				});
			},
			//新增
			addSubmit() {
				let _this = this;
				_this.$refs.addForm.validate((valid) => {
					if (valid) {
						_this.$confirm('确认提交吗？', '提示', {}).then(() => {
							_this.addLoading = true;
							//NProgress.start();
							//仅仅是模拟请求
							setTimeout(function(){
								_this.addLoading = false;
								_this.addFormVisible = false;
							},2000)
							let para = Object.assign({}, _this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
//							addUser(para).then((res) => {
//								this.addLoading = false;
//								//NProgress.done();
//								this.$message({
//									message: '提交成功',
//									type: 'success'
//								});
//								this.$refs['addForm'].resetFields();
//								this.addFormVisible = false;
//								this.getUsers();
//							});
						});
					}
				});
			},
			selsChange(sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					let _this = this;
					_this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					setTimeout(function(){
						_this.listLoading = false;
					},2000)
//					batchRemoveUser(para).then((res) => {
//						this.listLoading = false;
//						//NProgress.done();
//						this.$message({
//							message: '删除成功',
//							type: 'success'
//						});
//						this.getUsers();
//					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>