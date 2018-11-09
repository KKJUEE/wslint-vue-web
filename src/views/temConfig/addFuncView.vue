<template>
	<!--新增界面-->
	<section>
		<el-dialog title="新增方法" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="方法名称：" prop="paramDes">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="方法类型：">
					<el-switch v-model="addForm.delivery"></el-switch>
				</el-form-item>
				<el-form-item label="行属性">
					<el-checkbox-group v-model="addForm.code">
				        <el-checkbox v-for="(v,i) in functionObj.funcCode.columns" :prop="v.code" :label="v.value" name="type"></el-checkbox>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="列属性">
					<el-checkbox-group v-model="addForm.subselect">
				        <el-checkbox v-for="(v,i) in functionObj.funcSelect.columns" :prop="v.code" :label="v.value" name="type"></el-checkbox>
				    </el-checkbox-group>
				</el-form-item>
				<el-form-item label="关联表属性">
					<el-checkbox-group v-model="addForm.relation">
				        <el-checkbox v-for="(v,i) in functionObj.funcRelation.columns" :prop="v.code" :label="v.value" name="type"></el-checkbox>
				    </el-checkbox-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button @click.native="addFormVisible = false">重置</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				//新增界面数据
				addForm: {
					name: '',
					delivery: false,
					code: [],
					subselect: [],
					relation: []
				},
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
				addFormRules: {
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
				}
			}
		},
		methods: {
		},
		mounted() {

		}
	}
</script>

<style>

</style>