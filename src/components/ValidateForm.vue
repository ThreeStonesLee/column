<template>
  <form class="validate-form-container">
    <slot></slot>
    <div class="submit-area" @click.prevent="formSubmit">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>
<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'

type ValidateFunc = () => boolean
export const emitter = mitt()
export default defineComponent({
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: ValidateFunc[] = []
    const formSubmit = () => {
      const result = funcArr.map(func => func()).every(res => res)
      context.emit('form-submit', result)
    }
    const callback = (func?: ValidateFunc) => {
      if (func) {
        funcArr.push(func)
      }
    }
    // 在实例上写一个清除输入框的方法（不会）
    const resetForm = () => {
      console.log()
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      formSubmit,
      resetForm
    }
  }
})
</script>
