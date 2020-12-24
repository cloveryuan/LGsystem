<template>
  <div class="user">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form
          :inline="true"
          ref="form"
          :model="queryParam"
          class="demo-form-inline"
        >
          <el-form-item prop="courseName" label="课程名称">
            <el-input
              v-model="queryParam.courseName"
              placeholder="请输入课程名称"
            ></el-input>
          </el-form-item>
          <el-form-item prop="statys" label="状态">
            <el-select
              v-model="queryParam.status"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch" :disabled="tableLoading">查询</el-button>
            <el-button @click="resetForm" :disabled="tableLoading">重置</el-button>
          </el-form-item>
          <el-button type="primary" icon="el-icon-plus" style="float:right;">新建课程</el-button>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        border
        v-loading="tableLoading"
      >
        <el-table-column prop="id" align="center" label="ID">
        </el-table-column>
        <el-table-column prop="courseName" label="课程名称">
        </el-table-column>
        <el-table-column prop="price" align="center" label="课程价格">
          <template slot-scope="scope">
            <span>￥{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sortNum" align="center" label="排序">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span style="display:inline-block;height:15px;width:15px;border-radius:50%;" :class="scope.row.status+'' === '1' ? 'status-success' : 'status-danger'"></span>
          </template>
        </el-table-column>
        <el-table-column :width="200"  label="操作">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.status===0?'success':'danger'"
              @click="changeState(scope.row.id,scope.row.status)"
              size="small"
              >{{scope.row.status===1?'下架':'上架'}}
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="$router.push({
                name:'course_edit',
                query:{
                  courseId: scope.row.id
                }
              })"
              >编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="$router.push({
                name:'course_section',
                params: {
                  courseId: scope.row.id
                }
              })"
              >内容管理
            </el-button>
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
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
import request from '@/utils/request'
import { Form } from 'element-ui'
import {
  changeState
} from '@/services/course'

export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      form: {
        dateTime: '',
        name: '',
        pageSize: 10, // 每页数量
        currentPage: 1 // 当前页
      },
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
  created () {
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
      this.url.list = '/boss/course/getQueryCourses'
      this.queryParam = {
        courseName: '',
        status: null
      }
      this.pageInfo = {
        current: 'currentPage',
        size: 'pageSize'
      }
    },
    async changeState (id: number, status: number) {
      try {
        const { data } = await changeState(id, status === 1 ? 0 : 1)
        if (data.code === '000000') {
          this.$message.success(data.mesg)
          this.getTableData()
        } else {
          this.$message.error(data.mesg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async handleRole (id: number) {
      const el: any = this.$refs.modalForm
      el.edit(id)
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

<style lang="scss" scoped></style>
