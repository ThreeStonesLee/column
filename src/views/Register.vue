<template>
  <div>
    <validate-form @form-submit="submit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          type="text"
          v-model="formData.email"
          placeholder="请输入邮箱地址"
          :rules="emailRule"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">昵称</label>
        <validate-input
          type="text"
          v-model="formData.nickName"
          placeholder="请输入昵称"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="text"
          v-model="formData.password"
          placeholder="请输入密码"
          :rules="passwordRule"
        ></validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">重复密码</label>
        <validate-input
          type="text"
          v-model="formData.repeatPassword"
          placeholder="请重复输入密码"
          :rules="repeatPasswordRule"
        ></validate-input>
      </div>
    </validate-form>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { PropRules } from '../components/ValidateInput.vue'
import createMessage from '../components/createMessage'
import axios from 'axios'
import { useRouter } from 'vue-router'
export default defineComponent({
  components: {
    ValidateForm,
    ValidateInput
  },
  setup (props, context) {
    const router = useRouter()
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })

    const emailRule: PropRules = [
      { type: 'required', message: '请输入邮箱地址' }
    ]
    // const nickNameRule: PropRules = [
    //   { type: 'required', message: '请输入昵称' }
    // ]
    const passwordRule: PropRules = [
      { type: 'required', message: '请输入密码' }
    ]
    const repeatPasswordRule: PropRules = [
      { type: 'required', message: '请重复输入密码' },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatPassword
        },
        message: '密码不一致'
      }
    ]

    const submit = async (result: boolean) => {
      if (result) {
        const params = {
          email: formData.email,
          nickName: formData.nickName,
          password: formData.password
        }
        const { data } = await axios.post('/user/register', params)
        if (data.codeText === 'OK') {
          createMessage('注册成功！', 'success')
          router.push({
            name: 'login',
            params: {
              email: formData.email,
              password: formData.password
            }
          })
        }
      }
    }
    return {
      submit,
      formData,
      emailRule,
      passwordRule,
      repeatPasswordRule
    }
  }
})
</script>
