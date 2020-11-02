import { createStore, Commit } from 'vuex'
import axios from 'axios'
export interface User {
  isLogin: boolean;
  name?: string;
  id?: number;
  avator?: string;
  columnId?: number;
}

// 这里写interface为了体会ts带来的便利（属性提示）
// data的类型不确定，所以传入泛性
export interface Response<T = {}> {
  code: number;
  codeText: string;
  data?: T;
}

export interface ImageProps {
  _id?: string;
  path?: string;
}
export interface ColumnProps {
  _id: number;
  title: string;
  avatar?: ImageProps;
  description: string;
}

export interface PostProps {
  _id: number;
  title: string;
  content: string;
  image?: ImageProps;
  createdAt: string;
  columnId: number;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}

export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[];
  user: User;
}

const postAndCommit = async (url: string, mutationName: string, commit: Commit, params: any) => {
  const { data } = await axios.post(url, params)
  commit(mutationName, data)
  return data
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    columns: [],
    posts: [],
    user: {
      isLogin: false
    },
    loading: false
  },
  mutations: {
    login (state, rawData) {
      // console.log(rawData)
      if (rawData.codeText === 'OK') {
        const { data } = rawData
        // 如果是token的话，并设置每次请求都带上token的话,如下设置
        axios.defaults.headers.common.Authorization = data.token
        localStorage.setItem('token', data.token)
      }
    },
    fetchCurrentUser (state, rawData) {
      if (rawData.codeText === 'OK') {
        state.user = { isLogin: true, ...rawData }
      }
    },
    addNewPost (state, payload) {
      state.posts.push(payload)
    },
    fetchColumnList (state, payload) {
      state.columns = payload
      // console.log(payload)
    },
    fetchColumn (state, payload) {
      state.columns = [payload]
      // console.log(payload)
    },
    fetchPostList (state, payload) {
      state.posts = payload
      // console.log(payload)
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e) {
      state.error = e
    },
    logout (state) {
      state.token = ''
      state.user = {
        isLogin: false
      }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }

  },
  actions: {
    async fetchColumnList ({ commit }) {
      const { data: { data = [] } } = await axios.get('/column/columnList')
      commit('fetchColumnList', data)
    },
    fetchColumn (context, cid) {
      axios.get(`/column/columnInfo/${cid}`).then(res => {
        // console.log(res)
        if (res.data.codeText === 'OK') {
          context.commit('fetchColumn', res.data.data)
        }
      })
    },
    fetchPostList (context, cid) {
      const params = {
        column: cid
      }
      axios.post('/post/postList', params).then(res => {
        // console.log(res)
        if (res.data.codeText === 'OK') {
          context.commit('fetchPostList', res.data.data)
        }
      })
    },
    login ({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    fetchCurrentUser ({ commit }) {
      return getAndCommit('/user/currentUser', 'fetchCurrentUser', commit)
    },
    // 组合actions写法
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    // 访问getters是使用属性方式访问(state.getters.propName)，如果是调用传入值的话，则需要返回一个函数
    getColumn (state) {
      return (id: number) => state.columns.find(column => column._id === id)
    }
    // getPostList (state) {
    //   return state.posts
    //   // return (pid: number) => state.posts.filter(post => post.columnId === pid)
    // }
  }
})

export default store
