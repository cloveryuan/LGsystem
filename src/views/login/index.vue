<template>
  <div class="login">
    <div class="wrap">
      <h3>Edu Boss 管理</h3>
      <div class="formwrap">
        <h4>登录</h4>
        <el-form ref="form" :model="form" label-width="0px" :rules="rules" >
          <el-form-item label="" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" prefix-icon="el-icon-mobile-phone"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-unlock"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" class="logbtn" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="bottom">
        <el-button  class="logbtn">
          <i class="el-icon-back"></i>
          回到 用户端
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { isMobile } from '@/utils/validate'
import { login } from '@/services/user'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'login',
  data () {
    return {
      form: {
        phone: '15510792995',
        password: '111111'
      },
      fullscreenLoading: false,
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: (rule: object, value: string, callback: (e? : string) => void) => {
              if (isMobile(value)) {
                callback()
              } else {
                callback('请输入正确的手机号码')
              }
            },
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit () {
      try {
        await (this.$refs.form as Form).validate()
        this.fullscreenLoading = true
        const { state, message, content } = await login(this.form)
        this.fullscreenLoading = false
        if (state !== 1) {
          return this.$message.error(message || '登录失败')
        }
        this.$store.commit('SET_USER', content)
        this.$router.push(this.$route.query.redirect as string || '/')
        this.$message.success('登录成功')
      } catch (err) {
        this.$message.error(err || '登录失败')
        this.fullscreenLoading = false
      }
    }
  }
})
</script>

<style scoped lang="scss">
.login{
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  .wrap{
    width: 400px;
    text-align: center;
    h3{
      margin-bottom:60px;
      color:#989EA4;
      font-weight: normal;
      font-size:40px;
      font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
    }
    .formwrap{
      width: 100%;
      background: #fff;
      border-radius: 10px;
      padding:20px 40px;
      box-sizing: border-box;
      h4{
        text-align: left;
      }
    }
    .logbtn{
      width: 100%;
      margin-top:40px;
    }
    .bottom{
      .logbtn{
        background:transparent;
        color:#AEB4B9;
        font-size:12px;
      }
    }
  }
}
</style>
