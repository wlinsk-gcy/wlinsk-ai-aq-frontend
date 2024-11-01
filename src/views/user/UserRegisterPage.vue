<script setup lang="ts">
import { ref } from 'vue'
import { register } from '@/api/controller/user/userController'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import type { UserRegisterReqDTO } from '@/api/models/user/user/UserRegisterReqDTO'

const router = useRouter()

const form = ref<UserRegisterReqDTO>({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
})
const handleSubmit = async (errors: any) => {
  if (errors.errors){
    return
  }
  try {
    await register(form.value)
    form.value = {
      userAccount: '',
      userPassword: '',
      checkPassword: ''
    }
    Message.success('注册成功')
    router.push({
      path: '/user/login'
    })
  } catch (e: any) {
    Message.error(e)
  }
}
const userAccountRegex = /^\w{3,20}$/
const userPasswordRegex = /^[a-zA-Z]\w{7,15}$/
const rules = {
  userAccount: [
    {
      validator: (value: any,cb: any) => {
        if (!value){
          cb('请输入用户名')
        }
        if (!userAccountRegex.test(value)){
          cb('请输入正确的用户名')
        }
      }
    }
  ],
  userPassword: [
    {
      validator: (value: any,cb: any) => {
        if (!value){
          cb('请输入密码')
        }
        if (!userPasswordRegex.test(value)){
          cb('请输入正确的密码')
        }
      }
    }
  ],
  checkPassword: [
    {
      validator: (value: any,cb: any) => {
        if (!value){
          cb('请输入确认密码')
        }
        if (value !== form.value.userPassword){
          cb('请输入正确的密码')
        }
      }
    }
  ]
}
</script>

<template>
  <p class="h2">用户注册</p>
  <a-form
    :rules="rules"
    :model="form"
    :style="{ width: '480px', margin: '0 auto' }"
    label-align="left"
    auto-label-width
    @submit="handleSubmit"
  >
    <a-form-item field="userAccount" tooltip="长度在3-20之间，只能包含字母、数字和下划线" label="用户名" validate-trigger="blur">
      <a-input v-model="form.userAccount" placeholder="请输入用户名" />
    </a-form-item>
    <a-form-item field="userPassword" tooltip="以字母开头，长度在8-16之间，只能包含字母、数字和下划线" label="密码" validate-trigger="blur">
      <a-input-password v-model="form.userPassword" placeholder="请输入密码" />
    </a-form-item>
    <a-form-item field="checkPassword"  label="确认密码" validate-trigger="blur">
      <a-input-password v-model="form.checkPassword" placeholder="请输入确认密码" />
    </a-form-item>
    <a-form-item>
      <div style="display: flex; width: 100%; justify-content: space-between;">
        <a-button html-type="submit" style="width: 100px">注册</a-button>
        <!--<a-link href="/user/login">老用户登录</a-link>-->
        <a-link href="#" @click="router.push('/user/login')">老用户登录</a-link>
      </div>
    </a-form-item>
  </a-form>
</template>

<style scoped lang="scss">
.h2 {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  unicode-bidi: isolate;
  margin-bottom: 16px;
}
</style>
