<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <a class="navbar-brand" href="#">读书随想录</a>
    <ul class="list-inline mb-0" v-if="!user.isLogin">
      <li class="list-inline-item">
        <router-link :to="{path: '/login'}" class="btn btn-outline-light">登录</router-link>
      </li>
      <li class="list-inline-item">
        <router-link :to="{path: '/register'}" class="btn btn-outline-light">注册</router-link>
      </li>
    </ul>
    <div class="list-inline mb-0" v-else>
      <div class="list-inline-item">
        <dropdown :title="`你好，${user.data.nickName}`">
          <dropdown-item><router-link :to="{path: '/create'}" class="dropdown-item">新建文章</router-link></dropdown-item>
          <dropdown-item><router-link :to="{path: '/create_column'}" class="dropdown-item">新建专栏</router-link></dropdown-item>
          <dropdown-item><a class="dropdown-item">编辑资料</a></dropdown-item>
          <dropdown-item @click.stop="logout"><a class="dropdown-item">退出登录</a></dropdown-item>
        </dropdown>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Dropdown from './Dropdown.vue'
import DropdownItem from './DropdownItem.vue'
export interface UserProps {
  isLogin: boolean;
  name?: string;
  _id?: number;
}
export default defineComponent({
  name: 'GlobalHeader',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  components: {
    Dropdown,
    DropdownItem
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const logout = () => {
      console.log(9999)
      store.commit('logout')
      router.replace({ path: '/login' })
    }
    return {
      logout
    }
  }
})
</script>
