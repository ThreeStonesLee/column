<template>
  <div class="create-post-page">
    <h4>{{isEditMode ? '编辑文章' : '新建文章'}}</h4>
    <upload
      action="/file/upload"
      :beforeUpload="beforeUpload"
      @file-upload-success="uploadSuccess"
      @file-uplaod-error="uploadError"
      :uploaded="img"
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
        <label class="form-label">所属专栏</label>
        <select class="form-select" v-model="selectedColumn">
          <option v-for="column in columnList" :key="column.column_id" :value="column.column_id">{{ column.title }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">文章标题</label>
        <validate-input
          v-model="titleRef"
          :rules="titleRules"
          placeholder="请输入文章标题"
          />
      </div>
      <div class="mb-3">
        <label class="form-label">文章内容</label>
        <validate-input
          tag="textarea"
          v-model="contentRef"
          :rules="contentRules"
          placeholder="请输入文章内容"
        />
      </div>
      <template #submit>
        <button class="btn  btn-danger">{{ isEditMode ? '更新' : '发表' }}</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Response, PostProps, ImageProps } from '../store'
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
  data () {
    return {
      columnList: []
    }
  },
  /**
   * reactive生成的对象如何赋值才能有响应式
   */
  setup () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const titleRules: PropRules = [
      { type: 'required', message: '文章标题不能为空！' }
    ]
    const contentRules: PropRules = [
      { type: 'required', message: '文章内容不能为空！' }
    ]
    const titleRef = ref('')
    const contentRef = ref('')
    const selectedColumn = ref()
    const isEditMode = !!route.query.pid
    const img = ref({
      filename: '',
      mimeType: '',
      originalName: '',
      path: '',
      size: 0
    })
    const beforeUpload = (file: File) => {
      const result = checkBeforeUpload(file, { format: ['image/png', 'image/jpg'], size: 10 })
      if (result.errorInfo === 'format') {
        createMessage('格式不正确，支持png,jpg格式', 'error')
      }
      if (result.errorInfo === 'size') {
        createMessage('图片太大！', 'error')
      }
      return result.passed
    }
    const uploadSuccess = (data: Response<ImageProps>) => {
      console.log('success')
      if (data.data) {
        img.value = data.data
      }
    }
    const uploadError = (data: Response) => {
      createMessage(JSON.stringify(data), 'error')
    }
    onMounted(() => { // 为啥要在onMounted中执行？
      if (isEditMode) {
        axios.get(`/post/postInfo/${route.query.pid}`).then(res => {
          if (res.data.codeText === 'OK') {
            const postInfo = res.data.data
            titleRef.value = postInfo.title
            contentRef.value = postInfo.content
            img.value = postInfo.image
            selectedColumn.value = postInfo.column_id
          }
        })
      }
    })
    const onFormSubmit = (res: boolean) => {
      if (res) {
        const newPost: PostProps = {
          title: titleRef.value,
          content: contentRef.value,
          image: img.value,
          // eslint-disable-next-line @typescript-eslint/camelcase
          column_id: selectedColumn.value
        }
        const method = isEditMode ? 'updatePost' : 'addNewPost'
        const params = isEditMode ? {
          // eslint-disable-next-line @typescript-eslint/camelcase
          id: route.query.pid,
          updateData: newPost
        } : newPost
        store.dispatch(method, params).then(res => {
          console.log(res)
          if (res.codeText === 'OK') {
            router.push({ name: 'column', params: { id: selectedColumn.value } })
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
      uploadError,
      selectedColumn,
      img,
      isEditMode
    }
  },
  created () {
    this.getColumnList()
  },
  methods: {
    getColumnList () {
      axios.get('/column/getColumnList').then(res => {
        if (res.data.codeText === 'OK') {
          this.columnList = res.data.data
        }
      })
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
