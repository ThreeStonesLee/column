<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <loader v-if="isLoading" text="拼命加载中"></loader>
    <!-- <message v-if="error.status" :message="error.msg.codeText"></message> -->
    <router-view></router-view>
     <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { computed, defineComponent, onMounted, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import Loader from './components/Loader.vue'
// import Message from './components/Message.vue'
import createMessage from './components/createMessage'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
// const currentUser: UserProps = {
//   isLogin: true,
//   name: 'lisi'
// }

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
    // Message
  },
  setup () {
    const store = useStore()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    // const token = computed(() => store.state.token)
    const error = computed(() => store.state.error)
    // onMounted(() => {
    //   if (!currentUser.value.isLogin && token.value) {
    //     axios.defaults.headers.common.Authorization = token.value
    //     store.dispatch('fetchCurrentUser')
    //   }
    // })
    watch(() => error.value.status, (val) => {
      if (val && error.value.msg) {
        createMessage(error.value.msg.codeText, 'error')
      }
    })
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style>
</style>
