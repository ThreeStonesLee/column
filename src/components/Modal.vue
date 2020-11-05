<template>
  <teleport to="#modal">
    <div class="modal d-block" tabindex="-1" v-if="computedVisible">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{title}}</h5>
            <button type="button" class="btn-close" data-dismiss="modal" @click="onCancel"></button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="onCancel">取消</button>
            <button type="button" class="btn btn-primary" @click="onConfirm">确认</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import useDOMCreate from '../hooks/useDOMCreate'
export default defineComponent({
  props: {
    title: String,
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['modal-close', 'modal-confirm'],
  setup (props, context) {
    useDOMCreate('modal')
    const computedVisible = ref(props.visible)
    watch(() => props.visible, (newVal) => {
      computedVisible.value = newVal
    })
    const onCancel = () => {
      computedVisible.value = false
      context.emit('modal-close', computedVisible.value)
    }
    const onConfirm = () => {
      context.emit('modal-confirm')
    }
    return {
      onCancel,
      onConfirm,
      computedVisible
    }
  }
})
</script>
