<template>
  <el-container class="layout">
    <el-aside :width="collapsed?'64px':'200px'" class="sidebar">
      <app-aside :collapsed="collapsed"></app-aside>
    </el-aside>
    <el-container>
      <el-header>
        <app-header :collapsed="collapsed" @toggle="toggle"></app-header>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import appAside from './app-aside'
import appHeader from './app-header'
import Vue from 'vue'
export default Vue.extend({
  name: '',
  data () {
    return {
      collapsed: false
    }
  },
  components: {
    appAside, appHeader
  },
  methods: {
    toggle () {
      this.collapsed = !this.collapsed
    }
  }
})
</script>

<style scoped lang="scss">
.el-header {
  background-color:#40586F;
  height: 59px!important;
  line-height: 59px;
  position: sticky;
  top: 0;
  z-index: 100;
}
.sidebar{
  position: sticky;
  top: 0;
  max-height: 100vh;
  background-color: #fff;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
}
</style>
