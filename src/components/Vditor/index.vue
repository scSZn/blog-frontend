<template>
  <div :id="bind_id" />
</template>

<script>
import Vditor from 'vditor'
import 'vditor/dist/index.css'

export default {
  name: 'Vditor',
  props: {
    bind_id: {
      type: String,
      default: 'vditor'
    }
  },
  data() {
    return {
      contentEditor: ''
    }
  },
  mounted() {
    this.contentEditor = new Vditor(this.bind_id, {
      minHeight: window.innerHeight,
      width: window.innerWidth * 0.9
    })
  }
}
</script>

<style scoped>

</style>
