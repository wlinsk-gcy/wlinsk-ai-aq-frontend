<template>
  <div class="mindgrasp-login">
    <!-- Mobile Menu -->
    <MobileMenu :is-open="mobileMenuOpen" @close="closeMobileMenu" />

    <!-- Header Navigation -->
    <header class="header" :class="{ scrolled: isScrolled }">
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-brand">
            <router-link to="/mindgrasp" class="brand-link">
              <h1 class="brand-text">MindGrasp</h1>
              <span class="brand-ai">AI</span>
            </router-link>
          </div>

          <div class="nav-actions">
            <button class="btn btn-outline" @click="$router.push('/mindgrasp')">
              Back to Home
            </button>
          </div>

          <button class="mobile-menu-toggle" @click="toggleMobileMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>

    <!-- Login Section -->
    <main class="login-main">
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h2 class="login-title">Welcome Back</h2>
            <p class="login-subtitle">Sign in to your MindGrasp AI account</p>
          </div>

          <!-- Social Login Options -->
          <div class="social-login">
            <button class="social-btn google-btn">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button class="social-btn microsoft-btn">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path fill="#F25022" d="M11.4 11.4H2.6V2.6h8.8v8.8z"/>
                <path fill="#7FBA00" d="M21.4 11.4h-8.8V2.6h8.8v8.8z"/>
                <path fill="#00A4EF" d="M11.4 21.4H2.6v-8.8h8.8v8.8z"/>
                <path fill="#FFB900" d="M21.4 21.4h-8.8v-8.8h8.8v8.8z"/>
              </svg>
              Continue with Microsoft
            </button>
          </div>

          <div class="divider">
            <span class="divider-text">OR</span>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <div class="input-wrapper">
                <input
                  id="email"
                  type="email"
                  class="form-input"
                  placeholder="Enter your email"
                  v-model="loginForm.email"
                  :class="{ error: errors.email }"
                  required
                />
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="input-wrapper">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Enter your password"
                  v-model="loginForm.password"
                  :class="{ error: errors.password }"
                  required
                />
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <svg v-if="!showPassword" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" v-model="loginForm.rememberMe" class="checkbox" />
                <span class="checkmark"></span>
                Remember me
              </label>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <button
              type="submit"
              class="btn btn-primary btn-full btn-large"
              :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting">Sign In</span>
              <span v-else class="loading-spinner">
                <svg class="spinner" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            </button>
          </form>

          <div class="signup-link">
            <p>
              Don't have an account?
              <a href="#" class="link" @click="goToSignUp">Sign up for free</a>
            </p>
          </div>
        </div>

        <!-- Side Illustration -->
        <div class="login-illustration">
          <div class="illustration-content">
            <h3 class="illustration-title">Start Learning Smarter Today</h3>
            <p class="illustration-text">
              Join thousands of students and professionals who are already using MindGrasp AI
              to accelerate their learning journey.
            </p>
            <div class="feature-list">
              <div class="feature-item">
                <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>AI-powered question answering</span>
              </div>
              <div class="feature-item">
                <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Document analysis & summarization</span>
              </div>
              <div class="feature-item">
                <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Personalized learning paths</span>
              </div>
            </div>
          </div>
          <div class="floating-elements">
            <div class="floating-card floating-1">
              <div class="card-icon">📚</div>
              <div class="card-text">Study Materials</div>
            </div>
            <div class="floating-card floating-2">
              <div class="card-icon">🎯</div>
              <div class="card-text">Smart Goals</div>
            </div>
            <div class="floating-card floating-3">
              <div class="card-icon">📈</div>
              <div class="card-text">Progress Tracking</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-bottom">
          <p class="copyright">
            © 2024 MindGrasp AI. All rights reserved.
          </p>
          <div class="legal-links">
            <a href="#" class="legal-link">Privacy Policy</a>
            <a href="#" class="legal-link">Terms of Service</a>
            <a href="#" class="legal-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import './MindgraspLogin.scss'
import MobileMenu from './MobileMenu.vue'

const router = useRouter()
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)
const showPassword = ref(false)
const isSubmitting = ref(false)

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  email?: string
  password?: string
}

const loginForm = ref<LoginForm>({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref<FormErrors>({})

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!loginForm.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }

  if (!loginForm.value.password) {
    errors.value.password = 'Password is required'
  } else if (loginForm.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters long'
  }

  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // TODO: Replace with actual authentication logic
    console.log('Login attempt:', loginForm.value)

    // Redirect to dashboard or previous page
    router.push('/mindgrasp')
  } catch (error) {
    console.error('Login failed:', error)
    // Handle login error
  } finally {
    isSubmitting.value = false
  }
}

const goToSignUp = (event: Event) => {
  event.preventDefault()
  // TODO: Navigate to sign up page
  console.log('Navigate to sign up')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>