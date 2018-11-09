<template>
	<div>
        <el-row>
            <el-col>
                <el-table size="mini" :data="master_user.data" border style="width: 100%" highlight-current-row>
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
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <span class="el-tag el-tag--info el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,true)">
                                {{scope.row.isSet?'保存':"修改"}}
                            </span>
                            <span v-if="!scope.row.isSet" class="el-tag el-tag--danger el-tag--mini" style="cursor: pointer;">
                                	删除
                            </span>
                            <span v-else class="el-tag  el-tag--mini" style="cursor: pointer;" @click="pwdChange(scope.row,scope.$index,false)">
                                	取消
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col>
                <div class="el-table-add-row" style="width: 99.2%;" @click="addMasterUser()"><span>+ 添加</span></div>
            </el-col>
        </el-row>

    </div>
	
</template>

<script>
	//数据结构
	import api from '../../api/methodList'
	export default {
		//父组件通过props属性传递进来的数据
	      props: {
	          msg: {
	              type: Number,
	              default: () => {
	                  return 1
	              }
	          }
	      },
		data() {
			return {
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
                cols: api.methodList[0].children 
				
			}
		},
		mounted() {
			//id生成工具 这个比用看 示例而已 模拟后台返回的id
//	        let generateId = {
//	            _count: 1,
//	            get(){return ((+new Date()) + "_" + (this._count++))}
//	        };
			let _this = this;
			let objData = {};
			//设置表头
			for (let i in _this.cols) {
				let obj = {};
				
				obj.prop = _this.cols[i].prop;
				obj.label = _this.cols[i].label;
				obj.width = 120;
				_this.master_user.columns.push(obj);
				
				//保存表格数据
				objData[_this.cols[i].prop] = _this.cols[i].value;
				
			}
			_this.master_user.data.push(objData);
			
			console.log(_this.master_user.columns)
		},
		methods: {
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
            }
		}
	}
</script>
<style>
	/*.method-container {
	    float: left;
    	width: 79%;
    	height: 490px;
	    overflow-y: auto;
	}
	.method-add-btn {
		margin: 20px 20px 0;
	}
	.method-table {
		width: 100%;
		padding: 20px;
	}
	.el-table--border, .el-table--group {
		border: 0 !important;
	}*/
	 .el-table-add-row {
	    margin-top: 10px;
	    width: 100%;
	    height: 34px;
	    border: 1px dashed #c1c1cd;
	    border-radius: 3px;
	    cursor: pointer;
	    justify-content: center;
	    display: flex;
	    line-height: 34px;
	 }
</style>