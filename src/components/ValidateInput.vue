<template>
  <div class="validate-input-container pb-3">
    <input
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      :value="inputRef.val"
      @blur="validateInput"
      @input="handlerInput"
      v-bind="$attrs"
      v-if="tag === 'input'"
    >
    <textarea
      rows="10"
      class="form-control"
      :class="{'is-invalid': inputRef.error}"
      :value="inputRef.val"
      @blur="validateInput"
      @input="handlerInput"
      v-bind="$attrs"
      v-else
    >
    </textarea>
    <span
      class="invalid-feedback"
      v-if="inputRef.error"
    >{{inputRef.message}}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, onMounted } from 'vue'
import { emitter } from './ValidateForm.vue'
// type还可以扩展其他的，以后可以试试
interface PropRule {
  type: 'required' | 'email' | 'custom';
  message: string;
  validator?: () => boolean; // 这里是规定validator的格式
}
export type PropRules = PropRule[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
  props: {
    rules: Array as PropType<PropRules>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  setup (props, context) {
    const mailReg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })

    const handlerInput = (e: KeyboardEvent) => {
      // 这里是断言，保证了不会因为类型而出错
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }
    const clearInput = () => {
      inputRef.val = ''
    }
    const validateInput = () => {
      if (props.rules) {
        const allpassed = props.rules.every((rule) => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required': passed = (inputRef.val !== '')
              break
            case 'email': passed = mailReg.test(inputRef.val)
              break
            case 'custom': passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allpassed
        return allpassed
      }
      return true
    }
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
      emitter.emit('clear-input', clearInput)
    })

    return {
      inputRef,
      validateInput,
      handlerInput
    }
  }

})
</script>
