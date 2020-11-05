/* eslint-disable @typescript-eslint/camelcase */
<template>
  <div class="post-container container">
    <div class="post-img">
      <img :src="postInfo.image && postInfo.image.path" class="rounded mx-auto d-block" style="object-fit: cover;width: 100%; height: 100%;">
    </div>
    <div class="content mt-4">
      <h3>{{ postInfo.title }}</h3>
      <div class="userInfo">
        <div class="row justify-content-between">
          <div class="col-4">
            <div>作者：{{ userInfo.nickName }}</div>
          </div>
          <div class="col-4">
            <div>{{ postInfo.createAt }}</div>
          </div>
        </div>
      </div>
      <div class="post-content px-3">
        {{ postInfo.content }}
      </div>
    </div>
    <div class="btn-group mt-4" v-if="hasEditAuth">
      <button type="button" class="btn btn-primary" @click="editPost">编辑</button>
      <button type="button" class="btn btn-warning" @click="handleModal">删除</button>
    </div>
     <modal
      title="删除文章"
      :visible="modalIsVisible"
      @modal-close="cancel"
      @modal-confirm="deletePost"
     >
      <p>确认删除文章吗？</p>
    </modal>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, ref } from 'vue'
import Modal from '../components/Modal.vue'
import createMessage from '../components/createMessage'
export default defineComponent({
  components: {
    Modal
  },
  setup () {
    const modalIsVisible = ref(false)
    const handleModal = () => {
      modalIsVisible.value = true
    }
    const cancel = (val: boolean) => {
      modalIsVisible.value = val
    }
    return {
      modalIsVisible,
      handleModal,
      cancel
    }
  },
  data () {
    return {
      postInfo: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        user_id: ''
      },
      userInfo: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        user_id: ''
      },
      token: localStorage.getItem('token')
    }
  },
  created () {
    this.getPostInfo()
    if (this.token) {
      this.getCurrentUser()
    }
  },
  computed: {
    hasEditAuth () {
      if (!this.token) {
        return false
      }
      if (this.postInfo.user_id !== this.userInfo.user_id) {
        return false
      }
      return true
    }
  },
  methods: {
    getPostInfo () {
      const pid = this.$route.params.pid
      if (pid) {
        axios.get(`/post/postInfo/${pid}`).then(res => {
          if (res.data.codeText === 'OK') {
            this.postInfo = res.data.data
          }
        })
      }
    },
    getCurrentUser () {
      axios.get('/user/currentUser').then(res => {
        if (res.data.codeText === 'OK') {
          this.userInfo = res.data.data
        }
      })
    },
    editPost () {
      this.$router.push({
        name: 'create',
        query: {
          pid: this.$route.params.pid
        }
      })
    },
    deletePost () {
      const pid = this.$route.params.pid
      if (pid) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        const params = { post_id: pid }
        axios.post('/post/postDelete', params).then(res => {
          console.log(res)
          if (res.data.codeText === 'OK') {
            this.modalIsVisible = false
            createMessage('删除成功！', 'success')
          }
        })
      }
    }
  }
})
</script>

<style scooped>
  .post-img {
    height: 100px;
  }
</style>
