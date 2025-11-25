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
  <div class="mg-register-container">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">加入 Ansure AI</span>
            开始智能学习之旅
          </h1>
          <p class="hero-subtitle">
            创建您的专属账户，解锁 AI 驱动的学习体验。<br />
            个性化学习路径，即时解答，让学习更高效。
          </p>

          <div class="hero-stats" style="padding: 10px 60px">
            <div class="stat-item">
              <span class="stat-number">5W+</span>
              <span class="stat-label">活跃用户</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">1000W+</span>
              <span class="stat-label">问题解答</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">99.8%</span>
              <span class="stat-label">准确率</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="ai-interface-mockup">
            <div class="mockup-header">
              <div class="mockup-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="mockup-title">Ansure AI Assistant</div>
            </div>
            <div class="mockup-content">
              <div class="chat-messages">
                <div class="message ai-message">
                  <div class="avatar ai-avatar">🤖</div>
                  <div class="message-content">今天想要学习什么新知识呢？</div>
                </div>
                <div class="message user-message">
                  <div class="avatar user-avatar">👤</div>
                  <div class="message-content">请用简单的语言解释量子计算。</div>
                </div>
                <div class="message ai-message">
                  <div class="avatar ai-avatar">🤖</div>
                  <div class="message-content">
                    <div class="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main registration card -->
    <div class="mg-register-card">
      <!-- Logo and Title Section -->
      <div class="mg-register-header">
        <div class="mg-register-logo">
          <img src="@/assets/logo.png" alt="Ansure AI - Logo" class="mg-logo-img" />
        </div>
        <h1 class="mg-register-title">创建账户</h1>
        <p class="mg-register-subtitle">加入 Ansure，开启智能学习新体验</p>
      </div>

      <!-- Registration Form -->
      <a-form
        :rules="rules"
        :model="form"
        class="mg-register-form"
        label-align="left"
        auto-label-width
        @submit="handleSubmit"
      >
        <a-form-item
          field="userAccount"
          tooltip="仅支持邮箱格式"
          label="邮箱地址"
          validate-trigger="blur"
        >
          <a-input
            v-model="form.userAccount"
            placeholder="请输入您的邮箱地址"
            size="small"
            class="mg-input-large"
            aria-label="邮箱地址"
          />
        </a-form-item>

        <a-form-item field="verifyCode" label="验证码" validate-trigger="blur">
          <div class="mg-verify-code-group">
            <a-input
              v-model="form.verifyCode"
              placeholder="请输入验证码"
              size="large"
              class="mg-input-large mg-verify-input"
              aria-label="验证码"
            />
            <a-button
              type="primary"
              size="large"
              class="mg-verify-btn"
              :loading="loading"
              :disabled="cooldown > 0 || !form.userAccount"
              @click="handleSendCode"
            >
              <template v-if="loading">
                <a-spin size="small" />
                <span style="margin-left: 8px">发送中...</span>
              </template>
              <template v-else>
                {{ cooldown > 0 ? `${cooldown} 秒后重试` : '发送验证码' }}
              </template>
            </a-button>
          </div>
        </a-form-item>

        <a-form-item
          field="userPassword"
          tooltip="以字母开头，长度在8-16之间，只能包含字母、数字和下划线"
          label="密码"
          validate-trigger="blur"
        >
          <a-input-password
            v-model="form.userPassword"
            placeholder="请设置密码"
            size="large"
            class="mg-input-large"
            aria-label="密码"
          />
        </a-form-item>

        <a-form-item field="checkPassword" label="确认密码" validate-trigger="blur">
          <a-input-password
            v-model="form.checkPassword"
            placeholder="请再次输入密码"
            size="large"
            class="mg-input-large"
            aria-label="确认密码"
          />
        </a-form-item>

        <a-form-item no-style class="mg-form-actions">
          <div class="mg-register-btn-wrapper">
            <a-button
              html-type="submit"
              size="large"
              type="primary"
              class="mg-btn-primary"
            >
              立即注册
            </a-button>
          </div>
        </a-form-item>

        <div class="mg-form-footer">
          <span class="mg-login-text">已有账户？</span>
          <a-link href="#" @click="router.push('/user/login')" class="mg-login-link">
            立即登录
          </a-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<style scoped lang="scss">

/* ====== Layout ====== */
.mg-register-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px; /* 左右间距 */
  box-sizing: border-box;
}

/* ====== Registration Card ====== */
.mg-register-card {
  position: relative;
  z-index: var(--mg-z-card, 10);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--mg-radius-2xl);
  box-shadow: var(--mg-shadow-2xl);
  border: 1px solid rgba(255, 255, 255, 0.2);

  padding: var(--mg-space-12);
  width: 100%;
  max-width: 480px;
  animation: slideUp 0.6s ease-out forwards;

  @media (max-width: 768px) {
    padding: var(--mg-space-8);
    max-width: 400px;
  }

  @media (max-width: 480px) {
    padding: var(--mg-space-6);
    max-width: 320px;
  }
}

