<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

/**
* !ts☞☞ options Api写法 Vue.extend
*/
// import request from '@/utils/request'

export default Vue.extend({
  data () {
    return {
      a: 1
    }
  },
  created () {
    // request('/front/v2/api-docs?group=edu-front-boot').then(res => {
    //   console.log(res)
    // })
  },
  methods: {
  }
})

/**
 * !ts☞☞ class Api 写法Vue.component
 */
// import Component from 'vue-class-component'
// // @Component 修饰符注明了此类为一个 Vue 组件,类的装饰器
// @Component({
//   // 所有的组件选项都可以放在这里
//   template: '<button @click="onClick">Click!</button>'
// })
// export default class MyComponent extends Vue {
//   // 初始数据可以直接声明为实例的 property
//   message = 'Hello!'
//   c = {
//     a: 1,
//     b: '2'
//   }

//   // 组件方法也可以直接声明为实例的方法
//   onClick (): void {
//     window.alert(this.message)
//   }

//   mounted () {
//     console.log('mounted')
//   }
// }

/**
 * ! 不用ts
 */
// export default {
//   data () {
//     return {
//       a: 1
//     }
//   },
//   methods: {
//     test () {
//       this.a = 123
//     }
//   }
// }
</script>
<style lang="scss" scoped>
.suc{
  color:$success-color;
}
#app{
  height:100%;
  width:100%;
}
</style>
