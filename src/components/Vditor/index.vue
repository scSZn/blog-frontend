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
      toolbarConfig: {
        pin: true
      },
      cache: {
        enable: false
      },
      after: () => {
        this.contentEditor.setValue('')
      }
    })
  }
}
</script>

<style scoped>

</style>