@keyframes slideUp { //从下向上进入
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ====== Header ====== */
.mg-register-header {
  text-align: center;
  margin-bottom: var(--mg-space-10);

  .mg-register-logo {
    margin-bottom: var(--mg-space-6);

    .mg-logo-img {
      height: 60px;
      border-radius: var(--mg-radius-lg);
      box-shadow: var(--mg-shadow-md);
      transition: transform var(--mg-transition-base);

      &:hover {
        transform: scale(1.05);
      }

      @media (max-width: 768px) {
        height: 48px;
      }
    }
  }

  .mg-register-title {
    margin-bottom: var(--mg-space-3);
    font-size: var(--mg-text-4xl);
    font-weight: var(--mg-font-bold);
    color: var(--mg-gray-900);

    @media (max-width: 768px) {
      font-size: var(--mg-text-3xl);
    }
  }

  .mg-register-subtitle {
    color: var(--mg-gray-600);
    font-size: var(--mg-text-base);
    line-height: 1.6;
  }
}

/* ====== Registration Form ====== */
.mg-register-form {
  .arco-form-item {
    margin-bottom: var(--mg-space-6);

    .arco-form-item-label {
      font-weight: var(--mg-font-medium);
      color: var(--mg-gray-700);
      margin-bottom: var(--mg-space-2);
    }

    .arco-form-item-message {
      font-size: var(--mg-text-sm);
      margin-top: var(--mg-space-1);
    }

    &.arco-form-item-error {
      .arco-form-item-message {
        color: var(--mg-error-500);
      }
    }
  }


  .mg-input-large {
    height: 56px;
    border-radius: var(--mg-radius-lg);
    transition: all var(--mg-transition-base);

  }
  :deep(.mg-input-large.arco-input-wrapper) {
    padding-left: 0 !important;
    padding-right: 0 !important;

    > .arco-input {
      padding-left: 12px !important;
    }

    > .arco-input-suffix {
      padding-right: 12px !important;
      border-left: 2px solid rgb(230, 230, 230);
    }
  }



  .mg-form-actions {
    margin: var(--mg-space-8) 0 var(--mg-space-6);
  }

  .mg-register-btn-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: var(--mg-space-6);
  }

  .mg-form-footer {
    text-align: center;
    font-size: var(--mg-text-base);
    color: var(--mg-gray-600);

    .mg-login-text {
      margin-right: var(--mg-space-2);
      color: var(--mg-gray-600);
    }

    .mg-login-link {
      color: var(--mg-primary-600);
      font-weight: var(--mg-font-medium);
      text-decoration: none;
      transition: color var(--mg-transition-fast);

      &:hover {
        color: var(--mg-primary-700);
      }
    }
  }
}

/* ====== Verification Code Group ====== */
.mg-verify-code-group {
  display: flex;
  gap: var(--mg-space-3);
  width: 100%;

  .mg-verify-input {
    flex: 1;
  }

  .mg-verify-btn {
    min-width: 120px;
    font-weight: var(--mg-font-medium);
    border-radius: var(--mg-radius-lg);
    transition: all var(--mg-transition-base);

    &:hover:not(.arco-btn-loading):not(:disabled) {
      transform: translateY(-1px);
      box-shadow: var(--mg-shadow-md);
    }

    &:active {
      transform: translateY(0);
    }

    @media (max-width: 480px) {
      min-width: 100px;
      font-size: var(--mg-text-sm);
    }
  }
}

/* ====== Primary Button ====== */
.mg-btn-primary {
  background: linear-gradient(135deg, var(--mg-primary-500), var(--mg-primary-600));
  color: white;
  border: none;
  font-weight: var(--mg-font-semibold);
  border-radius: var(--mg-radius-lg);
  min-width: 280px;
  height: 56px;
  transition: all var(--mg-transition-base);
  box-shadow: var(--mg-shadow-md);

  &:hover:not(.arco-btn-loading) {
    transform: translateY(-2px);
    box-shadow: var(--mg-shadow-lg);
    background: linear-gradient(135deg, var(--mg-primary-600), var(--mg-primary-700));
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    min-width: 240px;
    height: 48px;
  }
}

/* ====== Responsive Design ====== */
//@media (max-width: 1024px) {
//  .mg-register-container {
//    flex-direction: column;
//    gap: var(--mg-space-8);
//    padding: var(--mg-space-4);
//  }
//
//}

//@media (max-width: 768px) {
//  .mg-register-header {
//    margin-bottom: var(--mg-space-8);
//  }
//
//  .mg-register-form .arco-form-item {
//    margin-bottom: var(--mg-space-5);
//  }
//}

//@media (max-width: 480px) {
//  .mg-register-header {
//    margin-bottom: var(--mg-space-6);
//  }
//
//  .mg-verify-code-group {
//    flex-direction: column;
//    gap: var(--mg-space-2);
//
//    .mg-verify-btn {
//      width: 100%;
//    }
//  }
//
//  .hero-stats {
//    gap: var(--mg-space-4);
//  }
//}

/* ====== Accessibility ====== */
//@media (prefers-reduced-motion: reduce) {
//  .mg-register-card,
//  .hero-content,
//  .hero-visual,
//  .ai-interface-mockup {
//    animation: none;
//  }
//
//  .mg-register-bg-pattern {
//    animation: none;
//  }
//
//  .typing-indicator span {
//    animation: none;
//  }
//
//  * {
//    transition-duration: 0.01ms !important;
//    animation-duration: 0.01ms !important;
//  }
//}

/* ====== Performance Optimizations ====== */
.mg-register-card {
  will-change: transform, opacity;
  transform: translateZ(0);
}

//.ai-interface-mockup {
//  will-change: transform;
//  transform: translateZ(0);
//
//  @media (max-width: 768px) {
//    animation: none; /* Remove animation on mobile for performance */
//  }
//}

/* ====== Focus States ====== */
//.mg-register-card:focus-within {
//  box-shadow: 0 0 0 2px var(--mg-primary-200), var(--mg-shadow-2xl);
//}

.mg-btn-primary:focus {
  outline: 2px solid var(--mg-primary-500);
  outline-offset: 2px;
}

.mg-verify-btn:focus {
  outline: 2px solid var(--mg-primary-500);
  outline-offset: 2px;
}
</style>
