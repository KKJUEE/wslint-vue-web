<!--
	作者：wsl_rzg
	时间：2018-10-17
	描述：树形组件封装，增删改功能
-->
<template>
	<span class="tree-expand">
		<span class="tree-label" v-show="DATA.isEdit">
			<el-input class="edit" size="mini" autofocus
			v-model="DATA.name"
			:ref="'treeInput'+DATA.id"
			@click.stop.native="nodeEditFocus"
			@blur.stop="nodeEditPass(STORE,DATA,NODE)"
			@keyup.enter.stop.native="nodeEditPass(STORE,DATA,NODE)"></el-input>
		</span>
		<span v-show="!DATA.isEdit" @click.native="getMes"
		:class="[DATA.id > maxexpandId ? 'tree-new tree-label' : 'tree-label']">
			<span>{{DATA.name}}</span>
		</span>
		<span class="tree-btn" >
			<i class="el-icon-plus" v-if="NODE.level <= 2" @click.stop="nodeAdd(STORE,DATA,NODE)"></i>
			<i class="el-icon-setting" v-if="NODE.level == 3" @click.stop="nodeAddForm(STORE,DATA,NODE)"></i>
			<i class="el-icon-edit" @click.stop="nodeEdit(STORE,DATA,NODE)"></i>
			<i class="el-icon-upload" v-if="NODE.level == 3" @click.stop="uploadTem(STORE,DATA,NODE)"></i>
			<!--<i class="el-icon-delete" @click.stop="nodeDel(STORE,DATA,NODE)"></i>-->
		</span>
	</span>
</template>

<script>
	export default{
		name: 'treeExpand',
		props: ['NODE', 'DATA', 'STORE', 'maxexpandId'],
		methods: {
			nodeAdd(s,d,n){//新增
				this.$emit('nodeAdd',s,d,n)
			},
			//小类/实验方法增加方法配置
			nodeAddForm(s,d,n){
				this.$emit('nodeAddForm',s,d,n)
			},
			nodeEdit(s,d,n){//编辑
				d.isEdit = true;
				this.$nextTick(() => {
					this.$refs['treeInput'+d.id].$refs.input.focus()
				})
				this.$emit('nodeEdit',s,d,n)
			},
			uploadTem(s,d,n){//上传模板
				this.$emit('uploadTem',s,d,n)
			},
			getMes() {
				console.log("ads")
			},
			nodeDel(s,d,n){//删除
				this.$emit('nodeDel',s,d,n)
			},
			nodeEditPass(s,d,n){	//编辑完成
				let _this = this;
				//判断level来处理下发
				if(n.level === 1) {		//修改药品
					let obj = {
						id: n.data.id,
						name: n.data.name
					};
					//判断是否选择了节点，如果d.children == undefined,则用同level下的最后一项数据
					_this.$post('/config/document/medicine/update', obj).then(res => {
						//是否成功返回，判断
						_this.$message({
							showClose: true,
							message: '已完成药品名称修改',
							type: 'success'
						});
						d.isEdit = false;
						return resolve(res.data)
					}).catch(() => {});
				} else if(n.level === 2) {
					let obj = {
						id: n.data.id,
						name: n.data.name,
						medicineId: n.parent.data.id
					};
					//判断是否选择了节点，如果d.children == undefined,则用同level下的最后一项数据
					_this.$post('/config/document/firstclass/update', obj).then(res => {
						//是否成功返回，判断
						_this.$message({
							showClose: true,
							message: '已完成类别名称修改',
							type: 'success'
						});
						d.isEdit = false;
						return resolve(res.data)
					}).catch(() => {});
				} else if(n.level === 3) {
					let obj = {
						id: n.data.id,
						name: n.data.name,
						medicineId: n.parent.parent.data.id,
						firstClassId: n.parent.data.id,
					};
					//判断是否选择了节点，如果d.children == undefined,则用同level下的最后一项数据
					_this.$post('/config/document/secondclass/update', obj).then(res => {
						//是否成功返回，判断
						_this.$message({
							showClose: true,
							message: '已完成鉴定方法名称修改',
							type: 'success'
						});
						d.isEdit = false;
						return resolve(res.data)
					}).catch(() => {});
				}
			},
			nodeEditFocus(){
				//阻止点击节点的事件冒泡
			},
		}
	}
</script>

<style>
	.tree-expand{
		overflow:hidden;
		font-size: 12px;
	}
	.tree-expand .tree-label{
		font-size:0.9em;
	}
	.tree-expand .tree-label .edit{
		width:50%;
	}
	.tree-expand .tree-btn{
		display:none;
		margin-left:10px;
	}
	.tree-expand .tree-btn i{
		color:#8492a6;
		font-size:0.9em;
		margin-right:3px;
	}
	.el-tree-node__content {
		height: 35px;
	}
</style>