<template>
  <div class="mobile-menu-overlay" :class="{ active: isOpen }" @click="$emit('close')">
    <div class="mobile-menu-panel" :class="{ active: isOpen }" @click.stop>
      <div class="mobile-menu-header">
        <div class="nav-brand">
          <h3 class="brand-text">MindGrasp</h3>
          <span class="brand-ai">AI</span>
        </div>
        <button class="close-button" @click="$emit('close')">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="mobile-nav">
        <a href="#features" class="mobile-nav-link" @click="$emit('close')">Features</a>
        <a href="#pricing" class="mobile-nav-link" @click="$emit('close')">Pricing</a>
        <a href="#testimonials" class="mobile-nav-link" @click="$emit('close')">Testimonials</a>
        <a href="#about" class="mobile-nav-link" @click="$emit('close')">About</a>
      </nav>

      <div class="mobile-actions">
        <button class="btn btn-secondary btn-full" @click="$router.push('/mindgrasp/login')">Sign In</button>
        <button class="btn btn-primary btn-full">Get Started Free</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal);
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-base);
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

.mobile-menu-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  max-width: 80vw;
  background: white;
  box-shadow: var(--shadow-2xl);
  transform: translateX(100%);
  transition: transform var(--transition-base);
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
}

.mobile-menu-panel.active {
  transform: translateX(0);
}

.mobile-menu-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.close-button {
  background: none;
  border: none;
  padding: var(--spacing-sm);
  cursor: pointer;
  color: var(--color-gray-500);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-gray-100);
    color: var(--color-gray-700);
  }

  svg {
    width: 24px;
    height: 24px;
  }
}

.mobile-nav {
  flex: 1;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.mobile-nav-link {
  color: var(--color-gray-700);
  text-decoration: none;
  font-weight: 500;
  font-size: 1.125rem;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-gray-100);
    color: var(--color-primary-600);
  }
}

.mobile-actions {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.btn-full {
  width: 100%;
  justify-content: center;
}
</style>