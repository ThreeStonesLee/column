
import { createRouter, createWebHashHistory } from 'vue-router'
import store from './store'
import axios from 'axios'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './components/ColumnDetail.vue'
import CreatePost from './components/CreatePost.vue'
import Register from './views/Register.vue'
import CreateColumn from './components/CreateColumn.vue'
import PostDetail from './components/PostDetail.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/column/:id',
    name: 'column',
    component: ColumnDetail
  },
  {
    path: '/create',
    name: 'create',
    component: CreatePost,
    meta: {
      requiredLogin: true
    }
  },
  {
    path: '/create_column',
    name: 'createColumn',
    component: CreateColumn,
    meta: {
      requiredLogin: true
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { redirectAlreadyLogin: true }
  },
  {
    path: '/postDetail/:pid',
    name: 'postDetail',
    component: PostDetail
  }
]
const routerHistory = createWebHashHistory()
const router = createRouter({
  history: routerHistory,
  routes
})

router.beforeEach((to, from, next) => {
  // 这段逻辑好好理一下
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = token
      store.dispatch('fetchCurrentUser').then(res => {
        if (res.codeText === 'OK') {
          if (redirectAlreadyLogin) {
            next('/')
          } else {
            next()
          }
        } else {
          // 说明token无效，则可以移除
          // localStorage.removeItem('token')
          store.commit('logout')
          next('/login')
        }
      })
    } else {
      if (requiredLogin) {
        next('/login')
      } else {
        next()
      }
    }
  } else {
    if (!redirectAlreadyLogin) {
      next()
    } else {
      next('/')
    }
  }
  // if (to.meta.requiredLogin && !store.state.user.isLogin) {
  //   next({ name: 'login' })
  // } else if (to.meta.redirectLogin && store.state.user.isLogin) {
  //   // if logined, watch home page
  //   next('/')
  // } else {
  //   next()
  // }
})
export default router
