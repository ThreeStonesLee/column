<template>
  <div class="file-upload">
    <div class="file-upload-container" @click="handleUpload" v-bind="$attrs">
      <slot v-if="fileStatus==='loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus==='success'" name="success" :fileData="fileData">
        <button class="btn btn-primary" disabled>上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">上传文件</button>
      </slot>
    </div>
    <input
      ref="fileRef"
      type="file"
      class="d-none"
      @change="handleFileInput"
    >
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from 'vue'
import axios from 'axios'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type BeforeUploadType = (file: File) => boolean // 定义beforeUpload类型，在传入该属性时更加规范
// 实现清除文件
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: { // 用于用户在上传之前自定义检查文件
      type: Function as PropType<BeforeUploadType>
    },
    uploaded: { // 用户传入的文件数据
      type: Object
    }
  },
  inheritAttrs: false, // 这个属性，可以把添加在子组件上属性，不放在该组件的最外层的元素上，然后使用v-bind="$attrs",把属性放在你想放的元素上
  emits: ['file-upload-success', 'file-upload-error'],
  /**
   * setup函数在整个生命周期里只会执行一次，
   * 不会因为传来的props属性值的改变而改变
   * 所以就需要watch来监控属性
   */
  setup (props, context) {
    const fileRef = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready') // 用户传入文件数据，并改变起状态
    const fileData = ref(props.uploaded)
    // 对于会改变的数据还是需要watch来追踪其改变
    watch(() => props.uploaded, (newVal) => {
      fileStatus.value = 'success'
      fileData.value = newVal
    })
    const handleFileInput = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement // 断言才能使用其中的属性不报错
      if (currentTarget.files) {
        const formData = new FormData()
        const files = Array.from(currentTarget.files)
        if (props.beforeUpload) {
          const beforeUploadResult = props.beforeUpload(files[0])
          if (!beforeUploadResult) {
            return
          }
        }
        fileStatus.value = 'loading'
        formData.append('file', files[0])
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          if (res.data.codeText === 'OK') {
            fileStatus.value = 'success'
            fileData.value = JSON.parse(JSON.stringify(res.data.data))
            context.emit('file-upload-success', res.data)
          } else {
            fileStatus.value = 'error'
            context.emit('file-upload-error', res.data)
          }
        }).finally(() => {
          if (fileRef.value) {
            // 最后需要把input的value值清空
            fileRef.value.value = ''
          }
        })
      }
    }
    const handleUpload = () => {
      console.log(0)
      if (fileRef.value) {
        fileRef.value.click()
      }
    }
    return {
      fileRef,
      fileData,
      handleFileInput,
      handleUpload,
      fileStatus
    }
  }
})
</script>
