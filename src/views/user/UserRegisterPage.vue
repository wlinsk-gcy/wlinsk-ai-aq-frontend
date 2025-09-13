<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { register, verify } from '@/api/controller/user/userController'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import type { UserRegisterReqDTO } from '@/api/models/user/user/UserRegisterReqDTO'

const router = useRouter()

const form = ref<UserRegisterReqDTO>({
  userAccount: '',
  verifyCode: '',
  userPassword: '',
  checkPassword: ''
})
const handleSubmit = async (errors: any) => {
  if (errors.errors) {
    return
  }
  try {
    await register(form.value)
    form.value = {
      userAccount: '',
      verifyCode: '',
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
// 倒计时
const loading = ref(false)
const cooldown = ref(0)
let timer: number | null = null

// 初始化检查 localStorage 是否有未过期的倒计时
onMounted(() => {
  const expire = localStorage.getItem('verifyCodeExpire')
  if (expire) {
    const left = Math.floor((+expire - Date.now()) / 1000)
    if (left > 0) {
      cooldown.value = left
      startTimer()
    } else {
      localStorage.removeItem('verifyCodeExpire')
    }
  }
})

const startTimer = () => {
  if (timer) clearInterval(timer)
  timer = window.setInterval(() => {
    if (cooldown.value > 0) {
      cooldown.value--
    } else {
      clearInterval(timer!)
      timer = null
      localStorage.removeItem('verifyCodeExpire')
    }
  }, 1000)
}

const handleSendCode = async () => {
  if (!form.value.userAccount) {
    Message.error('请先输入用户名')
    return
  }
  loading.value = true
  try {
    await verify({userAccount: form.value.userAccount})
    Message.success('验证码已发送')
    cooldown.value = 180
    localStorage.setItem('verifyCodeExpire', (Date.now() + 180000).toString())
    startTimer()
  } catch (e) {
    Message.error('验证码发送失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const userAccountRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const userPasswordRegex = /^[a-zA-Z]\w{7,15}$/
const rules = {
  userAccount: [
    {
      validator: (value: any, cb: any) => {
        if (!value) {
          cb('请输入邮箱')
        }
        if (!userAccountRegex.test(value)) {
          cb('请输入正确的邮箱格式')
        }
      }
    }
  ],
  verifyCode: [
    {
      validator: (value: any, cb: any) => {
        if (!value) {
          cb('请输入验证码')
        }
      }
    }
  ],
  userPassword: [
    {
      validator: (value: any, cb: any) => {
        if (!value) {
          cb('请输入密码')
        }
        if (!userPasswordRegex.test(value)) {
          cb('请输入正确的密码')
        }
      }
    }
  ],
  checkPassword: [
    {
      validator: (value: any, cb: any) => {
        if (!value) {
          cb('请输入确认密码')
        }
        if (value !== form.value.userPassword) {
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
    <a-form-item
      field="userAccount"
      tooltip="仅支持邮箱格式"
      label="用户名"
      validate-trigger="blur"
    >
      <a-input v-model="form.userAccount" placeholder="请输入用户名，仅支持邮箱格式" />
    </a-form-item>

    <a-form-item field="verifyCode" label="验证码" validate-trigger="blur">
      <div style="display: flex; gap: 8px; width: 100%">
        <a-input v-model="form.verifyCode" placeholder="请输入验证码" />
        <a-button
          type="primary"
          :loading="loading"
          :disabled="cooldown > 0"
          @click="handleSendCode"
        >
          {{ cooldown > 0 ? cooldown + ' 秒后重试' : '发送验证码' }}
        </a-button>
      </div>
    </a-form-item>

    <a-form-item
      field="userPassword"
      tooltip="以字母开头，长度在8-16之间，只能包含字母、数字和下划线"
      label="密码"
      validate-trigger="blur"
    >
      <a-input-password v-model="form.userPassword" placeholder="请输入密码" />
    </a-form-item>
    <a-form-item field="checkPassword" label="确认密码" validate-trigger="blur">
      <a-input-password v-model="form.checkPassword" placeholder="请输入确认密码" />
    </a-form-item>
    <a-form-item>
      <div style="display: flex; width: 100%; justify-content: space-between">
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
