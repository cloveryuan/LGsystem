
import Vue from 'vue'
import request from '@/utils/request'
import { Form } from 'element-ui'
import dayjs from 'dayjs'

export default Vue.extend({
  data () {
    return {
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
  mounted () {
    this.getTableData()
  },
  filters: {
    date: (value: string, format = 'YYYY-MM-DD HH:mm') => {
      return dayjs(value).format(format)
    }
  },
  methods: {
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
