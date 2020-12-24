<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" >
    <el-form :model="addForm" :label-width="formLabelWidth">
      <el-form-item label="资源名称" >
        <el-input v-model="addForm.name" ></el-input>
      </el-form-item>
      <el-form-item label="资源路径" >
        <el-input v-model="addForm.url" placeholder="资源路径" clearable ></el-input>
      </el-form-item>
      <el-form-item label="资源分类" >
        <el-select v-model="addForm.categoryId" placeholder="资源分类"  >
          <el-option :key="item.id" :label="item.name" :value="item.categoryId" v-for="item in categoryList"></el-option>
        </el-select>
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
import { saveOrUpdate } from '@/services/resource'

export default Vue.extend({
  name: 'add_resource',
  props: {
    categoryList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      title: '添加资源',
      dialogVisible: false,
      formLabelWidth: '100px',
      addForm: {
        id: '',
        name: '',
        url: '',
        categoryId: '',
        description: ''
      }
    }
  },
  methods: {
    add () {
      this.dialogVisible = true
      this.title = '添加资源'
    },
    edit (row: { id: string; name: string; url: string; categoryId: string; description: string }) {
      this.dialogVisible = true
      this.title = '编辑资源'
      this.addForm = row
    },
    cancle () {
      this.dialogVisible = false
      this.addForm = {
        id: '',
        name: '',
        url: '',
        categoryId: '',
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
