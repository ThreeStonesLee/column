<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
        <p class="text-muted">创建时间：{{column.createAt}}</p>
      </div>
    </div>
    <post-list :list="postList"></post-list>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
// import { testData, testPost } from '../testData'
import PostList from './PostList.vue'
export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const route = useRoute()
    const store = useStore()
    const columnId = +route.params.id
    console.log(route.params)
    onMounted(() => {
      store.dispatch('fetchColumn', columnId)
      store.dispatch('fetchPostList', columnId)
    })
    const column = computed(() => store.getters.getColumn(columnId))
    const postList = computed(() => store.state.posts)
    console.log(column)
    console.log(postList)
    return {
      column,
      postList
    }
  }
})
</script>
