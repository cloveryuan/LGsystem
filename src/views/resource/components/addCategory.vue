<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" >
    <el-form :model="addForm" :label-width="formLabelWidth">
      <el-form-item label="名称" >
        <el-input v-model="addForm.name" ></el-input>
      </el-form-item>
      <el-form-item label="排序" >
        <el-input-number v-model="addForm.sort"  :min="0"></el-input-number>
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
import { saveOrderUpdate } from '@/services/resource'

export default Vue.extend({
  name: 'add_resourceCategory',
  data () {
    return {
      title: '添加分类',
      dialogVisible: false,
      formLabelWidth: '100px',
      addForm: {
        id: '',
        name: '',
        sort: 0
      }
    }
  },
  methods: {
    add () {
      this.dialogVisible = true
      this.title = '添加分类'
    },
    edit (row: { id: string; name: string; sort: number }) {
      this.dialogVisible = true
      this.title = '编辑分类'
      this.addForm = row
    },
    cancle () {
      this.dialogVisible = false
      this.addForm = {
        id: '',
        name: '',
        sort: 0
      }
    },
    async sure () {
      this.dialogVisible = false
      const { code, mesg } = await saveOrderUpdate(this.addForm)
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
