<template>
  <el-card class="create_menu">
    <div slot="header">
      <span>{{menuId?'编辑菜单':'添加菜单'}}</span>
      <el-button type="text" style="float:right" @click="$router.back()">返回</el-button>
    </div>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径" prop="href">
        <el-input v-model="form.href"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentId">
        <el-select v-model="form.parentId" placeholder="请选择">
          <el-option label="无上级菜单" value="-1"></el-option>
          <el-option
            v-for="item in parentMenuList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.description">
        </el-input>
      </el-form-item>
      <el-form-item label="前端图标" prop="icon">
        <el-input v-model="form.icon"></el-input>
      </el-form-item>
      <el-form-item label="是否显示" prop="shown">
        <el-radio-group v-model="form.shown">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input-number v-model="form.orderNum" :min="1"  label="请排序"></el-input-number>
      </el-form-item>
      <el-form-item style="text-align:right">
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">提交</el-button>
        <el-button v-if="!menuId" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { getEditMenuInfo, createOrUpdate } from '@/services/menu'
import { Form } from 'element-ui'
export default Vue.extend({
  name: 'menuCreate',
  data () {
    return {
      form: {
        parentId: '-1',
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: false
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 3, max: 20, message: '菜单名称长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        href: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        parentId: [{ required: true, message: '请选择菜单父级', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入菜单图标', trigger: 'blur' }],
        shown: [{ required: true, message: '请选择菜单是否显示', trigger: 'blur' }],
        orderNum: [{ required: true, message: '请排序', trigger: 'blur' }],
        description: [{ required: true, message: '请输入菜单描述', trigger: 'blur' }]
      },
      parentMenuList: [],
      submitLoading: false
    }
  },
  computed: {
    menuId () {
      const id = this.$route.params.id
      return id || null
    }
  },
  created () {
    this.getEditMenuInfo()
  },
  methods: {
    async getEditMenuInfo () {
      const { data, code } = await getEditMenuInfo(this.$route.params.id || -1)
      if (code === '000000') {
        this.parentMenuList = data.parentMenuList
      }
      if (data.menuInfo) {
        this.form = data.menuInfo
        this.form.parentId = String(this.form.parentId)
      }
    },
    async onSubmit () {
      try {
        this.submitLoading = true
        await (this.$refs.form as Form).validate()
        const { code } = await createOrUpdate(this.form)
        if (code === '000000') {
          this.$router.back()
          this.$message.success('提交成功')
        }
        this.submitLoading = false
      } catch (err) {
        this.$message.error('提交失败')
        this.submitLoading = false
      }
    },
    resetForm () {
      (this.$refs.form as Form).resetFields()
    }
  }
})
</script>

<style lang="scss">
</style>
