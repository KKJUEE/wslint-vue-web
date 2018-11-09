<template>
	<section class="method-cfg-container" style="height: 500px;">
		<!--<el-button class="method-cfg-add-btn" type="primary" size="mini" @click.prevent="addRow()">新增参数</el-button>-->
		<el-button class="method-cfg-add-btn" type="primary" size="mini" @click.prevent="complte()">完成</el-button>
		<el-form class="config-form-item" label-width="80px" @submit.prevent="onSubmit" style="width:60%;min-width:600px;margin-top: 20px !important;">
			<el-form-item label="方法选择" >
				<el-select v-model="forType" clearable placeholder="请选择方法" @change="changeSelect">
					 <el-option
				      v-for="item in options"
				      :key="item.value"
				      :label="item.label"
				      :value="item.value">
				   </el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-row  v-if="isShowTable">
            <el-col>
                <el-table size="mini" class="method-cfg-table" :data="master_user.data" border highlight-current-row>
                	<!--增加一列表头-->
                	<el-table-column align="center" :label="tableName">
	                    <el-table-column type="index"></el-table-column>
	                    <el-table-column v-for="(v,i) in master_user.columns" :prop="v.prop" :label="v.label" :width="v.width">
	                        <template slot-scope="scope">
	                            <span v-if="scope.row.isSet">
	                                <el-input size="mini" placeholder="请输入内容" v-model="master_user.sel[v.prop]">
	                                </el-input>
	                            </span>
	                            <span v-else>{{scope.row[v.prop]}}</span>
	                        </template>
	                    </el-table-column>
	                    <el-table-column label="操作" width="200">
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
                <el-col>
                <div class="el-table-add-row" style="width: 95%;margin-left: 20px;" @click="addMasterUser()"><span>+ 添加</span></div>
            </el-col>
            </el-col>
            
       </el-row>
		
		<!--<el-table v-if="isShowTable" :data="tableData" class="method-cfg-table">
            <template v-for="(col,index) in cols">
            	<el-table-column v-if="col.type =='normal'" 
			        :prop="col.prop"
			        :label="col.label"
			        width="180">
			        <template slot-scope="myList">
		              <el-input v-model="myList[col.prop]"></el-input>
		          </template>
			     </el-table-column>
            </template>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>-->
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
				forType: '',
				table: api,
				//动态数据
				tableName: '', //表头
				tableData: [],
				scope: { 
					row: {}
				},
				returnNum: 2,
				addId: 1000,
				isShowTable: false,
				/*
				 * 动态表格begin
				 */
				generateId : {
		            _count: 1,
		            get(){return ((+new Date()) + "_" + (this._count++))}
		       	},
				master_user: {
                    sel: null,//选中行   
                    //columns表头动态从server读取
                    columns: [
                    ],
                    data: [],
                    
                },
				cols: api.methodList[0].children,
				/*
				 * 动态表格end
				 */
				options: [{
		          value: '有关物质-对照品',
		          label: '有关物质-对照品'
		        },{
		          value: '有关物质-供试品',
		          label: '有关物质-供试品'
		        }],
		        //检测浏览器高度
				clientHeight: {
					height: '600px'
				} ,
			}
		},
		mounted() {
			let _this = this;
			
			// 动态设置背景图的高度为浏览器可视区域高度
    
		    // 首先在Virtual DOM渲染数据时，设置下背景图的高度．
		    _this.clientHeight.height = `${parseInt(document.body.clientHeight) * 0.80}px`;
		    // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．

		    window.onresize = function temp() {
		        _this.clientHeight.height = `${parseInt(document.body.clientHeight) * 0.80}px`;
		    };
//			let objData = {};
			//设置表头
			for (let i in _this.cols) {
				let obj = {};
				
				obj.prop = _this.cols[i].prop;
				obj.label = _this.cols[i].label;
//				obj.isSet = false;
//				obj.width = 150;
				_this.master_user.columns.push(obj);
				
				//保存表格数据
//				objData[_this.cols[i].prop] = _this.cols[i].value;
				
			}
			
			
//			_this.master_user.data.push(objData);
		},
		methods: {
			// 子组件通过emit方法触发父组件中定义好的函数，从而将子组件中的数据传递给父组件
	          complte() {
	          	//完成方法配置
//	          	this.$emit('say' , this.returnNum = 3);
				let returnObj = {};
				returnObj.code = 3;
	          	this.$emit('say' , returnObj);
	          },
	          changeSelect(value) {
	          	if (value.length === 0) {
	          		return this.isShowTable = false;
	          		
	          	}
	          	if (value !== "选项1") {
	          		this.isShowTable = true;
	          	} else {
	          		this.isShowTable = false;
	          	}
	          	this.tableName = value;
	          	console.log(value)
	          },
			 //读取表格数据
            readMasterUser() {
            	let _this = this;
				//传入id
                _this.master_user.data.map(i => {
                    i.id = _this.generateId.get();//模拟后台插入成功后有了id
                    return i;
                });
            },
            //添加账号
            addMasterUser() {
                for (let i of this.master_user.data) {
                    if (i.isSet) return this.$message.warning("请先保存当前编辑项");
                }
                let j = { id: 0, "isSet": true};
                this.master_user.data.push(j);
                this.master_user.sel = JSON.parse(JSON.stringify(j));
            },
            //修改
            pwdChange(row, index, cg) {
            	let _this = this;
                //点击修改 判断是否已经保存所有操作
                for (let i of _this.master_user.data) {
                    if (i.isSet && i.id != row.id) {
                        _this.$message.warning("请先保存当前编辑项");
                        return false;
                    }
                }
                //是否是取消操作
                if (!cg) {
                    if (!_this.master_user.sel.id) _this.master_user.data.splice(index, 1);
                    //然后这边重新读取表格数据
                        
                    _this.readMasterUser();
                    return row.isSet = !row.isSet;
                }
                //提交数据
                if (row.isSet) {
                    //项目是模拟请求操作  自己修改下
                    (function () {
                        let data = JSON.parse(JSON.stringify(_this.master_user.sel));
                        for (let k in data) row[k] = data[k];
                        _this.$message({
                            type: 'success',
                            message: "保存成功!"
                        });
                        //然后这边重新读取表格数据
                        
                        _this.readMasterUser();
                        row.isSet = false;
                        
                    })();
                } else {
                    _this.master_user.sel = JSON.parse(JSON.stringify(row));
                    row.isSet = true;
                }
            },
            //删除
            handleDelete(index, row) {
            	//需要弹窗提示
				let _this = this;
				console.log(index, row);
				_this.master_user.data.splice(index, 1);
				//然后这边重新读取表格数据
                _this.readMasterUser();
			},
		}
	}
</script>
<style>
	.method-cfg-container {
	    float: left;
    	width: 79%;
    	/*height: 490px;*/
	    overflow-y: auto;
	}
	.method-cfg-add-btn {
		margin: 20px 20px 0;
	}
	.method-cfg-table {
		width: 100%;
		padding: 0 20px;
	}
</style>