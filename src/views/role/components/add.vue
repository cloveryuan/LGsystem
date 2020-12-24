<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" >
    <el-form :model="addForm" :label-width="formLabelWidth">
      <el-form-item label="角色名称" >
        <el-input v-model="addForm.name"  placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" >
        <el-input v-model="addForm.code" placeholder="角色编码" ></el-input>
      </el-form-item>
      <el-form-item label="描述" >
        <el-input v-model="addForm.description" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { saveOrUpdate } from '@/services/role'

export default Vue.extend({
  name: 'add_role',
  props: {
    categoryList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      title: '添加角色',
      dialogVisible: false,
      formLabelWidth: '100px',
      addForm: {
        id: '',
        name: '',
        code: '',
        description: ''
      }
    }
  },
  methods: {
    add () {
      this.dialogVisible = true
      this.title = '添加角色'
    },
    edit (row: { id: string; name: string; code: string; description: string}) {
      this.dialogVisible = true
      this.title = '编辑角色'
      this.addForm = row
    },
    cancle () {
      this.dialogVisible = false
      this.addForm = {
        id: '',
        name: '',
        code: '',
        description: ''
      }
    },
    async sure () {
      this.dialogVisible = false
      const { code, mesg } = await saveOrUpdate(this.addForm)
      if (code === '000000') {
        this.$message.success(mesg)
        this.$emit('onSearch')
      } else {
        this.$message.error(mesg)
      }
    }
  }
})
</script>

<style scoped>

</style>
