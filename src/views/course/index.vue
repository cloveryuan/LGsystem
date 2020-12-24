<template>
  <div class="course">
    <list></list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import List from './components/list.vue'

export default Vue.extend({
  name: 'CourseIndex',
  components: {
    List
  }
})
</script>

<style lang="scss" scoped></style>
