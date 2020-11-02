<template>
  <teleport to="#loader">
    <div
      class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
      :style="{backgroundColor: background}"
    >
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only visually-hidden"> {{ text || 'Loading...' }}</span>
        </div>
        <p v-if="text" class="text-primary small">{{ text }}</p>
      </div>
    </div>
  </teleport>

</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import useDOMCreate from '../hooks/useDOMCreate'

export default defineComponent({
  props: {
    text: {
      type: String,
      default: ''
    },
    background: {
      type: String,
      default: ''
    }
  },
  setup () {
    // setup的执行生命周期，创建该节点，这样在把loader挂载到loader时就有目标节点
    useDOMCreate('loader')
  }
})
</script>
<style scoped>
.loading-container {
  background: rgba(255, 255, 255, .5);
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
}
.loading-container {
  text-align: center;
}
</style>
