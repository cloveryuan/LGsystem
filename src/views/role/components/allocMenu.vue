<template>
  <el-card>
    <el-tree
      ref="tree"
      :data="treeData"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="checkedKeys"
      :props="defaultProps">
    </el-tree>
   <div style="margin-top:20px;text-align:right;">
    <el-button @click="save"  type="primary">保存</el-button>
    <el-button  @click="clear" type="text">清空</el-button>
    <el-button  @click="$router.back()" type="text">返回</el-button>
   </div>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/role'
import { Tree } from 'element-ui'

export default Vue.extend({
  name: 'allocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      treeData: [],
      menuIdList: [],
      checkedKeys: []
    }
  },
  // computed: {
  //   roleId () {
  //     return Number(this.$route.query.roleId)
  //   }
  // },
  mounted () {
    this.getTreeData()
    this.getRoleMenus()
  },
  components: {

  },
  methods: {
    async getTreeData () {
      try {
        const { data } = await getMenuNodeList()
        this.treeData = data
      } catch (err) {
        this.$message.error('获取所有权限菜单出错了')
      }
    },
    getRoleMenus () {
      // const checkedKeys: {id: number;name: string}[] = []
      this.checkedKeys = []
      getRoleMenus(this.roleId).then(res => {
        const tempArr = res.data
        this.getChecked(tempArr)
        // (this.$refs.tree as Tree).setCheckedNodes(this.checkedKeys)
      }).catch(() => {
        this.$message.error('获取已有权限菜单出错了')
      })
    },
    getChecked (arr: []) {
      interface Menu {
        selected: boolean
        subMenuList: []
        id: number
        name: string
      }
      arr.forEach((f: Menu) => {
        if (!f.selected) return false
        if (f.subMenuList && f.subMenuList.length > 0) {
          this.getChecked(f.subMenuList)
        } else {
          // this.checkedKeys.push(f.id as never)
          this.checkedKeys = [...this.checkedKeys, f.id] as []
        }
      })
    },
    async save () {
      this.menuIdList = (this.$refs.tree as Tree).getCheckedKeys() as []
      const params = {
        roleId: this.roleId,
        menuIdList: this.menuIdList
      }
      const { code } = await allocateRoleMenus(params)
      if (code === '000000') {
        this.$message.success('分配权限成功')
        this.$router.push({ name: 'role' })
      }
    },
    clear () {
      this.menuIdList = [] as any
      this.checkedKeys = [] as any
      (this.$refs.tree as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style scoped>

</style>
