<template>
  <el-card id="categoryList">
    <el-button class="createbtn" size="small"  @click="showAddModal">添加</el-button>
    <el-button  size="small"  @click="$router.back()" style="float:right;">返回</el-button>
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      border
      v-loading="tableLoading"
      >
      <el-table-column prop="id" label="编号" align="center" width="80"></el-table-column>
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
      <el-table-column prop="updatedTime" label="创建时间" align="center">
        <span slot-scope="scope">{{ scope.updatedTime | date}}</span>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="showEditModal(scope.row)" size="small" type="text">编辑</el-button>
          <el-button size="small" @click="handleDelete(scope.row.id)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-modal ref="modalForm"  @onSearch="getTableData"></add-modal>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import AddModal from './addCategory.vue'
import { getCategoryAll, deleteCategory } from '@/services/resource'
import dayjs from 'dayjs'

export default Vue.extend({
  name: 'resourceCategory',
  data () {
    return {
      /* 数据源 */
      tableData: [],
      tableLoading: false
    }
  },
  components: {
    AddModal
  },
  created () {
    this.getTableData()
  },
  filters: {
    date: (value: string, format = 'YYYY-MM-DD HH:mm') => {
      return dayjs(value).format(format)
    }
  },
  methods: {
    async getTableData () {
      this.tableLoading = true
      try {
        const { data } = await getCategoryAll()
        this.tableData = data
        this.tableLoading = false
      } catch (err) {
        this.$message.error('获取资源分类出错了')
      }
    },
    handleDelete (id: number) {
      this.$confirm('确认删除？', '删除提示', {}).then(async () => {
        const { code } = await deleteCategory(id)
        if (code === '000000') {
          this.$message.success('删除成功')
          this.getTableData()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    showAddModal () {
      const el: any = this.$refs.modalForm
      el.add()
    },
    showEditModal (row: object) {
      const el: any = this.$refs.modalForm
      el.edit(row)
    }
  }
})
</script>

<style scoped>

</style>
