<template>
  <div>
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
        <upload
          action="/file/upload"
          :beforeUpload="beforeUpload"
          @file-upload-success="uploadSuccess"
        >
        <template #success="{fileData}">
          <img :src="fileData.path" />
        </template>
        <template #default>
          <h2>上传文件</h2>
        </template>
        </upload>
      </div>
    </section>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import ColumnList from '../components/ColumnList.vue'
import Upload from '../components/Upload.vue'
import createMessage from '../components/createMessage'
import { GlobalDataProps, Response, ImageProps } from '../store'
export default defineComponent({
  name: 'Home',
  components: {
    ColumnList,
    Upload
  },
  setup (props, context) {
    const store = useStore<GlobalDataProps>()
    const list = computed(() => store.state.columns)
    const beforeUpload = (file: File) => {
      if (file.type !== 'image/png') {
        createMessage('请选择格式为PNG的图片', 'error')
        return false
      }
      return true
    }
    const uploadSuccess = (rawData: Response<ImageProps>) => {
      createMessage(rawData.codeText, 'success')
    }
    onMounted(() => {
      store.dispatch('fetchColumnList')
    })
    return {
      list,
      beforeUpload,
      uploadSuccess
    }
  },
  mounted () {
    // console.log(this)
    // console.log(this.foo)
  }
})
</script>
