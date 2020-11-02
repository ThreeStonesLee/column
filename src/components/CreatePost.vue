<template>
  <div class="create-post-page">
    <upload
      action="/file/upload"
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
        <button class="btn  btn-danger">发表</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { PostProps } from '../testData'
import ValidateInput, { PropRules } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import Upload from '../components/Upload.vue'
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
      { type: 'required', message: '文章标题不能为空！' }
    ]
    const contentRules: PropRules = [
      { type: 'required', message: '文章内容不能为空！' }
    ]
    const titleRef = ref('')
    const contentRef = ref('')
    const onFormSubmit = (res: boolean) => {
      if (res) {
        const { columnId } = store.state.user
        if (columnId) {
          const newPost: PostProps = {
            id: new Date().getTime(),
            title: titleRef.value,
            content: contentRef.value,
            columnId,
            createdAt: new Date().toLocaleString()
          }
          store.commit('addNewPost', newPost)
          router.push({ name: 'column', params: { id: columnId } })
        }
      }
    }

    return {
      titleRules,
      contentRules,
      titleRef,
      contentRef,
      onFormSubmit
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
