<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)


const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div id="userLayout">
    <!-- Mindgrasp-style Header -->
    <header class="mg-header" :class="{ scrolled: isScrolled }">
      <nav class="mg-navbar">
        <div class="mg-nav-container">
          <div class="mg-nav-brand">
            <router-link to="/" class="mg-brand-link">
              <img class="mg-logo" src="@/assets/logo.png" alt="Ansure AI" />
              <div class="mg-brand-text">
                <span class="mg-brand-name">Ansure</span>
                <span class="mg-brand-ai">AI</span>
              </div>
            </router-link>
          </div>

          <div class="mg-nav-actions">
            <router-link to="/" class="mg-btn mg-btn-outline">
              返回首页
            </router-link>
          </div>

          <button class="mg-mobile-menu-toggle" @click="toggleMobileMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div v-if="mobileMenuOpen" class="mg-mobile-menu-overlay" @click="closeMobileMenu">
        <div class="mg-mobile-menu" @click.stop>
          <div class="mg-mobile-menu-header">
            <img class="mg-logo" src="@/assets/logo.png" alt="Ansure AI" />
            <button class="mg-mobile-menu-close" @click="closeMobileMenu">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mg-mobile-menu-content">
            <router-link to="/" class="mg-mobile-menu-item" @click="closeMobileMenu">
              返回首页
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <a-layout-content class="mg-content">
      <router-view />
    </a-layout-content>

    <footer class="mg-footer">
      <div class="mg-footer-container">
        <div class="mg-footer-bottom">
          <p class="mg-copyright">
            © 2025 Ansure AI. All rights reserved.
          </p>
          <div class="mg-legal-links">
            <a href="#" class="mg-legal-link">Privacy Policy</a>
            <a href="#" class="mg-legal-link">Terms of Service</a>
            <a href="#" class="mg-legal-link">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">

#userLayout {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: -1;
  }
}

// Mindgrasp Header Styles
.mg-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-gray-200);
  z-index: var(--z-sticky);
  transition: all var(--transition-base);

  &.scrolled {
    background-color: rgba(255, 255, 255, 0.98);
    box-shadow: var(--shadow-md);
    border-bottom-color: var(--color-gray-300);
  }
}

.mg-navbar {
  padding: var(--spacing-md) 0;
}

.mg-nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 0 var(--spacing-md);
  }
}

.mg-nav-brand {
  display: flex;
  align-items: center;
}

.mg-brand-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  text-decoration: none;
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-1px);
  }
}

.mg-logo {
  width: 100px;
  height: 60px;
  border-radius: var(--radius-lg);
  object-fit: cover;
}

.mg-brand-text {
  display: flex;
  align-items: center;
  font-weight: 800;
  font-size: 1.5rem;
}

.mg-brand-name {
  color: var(--color-gray-900);
}

.mg-brand-ai {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-secondary-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-left: 0.25rem;
}

.mg-nav-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    display: none;
  }
}

// Button Styles (matching Mindgrasp design)
.mg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 1rem;
  position: relative;
  overflow: hidden;

  &:focus {
    outline: 2px solid var(--color-primary-500);
    outline-offset: 2px;
  }

  &.mg-btn-outline {
    background: transparent;
    color: var(--color-primary-600);
    border: 2px solid var(--color-primary-600);

    &:hover {
      background: var(--color-primary-50);
      border-color: var(--color-primary-700);
      color: var(--color-primary-700);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// Mobile Menu Toggle
.mg-mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-sm);

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    width: 24px;
    height: 2px;
    background-color: var(--color-gray-600);
    transition: all var(--transition-fast);
  }
}

// Mobile Menu Overlay
.mg-mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal);
  backdrop-filter: blur(4px);
}

.mg-mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 320px;
  height: 100%;
  background: white;
  box-shadow: var(--shadow-2xl);
  z-index: var(--z-modal);
  overflow-y: auto;
  animation: slideInRight 0.3s ease-out;
}

.mg-mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-gray-200);
}

.mg-mobile-menu-close {
  background: none;
  border: none;
  color: var(--color-gray-600);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);

  &:hover {
    color: var(--color-gray-900);
  }

  svg {
    width: 24px;
    height: 24px;
  }
}

.mg-mobile-menu-content {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.mg-mobile-menu-item {
  display: block;
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--color-gray-700);
  text-decoration: none;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
  font-weight: 500;

  &:hover {
    background: var(--color-primary-50);
    color: var(--color-primary-600);
  }
}

// Content Area
.mg-content {
  min-height: calc(100vh - 120px);
  padding-top: 60px;
  padding-right: 24px;
  position: relative;
  z-index: 1;
}

// Footer Styles
.mg-footer {
  background: var(--color-gray-900);
  position: relative;
  z-index: 1;
}

.mg-footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);

  @media (max-width: 768px) {
    padding: 0 var(--spacing-md);
  }
}

.mg-footer-bottom {
  border-top: 1px solid var(--color-gray-800);
  padding-top: var(--spacing-2xl);
  padding-bottom: var(--spacing-2xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
}

.mg-copyright {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-gray-400);
}

.mg-legal-links {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.mg-legal-link {
  color: var(--color-gray-400);
  text-decoration: none;
  transition: color var(--transition-fast);
  font-size: 0.875rem;

  &:hover {
    color: var(--color-primary-400);
  }
}

// Animations
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Responsive Design
@media (max-width: 768px) {
  #userLayout {
    .mg-nav-container {
      padding: 0 var(--spacing-md);
    }
  }

  .mg-content {
    padding-top: 70px;
  }

  .mg-footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }
}

@media (max-width: 640px) {
  .mg-nav-container {
    padding: 0 var(--spacing-md);
  }

  .mg-content {
    padding-top: 60px;
  }

  .mg-footer {
    padding: var(--spacing-3xl) 0 var(--spacing-xl);
  }

  .mg-footer-container {
    padding: 0 var(--spacing-md);
  }
}
</style>
