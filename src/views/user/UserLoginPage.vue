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
const loading = ref(false)
const handleSubmit = async (errors: any) => {
  if (errors.errors) {
    return
  }
  loading.value = true
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
  } finally {
    loading.value = false
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
  const code = route.query?.code ?? ''
  if (!code || code == '') {
    return
  }
  try {
    await threePartLoginCallback(code as string)
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
watchEffect(() => {
  giteeLoginCallback()
})
// 用户名(3~20位字母数字下划线) 或 邮箱
const userAccountRegex = /^(?:\w{3,20}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})$/
const userPasswordRegex = /^[a-zA-Z]\w{7,15}$/
const rules = {
  userAccount: [
    {
      validator: (value: any, cb: any) => {
        if (!value) {
          cb('请输入用户名')
        }
        if (!userAccountRegex.test(value)) {
          cb('请输入正确的用户名')
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
  ]
}
</script>

<template>
  <div class="mg-login-container">
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">通过AI驱动学习</span>
            掌握任何科目
          </h1>
          <p class="hero-subtitle">
            用我们的智能AI助手改变你的学习方式。<br />
            提问，获得即时且准确的答案，量身定制你的学习风格。
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

    <!-- Main login card -->
    <div class="mg-login-card">
      <!-- Logo and Title Section -->
      <div class="mg-login-header">
        <div class="mg-login-logo">
          <img src="@/assets/logo.png" alt="AI Answering" class="mg-logo-img" />
        </div>
        <h1 class="mg-login-title">欢迎回来</h1>
        <p class="mg-login-subtitle">登录到您的 Ansure 账户</p>
      </div>

      <!-- Login Form -->
      <a-form
        :rules="rules"
        :model="form"
        class="mg-login-form"
        label-align="left"
        auto-label-width
        @submit="handleSubmit"
      >
        <a-form-item
          field="userAccount"
          tooltip="长度在3-20之间，只能包含字母、数字和下划线"
          label="用户名 / 邮箱"
          validate-trigger="blur"
        >
          <a-input
            v-model="form.userAccount"
            placeholder="请输入用户名或邮箱"
            size="large"
            class="mg-input-large"
          />
        </a-form-item>

        <a-form-item
          field="userPassword"
          tooltip="以字母开头，长度在8-16之间，只能包含字母、数字和下划线"
          label="密码"
          validate-trigger="blur"
        >
          <a-input-password
            v-model="form.userPassword"
            placeholder="请输入密码"
            size="large"
            class="mg-input-large"
          />
        </a-form-item>

        <a-form-item no-style class="mg-form-actions">
          <div class="mg-login-btn-wrapper">
            <a-button
              html-type="submit"
              size="large"
              type="primary"
              class="mg-btn-primary"
              :loading="loading"
            >
              立即登录
            </a-button>
          </div>
        </a-form-item>

        <div class="mg-form-footer">
          <span class="mg-register-text">还没有账户？</span>
          <a-link href="#" @click="router.push('/user/register')" class="mg-register-link">
            立即注册
          </a-link>
        </div>

        <a-form-item no-style class="mg-social-section">
          <div class="mg-social-divider">
            <span>其他登录方式</span>
          </div>

          <div class="mg-social-buttons">
            <button class="mg-social-btn mg-gitee-btn" @click="giteeLogin">
              <img src="@/assets/giteeLogo.jpg" alt="Gitee" class="mg-social-icon" />
              <span>使用 Gitee 登录</span>
            </button>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
//@import '@/styles/mindgrasp-main.scss';

/* ====== Layout ====== */
.mg-login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px; /* 左右间距 */
  box-sizing: border-box;
}

/* ====== Background ====== */
.mg-login-bg {
  position: absolute;
  inset: 0;
  z-index: 1;

  .mg-login-bg-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      var(--mg-primary-50) 0%,
      var(--mg-secondary-50) 50%,
      var(--mg-primary-100) 100%
    );
    opacity: 0.8;
  }

  .mg-login-bg-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
        circle at 20% 80%,
        rgba(59, 130, 246, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
    animation: float 6s ease-in-out infinite;
  }
}

@keyframes float {
  50% {
    transform: translateY(-20px);
  }
}

/* ====== Card ====== */
.mg-login-card {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: var(--mg-radius-2xl);
  box-shadow: var(--mg-shadow-2xl);
  border: 1px solid rgba(255, 255, 255, 0.2);

  padding: var(--mg-space-12);
  width: 100%;
  max-width: 480px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
}

/* ====== Header ====== */
.mg-login-header {
  text-align: center;
  margin-bottom: var(--mg-space-10);

  .mg-login-logo {
    margin-bottom: var(--mg-space-6);

    img {
      height: 60px;
      border-radius: var(--mg-radius-lg);
      box-shadow: var(--mg-shadow-md);
      //transition: transform var(--mg-transition-base);
    }
  }

  .mg-login-title {
    margin-bottom: var(--mg-space-3);
    font-size: var(--mg-text-4xl);
    font-weight: var(--mg-font-bold);
  }

  .mg-login-subtitle {
    color: var(--mg-gray-600);
    font-size: var(--mg-text-base);
    line-height: 1.6;
  }
}

/* ====== Login Form ====== */
.mg-login-form {
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

  .mg-login-btn-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: var(--mg-space-6);
  }

  .mg-form-footer {
    text-align: center;
    font-size: var(--mg-text-base);
    color: var(--mg-gray-600);

    .mg-register-text {
      margin-right: var(--mg-space-2);
      color: var(--mg-gray-600);
    }
    .mg-register-link {
      color: var(--mg-primary-600);
      font-weight: var(--mg-font-medium);
      text-decoration: none;
      transition: color var(--mg-transition-fast);

      &:hover {
        color: var(--mg-primary-700);
      }
    }
  }

  .mg-social-section {
    margin-top: var(--mg-space-8);
  }
}

