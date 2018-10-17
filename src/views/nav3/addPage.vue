<template>
	<div id="add-app-container">
		<!--
        	作者：offline
        	时间：2018-10-16
        	描述：展示增加药品信息，包括名称和工厂信息
        -->
		<!--  label属性      -->
		<div class="label-title">
			<span class="label-title-span">添加药品</span>
			<div>
				<el-button type="primary" @click="addMedicies">继续添加</el-button>
				<el-button type="primary">完成</el-button>
				<el-button type="primary">添加类型</el-button>
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
		<!--
        	作者：offline
        	时间：2018-10-16
        	描述：展示增加类型（大类信息）
        -->
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
		</div>
        <!--
        	作者：offline
        	时间：2018-10-16
        	描述：添加小类并导入模板
        -->
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
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
	data() {
		return {
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
			}
		}
	},
	computed: {
	    ...mapState({
	        messages: state => state.messages
	    })
    },
	methods: {
      	handleRemove(file, fileList) {
        	console.log(file, fileList);
      	},
      	handlePictureCardPreview(file) {
        	this.dialogImageUrl = file.url;
        	this.dialogVisible = true;
      	},
      	addMedicies() {
      		console.log(this.$store.getters.getMessage)
      		console.log( this.newMessage({
		        text: 'test'
		      }))
      	},
      	...mapActions(['newMessage'])
    }
};
</script>

<style lang="scss" scoped>
	#add-app-container {
		bottom: 20px;
		top: 20px;
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