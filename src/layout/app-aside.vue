<template>
<div id="clover_aside">
  <h3 class="logo">
    <img src="../assets/logo.png" alt="">
    <span v-if="!collapsed">Edu Boss</span>
  </h3>
  <el-menu
    router
    default-active="home"
    @open="handleOpen"
    @close="handleClose"
    text-color="rgba(0, 0, 0, 0.65)"
    active-text-color="#ffd04b"
    :collapse="collapsed">
    <el-submenu index="home">
      <template slot="title">
        <i class="el-icon-lock"></i>
        <span>权限管理</span>
      </template>
      <el-menu-item index="/role">角色管理</el-menu-item>
      <el-menu-item index="/menu">菜单管理</el-menu-item>
      <el-menu-item index="/resource">资源管理</el-menu-item>
    </el-submenu>
    <el-menu-item index="/course">
      <i class="el-icon-menu"></i>
      <span slot="title">课程管理</span>
    </el-menu-item>
    <el-menu-item index="/user">
      <i class="el-icon-user"></i>
      <span slot="title">用户管理</span>
    </el-menu-item>
    <el-submenu index="/advert">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span>广告管理</span>
      </template>
      <el-menu-item index="/advert-space">广告位管理</el-menu-item>
    </el-submenu>
  </el-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'app_aside',
  props: {
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {

    }
  },
  methods: {
    handleOpen (key: string, keyPath: string): void {
      console.log(key, keyPath)
    },
    handleClose (key: string, keyPath: string): void{
      console.log(key, keyPath)
    }
  }
})
</script>

<style lang="scss">
#clover_aside{
  .logo{
    display: flex;
    align-items:center;
    justify-content: center;
    height:59px;
    width: 100%;
    background-color: #40586F;
    img{
      width: 32px;
      margin-right: 10px;
    }
    span{
      color:#fff;
    }
  }
  >.el-menu{
    // min-height:100vh;
    background:#fff;
  }
  .el-submenu .el-menu-item{
    padding-left:48px!important;
  }
}
</style>
