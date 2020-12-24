<template>
  <el-dialog title="分配角色" :visible.sync="dialogVisible" width="30%">
    <el-select
      width="100%"
      v-model="roleIdList"
      multiple
      placeholder="请选择"
    >
      <el-option
        v-for="item in roles"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllRole, getUserRole, allocateUserRoles } from '@/services/role'

export default Vue.extend({
  name: 'add_user',
  data () {
    return {
      dialogVisible: false,
      roleIdList: [],
      roles: [],
      userId: null
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      const { data } = await getAllRole()
      this.roles = data
    },
    async edit (id: number) {
      this.userId = id as never
      const { data } = await getUserRole(id)
      this.dialogVisible = true
      this.roleIdList = data.map((m: any) => m.id)
    },
    cancle () {
      this.dialogVisible = false
    },
    async sure () {
      try {
        this.dialogVisible = false
        const { code, mesg } = await allocateUserRoles({
          userId: this.userId as never,
          roleIdList: this.roleIdList
        })
        if (code === '000000') {
          this.$message.success(mesg)
          this.$emit('onSearch')
        } else {
          this.$message.error(mesg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
})
</script>

<style scoped>

</style>
