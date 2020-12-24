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
          <el-form-item prop="phone" label="手机号">
            <el-input
              v-model="queryParam.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="dateTime" label="注册时间">
            <el-date-picker
              v-model="queryParam.dateTime"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch" :disabled="tableLoading">查询</el-button>
            <el-button @click="resetForm" :disabled="tableLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        border
        v-loading="tableLoading"
      >
        <el-table-column prop="id" align="center" label="用户ID">
        </el-table-column>
        <el-table-column align="center" label="头像">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.portrait ||'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="用户名">
        </el-table-column>
        <el-table-column prop="phone" align="center" label="手机号">
        </el-table-column>
        <el-table-column :width="230" align="center" label="注册时间">
          <template slot-scope="scope">{{scope.row.createTime | date}}</template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span style="display:inline-block;height:15px;width:15px;border-radius:50%;" :class="scope.row.status === 'ENABLE' ? 'status-success' : 'status-danger'"></span>
          </template>
        </el-table-column>
        <el-table-column :width="200"  label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 'ENABLE'"
              type="text"
              @click="handleForbid(scope.row.id)"
              size="small"
              >禁用</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="handleRole(scope.row.id)"
              >分配角色</el-button
            >
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
      <add-modal ref="modalForm"  @onSearch="onSearch"></add-modal>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import request from '@/utils/request'
import { Form } from 'element-ui'
import {
  forbidUser
} from '@/services/role'
import addModal from './add.vue'
import dayjs from 'dayjs'

export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      users: [],
      form: {
        dateTime: '',
        name: '',
        pageSize: 10, // 每页数量
        currentPage: 1 // 当前页
      },
      dialogVisible: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker: any) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
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
  components: { addModal },
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
      this.url.list = '/boss//user/getUserPages'
      this.queryParam = {
        dateTime: '',
        name: ''
      }
      this.pageInfo = {
        current: 'currentPage',
        size: 'pageSize'
      }
    },
    async handleForbid (id: number) {
      try {
        const { data } = await forbidUser(id)
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
