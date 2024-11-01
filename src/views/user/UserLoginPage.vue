<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { UserLoginReqDTO } from '@/api/models/user/user/UserLoginReqDTO'
import { login, threePartLogin, threePartLoginCallback } from '@/api/controller/user/userController'
import { Message } from '@arco-design/web-vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter, useRoute } from 'vue-router'
import { ThreePartLoginEnum } from '@/api/models/enums/ThreePartLoginEnum'
const router = useRouter()
const route = useRoute()
const form = ref<UserLoginReqDTO>({
  userAccount: '',
  userPassword: ''
})
const userStore = useUserStore()
const handleSubmit = async (errors: any) => {
  if (errors.errors){
    return
  }
  try {
    await login(form.value)
    form.value.userAccount = ''
    form.value.userPassword = ''
    await userStore.fetchLoginUser()
    Message.success('登录成功')
    router.push({
      path: (route.query?.redirect as string) ?? '/',
      replace: true
    })
  } catch (e: any) {
    Message.error(e)
  }
}
const giteeLogin = async () => {
  try {
    var redirectUrl = await threePartLogin({ loginType: ThreePartLoginEnum.GITEE })
    window.location.href = redirectUrl
  } catch (e: any) {
    Message.error(e)
  }
}
const giteeLoginCallback = async () => {
  const code = route.query?.code??'';
  if (!code || code == ''){
    return
  }
  try{
    await threePartLoginCallback(code as string)
    await userStore.fetchLoginUser()
    Message.success('登录成功')
    router.push({
      path: (route.query?.redirect as string) ?? '/',
      replace: true
    })
  }catch (e: any){
    Message.error(e)
  }
}
watchEffect(() => {
  giteeLoginCallback()
})
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
  ]
}
</script>

<template>
  <p class="h2">用户登录</p>
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
    <a-form-item>
      <div style="display: flex; width: 100%; justify-content: space-between">
        <a-button html-type="submit" style="width: 100px">登录</a-button>
        <!--<a-link href="/user/register">新用户注册</a-link>-->
        <a-link href="#" @click="router.push('/user/register')">新用户注册</a-link>
      </div>
    </a-form-item>
    <a-form-item no-style>
      <a-space size="small" direction="vertical" :style="{marginTop: '20px'}">
        <div class="divider-with-text">其他方式登录</div>
        <a-space size="large">
          <a-avatar :size="32" :style="{ marginRight: '8px', cursor: 'pointer' }">
            <img
              alt="avatar"
              src="@/assets/giteeLogo.jpg"
              @click="giteeLogin"
            />
          </a-avatar>
        </a-space>
      </a-space>
    </a-form-item>
    <a-form-item>

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
// 定义变量以便于维护
$divider-color: #e5e5e5;
$divider-thickness: 1px;
$divider-margin: 10px;
$divider-text-color: #6e6e6e;
$divider-text-font-size: 14px;
$divider-text-font-weight: bold;

.divider-with-text {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: $divider-text-color;
  //font-weight: $divider-text-font-weight;
  font-size: $divider-text-font-size;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-top: $divider-thickness solid $divider-color;
  }

  &::before {
    margin-right: $divider-margin;
  }

  &::after {
    margin-left: $divider-margin;
  }
}
</style>
