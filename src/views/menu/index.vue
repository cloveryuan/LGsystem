<template>
  <div class="menupage">
    <el-button class="createbtn" size="small"  @click="$router.push({name: 'menu-create'})">添加菜单</el-button>
    <el-table
      ref="singleTable"
      :data="tableData.slice((page.currentPage-1)*page.pageSize,page.currentPage*page.pageSize)"
      highlight-current-row
      style="width: 100%"
      border
      v-loading="tableLoading"
      >
      <el-table-column type="index" label="编号" align="center" width="80"></el-table-column>
      <el-table-column prop="name" label="菜单名称" align="center"></el-table-column>
      <el-table-column prop="level" label="菜单级数" align="center"></el-table-column>
      <el-table-column prop="icon" label="前端图标" align="center"></el-table-column>
      <el-table-column prop="orderNum" label="排序" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.id)" size="small" type="text">编辑</el-button>
          <el-button size="small" @click="handleDelete(scope.row.id)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page"
      v-if="page.total>10"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="page.pageSizes"
      :page-size="page.pageSize"
      :layout="page.layout"
      :total="page.total">
    </el-pagination>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenus, deleteMenu } from '@/services/menu'

export default Vue.extend({
  name: 'MenuIndex',
  data () {
    return {
      tableData: [],
      page: {
        total: 0,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        layout: 'total, sizes, prev, pager, next, jumper',
        currentPage: 1
      },
      tableLoading: false
    }
  },
  created () {
    this.getAllMenus()
  },
  methods: {
    async getAllMenus () {
      this.tableLoading = true
      const { data } = await getAllMenus()
      this.tableData = data
      this.page.total = data.length
      this.tableLoading = false
    },
    handleClick (id: string) {
      this.$router.push({
        name: 'menu-create',
        params: {
          id
        }
      })
    },
    handleDelete (id: number) {
      this.$confirm('确认删除？', '删除提示', {}).then(async () => {
        const { code } = await deleteMenu(id)
        if (code === '000000') {
          this.$message.success('删除成功')
          this.getAllMenus()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleSizeChange (val: number) {
      this.page.pageSize = val
    },
    handleCurrentChange (val: number) {
      this.page.currentPage = val
    }
  }
})
</script>

<style lang="scss">
.menupage{
  background:#fff;
  overflow: hidden;
  .el-button:hover, .el-button:focus{
    background:#fff;
    color:#ffd04b
  }
  .createbtn{
    color: #606266;
    margin:10px;
  }
  .el-button--text{
    padding:4px;
  }
  .page{
    margin:15px;
    float: right;
  }
}
</style>
