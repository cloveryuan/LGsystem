<template>
  <div class="resource">
    <List></List>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import List from './components/list.vue'

export default Vue.extend({
  name: 'ResourceIndex',
  components: {
    List
  }
})

</script>

<style lang="scss" scoped></style>
