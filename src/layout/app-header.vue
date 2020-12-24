<template>
  <div id="clover_header">
      <div class="_l">
        <i :class="collapsed?'el-icon-s-unfold':'el-icon-s-fold'" class="fold" @click="toggle"></i>
        <el-breadcrumb separator="/" class="bread">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item><a href="javascript:;">{{newRoute}}</a></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-dropdown class="_r">
        <span class="el-dropdown-link">
          <el-avatar :size="30" :src="userInfo.portrait || circleUrl"></el-avatar>
          <i class="el-icon-arrow-down el-icon--right" style="color:#fff;"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>{{userInfo.userName}}</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
  </div>
</template>

<script>
import Vue from 'vue'
import { getInfo } from '@/services/user'
export default Vue.extend({
  name: 'app_header',
  props: {
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  watch: {
    $route: {
      handler (newRoute) {
        this.newRoute = newRoute.meta.title
      }
    }
  },
  data () {
    return {
      circleUrl: require('../assets/default-avatar.png'),
      userInfo: {},
      newRoute: this.$route.meta.title
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    toggle () {
      this.$emit('toggle')
    },
    async getInfo () {
      const { content } = await getInfo()
      this.userInfo = content
    },
    logout () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认执行
        // 清除登录状态
        this.$store.commit('SET_USER', null)// 此时清空了容器中的数据，也清空了本地存储
        // 跳转到登录页
        this.$router.push({
          name: 'login'
        })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
})
</script>

<style  lang="scss">
#clover_header{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ._l{
    height: 100%;
    display: flex;
    align-items: center;
    .fold{
      font-size:26px;
      color:#fff;
      cursor:pointer;
    }
    .bread{
      margin-left:20px;
      .el-breadcrumb__item .el-breadcrumb__inner{
        color:#fff;
      }
      .el-breadcrumb__inner a{
        color:#fff;
      }
      .el-breadcrumb__inner.is-link{
        color:#fff;
      }
      .el-breadcrumb__inner.is-link:hover, .el-breadcrumb__inner a:hover {
        color: rgb(255, 208, 75);
        cursor: pointer;
      }
    }
  }
  ._r{
    .el-dropdown-link{
      display: flex;
      align-items: center;
    }

  }
}
</style>
