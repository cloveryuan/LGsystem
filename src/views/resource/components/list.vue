<template>
  <el-card id="resourceList">
    <div slot="header">
      <el-form ref="form" :inline="true" :model="queryParam" class="demo-form-inline">
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="queryParam.name" placeholder="资源名称" clearable @clear="getTableData"></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="queryParam.url" placeholder="资源路径" clearable @clear="getTableData"></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="queryParam.categoryId" placeholder="资源分类" clearable @clear="getTableData">
            <el-option :key="item.id" :label="item.name" :value="item.categoryId" v-for="item in categoryList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch" :disabled="tableLoading">查询</el-button>
          <el-button  @click="resetForm"  :disabled="tableLoading">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button class="createbtn" size="small"  @click="showAddModal">添加</el-button>
    <el-button class="createbtn" size="small"  @click="$router.push({name: 'resourceCategory'})">资源分类</el-button>
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      border
      v-loading="tableLoading"
      >
      <el-table-column prop="id" label="编号" align="center" width="80"></el-table-column>
      <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
      <el-table-column prop="url" label="资源路径" align="center"></el-table-column>
      <el-table-column prop="description" label="描述" align="center"></el-table-column>
      <el-table-column prop="createdTime" label="添加时间" align="center">
        <span slot-scope="scope">{{ scope.createdTime | date}}</span>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="showEditModal(scope.row)" size="small" type="text">编辑</el-button>
          <el-button size="small" @click="handleDelete(scope.row.id)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
     :disabled="tableLoading"
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
    <add-modal ref="modalForm" :categoryList="categoryList" @onSearch="onSearch"></add-modal>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAll } from '@/services/resource'
import request from '@/utils/request'
import { Form } from 'element-ui'
import dayjs from 'dayjs'
import AddModal from './add.vue'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      categoryList: [],
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {},
      /* 数据源 */
      tableData: [],
      /* 分页参数 */
      page: {
        total: 0,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        layout: 'total, sizes, prev, pager, next, jumper',
        currentPage: 1
      },
      tableLoading: false,
      url: {
        list: '',
        delete: ''
      },
      pageInfo: {
        current: 'current',
        size: 'size'
      }
    }
  },
  components: {
    AddModal
  },
  created () {
    this.getAll()
    this.init()
  },
  mounted () {
    this.getTableData()
  },
  filters: {
    date: (value: string, format = 'YYYY-MM-DD HH:mm') => {
      return dayjs(value).format(format)
    }
  },
  methods: {
    init () {
      this.url.list = '/boss/resource/getResourcePages'
      this.url.delete = '/boss/resource'
      this.queryParam = {
        name: '',
        url: '',
        categoryId: ''
      }
    },
    async getAll () {
      try {
        const { data } = await getAll()
        this.categoryList = data
      } catch (err) {
        this.$message.error('获取资源分类出错了')
      }
    },
    // mixin
    async getTableData () {
      try {
        this.tableLoading = true
        const params = {
          ...this.queryParam,
          [this.pageInfo.current]: this.page.currentPage,
          [this.pageInfo.size]: this.page.pageSize
        }
        if (!this.url.list) {
          this.$message.error('请设置url.list属性!')
          return
        }

        const { data } = await request.post(this.url.list, params)
        this.tableData = data.records
        this.page.total = data.total
        this.tableLoading = false
      } catch (err) {
        this.$message.error('获取列表出错了')
      }
    },
    resetForm () {
      (this.$refs.form as Form).resetFields()
      this.page.currentPage = 1
      this.getTableData()
    },
    onSearch () {
      this.page.currentPage = 1
      this.getTableData()
    },
    handleEdit (id: string, name: string) {
      this.$router.push({
        name: name,
        params: {
          id
        }
      })
    },
    handleDelete (id: number) {
      this.$confirm('确认删除？', '删除提示', {}).then(async () => {
        if (!this.url.delete) {
          this.$message.error('请设置url.delete!')
          return
        }
        const { code } = await request.delete(`${this.url.delete}/${id}`)
        if (code === '000000') {
          this.$message.success('删除成功')
          this.getTableData()
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    handleSizeChange (val: number) {
      this.page.pageSize = val
      this.page.currentPage = 1
      this.getTableData()
    },
    handleCurrentChange (val: number) {
      this.page.currentPage = val
      this.getTableData()
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
