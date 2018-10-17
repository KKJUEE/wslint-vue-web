<template>
  	<!--<div class="expand">-->
	  	<div id="app_container">
			<div class="expand">
				<div>
					<el-button type="primary" @click="addMedicie">新增药品</el-button>
				</div>
				<div class="block_left">
					<!--<p>使用 render-content</p>-->
					<!--<el-tree :data="data4" highlight-current node-key="id" ref="tree" default-expand-all :expand-on-click-node="true" :render-content="renderContent">
					</el-tree>-->
					<!--使用图标展示增删改-->
					<el-tree ref="expandMenuList" class="expand-tree"
				        v-if="isLoadingTree"
				        :data="setTree"
				        node-key="id"
				        highlight-current
				        :props="defaultProps"
				        :expand-on-click-node="true"
				        :render-content="renderContent"
				        :default-expanded-keys="defaultExpandKeys"
				        @node-click="handleNodeClick">
					</el-tree>
				</div>
				<!--<div class="block_center">
					<span>a</span>
					
				</div>
				<div class="block_right">
					<span>b</span>
				</div>-->
			</div>
			<div class="add-page" v-if="isAction">
				<!--使用组件方式引入vue，数据传递不可控-->
				<!--<addpage v-if="addPage" class="miao"></addpage>-->
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
								<el-button type="primary" @click="contiAddMedicie">继续添加</el-button>
								<el-button type="primary" @click="confirmAddMed">完成</el-button>
								<el-button type="primary" @click="addFirstType">添加类型</el-button>
							</div>
						</div>
						<div class="custom-tree-container">
							<el-form class="add-drug" :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
								<el-form-item label="药品名称"  prop="drugName">
									<el-input v-model="addForm.drugName" auto-complete="off"></el-input>
								</el-form-item>
								<el-form-item label="工厂信息" prop="factory">
									<el-input v-model="addForm.factory" auto-complete="off"></el-input>
								</el-form-item>
							</el-form>
						</div>
					</div>
					
					<!--
			        	作者：offline
			        	时间：2018-10-16
			        	描述：展示增加类型（大类信息）
			        -->
			        <div v-if="isAddFirst">
			        	<div class="label-title">
							<span class="label-title-span">添加类型</span>
							<div>
								<el-button type="primary">继续添加</el-button>
								<el-button type="primary" @click="comfirmAddFir">完成</el-button>
								<el-button type="primary">添加类型</el-button>
							</div>
						</div>
						<div class="custom-tree-container">
							<el-form class="add-drug" :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
								<el-form-item label="类型名称"  prop="firstType">
									<el-input v-model="addForm.firstType" auto-complete="off"></el-input>
								</el-form-item>
							</el-form>
						</div>
			        </div>
			        
			        <!--
			        	作者：offline
			        	时间：2018-10-16
			        	描述：添加小类并导入模板
			        -->
			        <div v-if="isAddSec">
			        	<div class="label-title">
							<span class="label-title-span">添加类型</span>
							<div>
								<el-button type="primary" @click="drugAdd">继续添加</el-button>
								<el-button type="primary">完成</el-button>
								<el-button type="primary">添加类型</el-button>
							</div>
						</div>
						<div class="custom-tree-container">
							<el-form class="add-drug" :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
								<el-form-item label="类型名称"  prop="firstType">
									<el-input v-model="addForm.firstType" auto-complete="off"></el-input>
								</el-form-item>
							</el-form>
							<!--文件导入-->
							<div class="file-upload">
								<span class="file-upload-span">选择模板</span>
								<el-upload
								  action="https://jsonplaceholder.typicode.com/posts/"
								  list-type="picture-card"
								  :on-preview="handlePictureCardPreview"
								  :on-remove="handleRemove">
								  <i class="el-icon-plus"></i>
								</el-upload>
								<el-dialog :visible.sync="dialogVisible">
								  <img width="100%" :src="dialogImageUrl" alt="">
								</el-dialog>
							</div>
						</div>
			       </div>
				</div>
			</div>
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
//数据结构
import api from '../../api/tree_api'

  export default{
    name: 'tree',
    data(){
      return{
        maxexpandId: api.maxexpandId,//新增节点开始id
        non_maxexpandId: api.maxexpandId,//新增节点开始id(不更改)
        isLoadingTree: false,//是否加载节点树
        setTree: api.treelist,//节点树数据
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        defaultExpandKeys: [],//默认展开节点列表
        //是否展示添加页面
        addPage: true,
        //文件模板导入
		dialogImageUrl: '',
		dialogVisible: false,
		addFormRules: {
			drugName: [
				{ required: true, message: '请输入药品名称', trigger: 'blur' }
			],
			factory: [
				{ required: true, message: '请输入工厂信息', trigger: 'blur' }
			],
			firstType: [
				{ required: true, message: '请输入类型名称', trigger: 'blur' }
			],
			secondType: [
				{ required: true, message: '请输入工厂信息', trigger: 'blur' }
			]
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
		//保存增/删/改的节点信息
		nodes: {
			s: '',
			d: '',
			n: ''
		}
      }
    },
    components: {
		...mapState({
	        messages: state => state.messages
	    })
	},
    mounted(){
      console.log(api)
      this.initExpand()
    },
    methods: {
      ...mapActions(['newMessage']),
      initExpand(){
        this.setTree.map((a) => {
          this.defaultExpandKeys.push(a.id)
        });
        this.isLoadingTree = true;
      },
      handleNodeClick(d,n,s){//点击节点
      	
      	//小类节点则可upload模板并渲染生成
      	if (n.level === 3) {
      		//打开模板界面
      		console.log("upload html")
      	}
      	
        // console.log(d,n)
        d.isEdit = false;//放弃编辑状态
      },
      //vuex方式更新数据
      addMedicies() {
      	console.log(this.$store.getters.getMessage)
      	console.log( this.newMessage({
		    text: 'test'
		}))
      },
      renderContent(h,{node,data,store}){//加载节点
        let that = this;
        return h(TreeRender,{
          props: {
            DATA: data,
            NODE: node,
            STORE: store,
            maxexpandId: that.non_maxexpandId
          },
          on: {
          	//在节点改变之前，先包装一层
            nodeAdd: ((s,d,n) => that.getAddNodes(s,d,n)),
            nodeEdit: ((s,d,n) => that.handleEdit(s,d,n)),
            nodeDel: ((s,d,n) => that.handleDelete(s,d,n))
          }
        });
      },
      //打开新增药品界面
      addMedicie() {
      	this.isAction = true;
		this.isAddMed = true;
      },
      //完成药品添加
      confimAddMed() {
      	var _this = this;
      	//校验...
      	this.handleAddTop();
      	this.isAddMed = false;
      },
      //继续添加药品
      contiAddMedicie() {
      	this.handleAddTop();
      	this.addForm.drugName = this.addForm.factory = '';
      },
      //保存节点信息
      getAddNodes(s,d,n) {
      	this.nodes.s = s;
      	this.nodes.d = d;
      	this.nodes.n = n;
      	this.addFirstType();
      },
      //打开新增大类界面
      addFirstType() {
      	this.isAction = true;
      	//两个入口，此处屏蔽添加药品入口的界面
      	if(this.isAddMed) {
      		this.contiAddMedicie();
      		!this.isAddMed;
      	}
		this.isAddMed = false;
		this.isAddFirst = true;
      },
      //确认保存大类信息
      comfirmAddFir() {
      	this.handleAdd(this.nodes.s,this.nodes.d,this.nodes.n)
      	this.isAddFirst = false;
      },
      //增加root节点
      handleAddTop(){
        this.setTree.push({
          id: ++this.maxexpandId,
          name: this.addForm.drugName,
//        pid: '',
          isEdit: false,
          children: []
        })
      },
      handleAdd(s,d,n){//增加节点
        console.log(s,d,n)
        if(n.level >=3){
          this.$message.error("最多只支持2级！")
          return false;
        }
        //添加数据
        d.children.push({
          id: ++this.maxexpandId,
          name: '新增类型',
//        pid: d.id,
          isEdit: false,
          children: []
        });
        //展开节点
        if(!n.expanded){
          n.expanded = true;
        }
      },
      handleEdit(s,d,n){//编辑节点
        console.log(s,d,n)
      },
      handleDelete(s,d,n){//删除节点
        console.log(s,d,n)
        let that = this;
        //有子级不删除
        if(d.children && d.children.length !== 0){
          this.$message.error("此节点有子类，不可删除！")
          return false;
        }else{
          //新增节点直接删除，否则要询问是否删除
          let delNode = () => {
            let list = n.parent.data.children || n.parent.data,//节点同级数据
              _index = 99999;//要删除的index
            /*if(!n.parent.data.children){//删除顶级节点，无children
              list = n.parent.data
            }*/
            list.map((c,i) => {
              if(d.id == c.id){
                _index = i;
              }
            })
            let k = list.splice(_index,1);
            //console.log(_index,k)
            this.$message.success("删除成功！")
          }
          let isDel = () => {
            that.$confirm("是否删除此类型？","提示",{
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              delNode()
            }).catch(() => {
              return false;
            })
          }
          //判断是否新增
          d.id > this.non_maxexpandId ? delNode() : isDel()
          
        }
      },
    }
    
  }
</script>

<style>
.expand{
    width: 300px;
    height: auto;
    float: left;
    display: inline;
  	overflow:hidden;
}
.expand>div{
  	height:85%;
  	/*padding-top:20px;*/
  	/*width:50%;*/
  	/*margin:20px auto;*/
  	max-width:400px;
  	overflow-y:auto;
}
.expand>div::-webkit-scrollbar-track{
  	box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  	border-radius:5px;
}
.expand>div::-webkit-scrollbar-thumb{
  	background-color:rgba(50, 65, 87, 0.5);
  	outline:1px solid slategrey;
  	border-radius:5px;
}
.expand>div::-webkit-scrollbar{
  	width:10px;
}
.expand-tree{
  	border:none;
  	/*margin-top:10px;*/
}
.expand-tree .el-tree-node.is-current,
.expand-tree .el-tree-node:hover{
  	overflow:hidden;
}
.expand-tree .is-current>.el-tree-node__content .tree-btn,
.expand-tree .el-tree-node__content:hover .tree-btn{
  	display:inline-block;
}
.expand-tree .is-current>.el-tree-node__content .tree-label{
  	font-weight:600;
  	white-space:normal;
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
    max-height: 600px;
	float: left;
	margin-top: 20px;
	width: 300px;
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
    width: 1260px;
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
	margin-top: 120px;
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
</style>