/* ====== Social Login ====== */
.mg-social-divider {
  display: flex;
  align-items: center;
  margin: var(--mg-space-6) 0;
  color: var(--mg-gray-500);
  font-size: var(--mg-text-xs);

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--mg-gray-300);
  }

  span {
    padding: 0 var(--mg-space-3);
    background: rgba(255, 255, 255, 0.95);
  }
}

.mg-social-buttons {
  display: flex;
  justify-content: center;
}

.mg-social-btn {
  display: flex;
  align-items: center;
  gap: var(--mg-space-3);
  padding: var(--mg-space-3) var(--mg-space-6);
  border: 2px solid var(--mg-gray-200);
  background: white;
  border-radius: var(--mg-radius-lg);
  //font-weight: var(--mg-font-medium);
  font-size: var(--mg-text-xs);
  cursor: pointer;
  transition: all var(--mg-transition-base);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--mg-shadow-md);
    background: var(--mg-primary-50);
  }

  &:active {
    transform: translateY(0);
  }

  img {
    width: 24px;
    height: 24px;
    border-radius: var(--mg-radius-sm);
  }
}

.mg-gitee-btn {
  //border-color: var(--mg-gitee-red);

  &:hover {
    background: rgba(255, 255, 255, 0.95);
  }
}

/* ====== Primary Button 优化后的通用按钮 ====== */
.mg-btn-primary {
  background: linear-gradient(135deg, var(--mg-primary-500), var(--mg-primary-600));
  color: white;
  border: none;
  font-weight: var(--mg-font-semibold);
  border-radius: var(--mg-radius-lg);
  min-width: 280px;
  height: 56px;

  &:hover:not(.arco-btn-loading) {
    transform: translateY(-2px);
    box-shadow: var(--mg-shadow-lg);
  }
}


/* ====== Responsive ====== */
@media (max-width: 768px) {
  .mg-login-card {
    padding: var(--mg-space-8);
  }

  .mg-login-header {
    margin-bottom: var(--mg-space-8);

    img {
      height: 48px;
    }

    .mg-login-title {
      font-size: var(--mg-text-3xl);
    }
  }
}

@media (max-width: 480px) {
  .mg-login-card {
    padding: var(--mg-space-6);
  }

  .mg-social-btn {
    padding: var(--mg-space-2) var(--mg-space-3);
    font-size: var(--mg-text-xs);

    img {
      width: 20px;
      height: 20px;
    }
  }
}

//.mg-login-card:focus-within {
//  box-shadow: 0 0 0 2px var(--mg-primary-200), var(--mg-shadow-2xl);
//}
</style>
