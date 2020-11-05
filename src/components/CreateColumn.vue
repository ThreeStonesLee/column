<template>
  <div class="create-post-page">
    <upload
      action="/file/upload"
      :beforeUpload="beforeUpload"
      @file-upload-success="uploadSuccess"
      @file-uplaod-error="uploadError"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
    >
    <h2>点击上传图片</h2>
    <template #loading>
      <div class="d-flex">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <h2>正在上传...</h2>
      </div>
    </template>
    <template #success="slotData">
      <img :src="slotData.fileData.path">
    </template>
    </upload>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">专栏标题</label>
        <validate-input
          v-model="titleRef"
          :rules="titleRules"
          placeholder="请输入专栏标题"
          />
      </div>
      <div class="mb-3">
        <label class="form-label">专栏说明</label>
        <validate-input
          tag="textarea"
          v-model="contentRef"
          :rules="contentRules"
          placeholder="请输入专栏说明"
        />
      </div>
      <template #submit>
        <button class="btn  btn-danger">确定</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Response, ColumnProps, ImageProps } from '../store'
import ValidateInput, { PropRules } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Upload from '../components/Upload.vue'
import createMessage from '../components/createMessage'
import { checkBeforeUpload } from '../ts/helper'
import axios from 'axios'
export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateInput,
    ValidateForm,
    Upload
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const titleRules: PropRules = [
      { type: 'required', message: '专栏标题不能为空！' }
    ]
    const contentRules: PropRules = [
      { type: 'required', message: '专栏说明不能为空！' }
    ]
    const titleRef = ref('')
    const contentRef = ref('')
    let img = reactive({
      filename: '',
      mimeType: '',
      originalName: '',
      path: '',
      size: 0
    })
    const beforeUpload = (file: File) => {
      const result = checkBeforeUpload(file, { format: ['image/png', 'image/jpg'], size: 0.5 })
      if (result.errorInfo === 'format') {
        createMessage('格式不正确，支持png,jpg格式', 'error')
      }
      if (result.errorInfo === 'size') {
        createMessage('图片太大！仅能上传大小为512KB', 'error')
      }
      return result.passed
    }
    const uploadSuccess = (data: Response<ImageProps>) => {
      if (data.data) {
        img = data.data
      }
    }
    const uploadError = (data: Response) => {
      createMessage(JSON.stringify(data), 'error')
    }
    const onFormSubmit = (res: boolean) => {
      if (res) {
        const newColumn: ColumnProps = {
          title: titleRef.value,
          description: contentRef.value,
          image: img
        }
        axios.post('/column/createColumn', newColumn).then(res => {
          const { data } = res
          if (data.codeText === 'OK') {
            createMessage('创建成功！', 'success')
            router.push({ name: 'home' })
          } else {
            createMessage(data.codeText, 'success')
          }
        })
      }
    }

    return {
      titleRules,
      contentRules,
      titleRef,
      contentRef,
      onFormSubmit,
      beforeUpload,
      uploadSuccess,
      uploadError
    }
  }
})
</script>
<style>
.create-post-page .file-upload .file-upload-container {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
