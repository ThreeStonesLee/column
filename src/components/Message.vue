<template>
  <teleport to="#message">
    <div
      class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
      v-if="isVisibility"
     >
      <div class="alert alert-dismissible fade show mx-auto" :class="classObject" role="alert">
        <span>{{ message }}</span>
        <button type="button" class="btn-close" data-dismiss="alert" aria-label="Close" @click.prevent="hide"></button>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch, onUnmounted } from 'vue'
import useDOMCreate from '../hooks/useDOMCreate'
export type MessageType = 'error' | 'success' | 'default'
export default defineComponent({
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String as PropType<MessageType>,
      default: 'default'
    }
  },
  emits: ['close-message'],
  setup (props, context) {
    useDOMCreate('message') // 公共的功能可以提出去写成一下钩子函数
    const isVisibility = ref(true)
    const classObject = {
      'alert-primary': props.type === 'default',
      'alert-danger': props.type === 'error',
      'alert-success': props.type === 'success'
    }
    const hide = () => {
      isVisibility.value = false
      context.emit('close-message', true)
    }
    return {
      isVisibility,
      classObject,
      hide
    }
  }
})
</script>
