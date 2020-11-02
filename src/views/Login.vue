<template>
  <div>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          typt="text"
          v-model="inputEmailRef"
          :rules="emailRules"
          placeholder="请输入邮箱"
          />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          v-model="inputPasswordRef"
          :rules="passwordRules"
          placeholder="请输入密码"
        />
      </div>
      <template #submit>
        <button class="btn  btn-danger">submit</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import ValidateInput, { PropRules } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const emailRules: PropRules = [
      { type: 'required', message: '邮箱不能为空！' },
      { type: 'email', message: '邮箱格式不正确！' }
    ]
    const passwordRules: PropRules = [
      { type: 'required', message: '密码不能为空！' }
    ]
    const inputEmailRef = ref('')
    const inputPasswordRef = ref('')
    console.log(route)
    if (route.params.email) {
      inputEmailRef.value = route.params.email + ''
      inputPasswordRef.value = route.params.password + ''
    }
    const onFormSubmit = (res: boolean) => {
      if (res) {
        const params = {
          email: inputEmailRef.value,
          password: inputPasswordRef.value
        }
        store.dispatch('loginAndFetch', params).then(result => {
          if (result.codeText === 'OK') {
            router.push({
              path: '/'
            })
          }
        })
      }
    }

    return {
      emailRules,
      passwordRules,
      inputEmailRef,
      inputPasswordRef,
      onFormSubmit
    }
  }
})
</script>
