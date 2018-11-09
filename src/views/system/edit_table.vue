<template>
  <my-table
    :data="tableData"
    :col-configs="colConfigs">
    <!-- slot="opt" 不能省略，需要与下面配置项中的对应 -->
    <el-table-column slot="opt">
      <el-button size="mini" slot-scope="{ row }">查看</el-button>
    </el-table-column>
  </my-table>
</template>

<script>
import MyTable from './table'
export default {
  data () {
    this.colConfigs = [
      { prop: 'date', label: '日期' },
      { prop: 'name', label: '姓名' },
      { prop: 'address', label: '地址' },
      // 模版中的元素需要对应的有 slot="opt" 属性
      { slot: 'opt' }
    ]
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }]
    }
  },
  components: {
  	'my-table': MyTable
  }
}
</script>