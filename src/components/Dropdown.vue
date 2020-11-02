<template>
  <div class="dropdown" ref="dropdownRef">
    <a class="btn btn-outline-light dropdown-toggle" href="#" @click.prevent="toggleOpen">
      {{title}}
    </a>
    <ul class="dropdown-menu" :style="{display: 'block'}" v-if="isOpen">
      <slot></slot>
    </ul>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import useClickOutside from '../hooks/useClickOutseide'
export default defineComponent({
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    // 由于setup中获取不到this，所以需要声明一个ref变量，并返回出去
    const dropdownRef = ref<null | HTMLElement>(null) // ref可以传入泛型，定义变量类型，
    const isOpen = ref(false)
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }

    const isClickOutside = useClickOutside(dropdownRef)
    // 在setup中只会执行一次，更新时，无法改变
    // if (isOpen.value && isClickOutside.value) {
    //   isOpen.value = false
    // }
    watch(isClickOutside, () => {
      if (isOpen.value && isClickOutside.value) {
        isOpen.value = false
      }
    })
    return {
      isOpen,
      toggleOpen,
      dropdownRef
    }
  }
})
</script>
