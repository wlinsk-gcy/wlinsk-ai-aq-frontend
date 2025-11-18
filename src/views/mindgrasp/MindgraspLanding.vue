<template>
  <div class="mindgrasp-landing">
    <!-- Mobile Menu -->
    <MobileMenu :is-open="mobileMenuOpen" @close="closeMobileMenu" />

    <!-- Header Navigation -->
    <header class="header" :class="{ scrolled: isScrolled }">
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-brand">
            <h1 class="brand-text">MindGrasp</h1>
            <span class="brand-ai">AI</span>
          </div>

          <div class="nav-menu">
            <a href="#features" class="nav-link">Features</a>
            <a href="#pricing" class="nav-link">Pricing</a>
            <a href="#testimonials" class="nav-link">Testimonials</a>
            <a href="#about" class="nav-link">About</a>
          </div>

          <div class="nav-actions">
            <button class="btn btn-secondary" @click="$router.push('/mindgrasp/login')">Sign In</button>
            <button class="btn btn-primary">Get Started Free</button>
          </div>

          <button class="mobile-menu-toggle" @click="toggleMobileMenu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            Master Any Subject with
            <span class="gradient-text">AI-Powered Learning</span>
          </h1>
          <p class="hero-subtitle">
            Transform the way you learn with our intelligent AI assistant.
            Upload documents, ask questions, and get instant, accurate answers
            tailored to your learning style.
          </p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-large">
              Start Learning Free
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button class="btn btn-outline btn-large" @click="$router.push('/mindgrasp/login')">
              Sign In
            </button>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">500K+</span>
              <span class="stat-label">Active Users</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">10M+</span>
              <span class="stat-label">Questions Answered</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">99.8%</span>
              <span class="stat-label">Accuracy Rate</span>
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
              <div class="mockup-title">MindGrasp AI Assistant</div>
            </div>
            <div class="mockup-content">
              <div class="chat-messages">
                <div class="message ai-message">
                  <div class="avatar ai-avatar">🤖</div>
                  <div class="message-content">
                    How can I help you learn today?
                  </div>
                </div>
                <div class="message user-message">
                  <div class="avatar user-avatar">👤</div>
                  <div class="message-content">
                    Explain quantum computing in simple terms
                  </div>
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

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Powerful Features for Smarter Learning</h2>
          <p class="section-subtitle">
            Everything you need to accelerate your learning journey
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">
              <component :is="feature.icon" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Choose Your Learning Plan</h2>
          <p class="section-subtitle">
            Flexible pricing for students, educators, and professionals
          </p>
        </div>

        <div class="pricing-grid">
          <div class="pricing-card" v-for="plan in pricingPlans" :key="plan.id" :class="{ featured: plan.featured }">
            <div class="plan-header">
              <h3 class="plan-name">{{ plan.name }}</h3>
              <div class="plan-price">
                <span class="currency">$</span>
                <span class="amount">{{ plan.price }}</span>
                <span class="period">/month</span>
              </div>
              <p class="plan-description">{{ plan.description }}</p>
            </div>

            <ul class="plan-features">
              <li v-for="feature in plan.features" :key="feature" class="feature-item">
                <svg class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ feature }}
              </li>
            </ul>

            <button class="btn" :class="plan.featured ? 'btn-primary' : 'btn-outline'">
              {{ plan.ctaText }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="testimonials">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">What Our Users Say</h2>
          <p class="section-subtitle">
            Join thousands of satisfied learners worldwide
          </p>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card" v-for="testimonial in testimonials" :key="testimonial.id">
            <div class="testimonial-content">
              <div class="quote-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p class="testimonial-text">{{ testimonial.content }}</p>
            </div>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar" />
              <div class="author-info">
                <div class="author-name">{{ testimonial.name }}</div>
                <div class="author-role">{{ testimonial.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Transform Your Learning?</h2>
          <p class="cta-subtitle">
            Start your free trial today and experience the power of AI-assisted learning
          </p>
          <div class="cta-actions">
            <button class="btn btn-primary btn-large">
              Start Free Trial
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button class="btn btn-outline btn-large" @click="$router.push('/mindgrasp/login')">
              Sign In
            </button>
            <p class="cta-note">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-brand">
              <h3 class="brand-text">MindGrasp<span class="brand-ai">AI</span></h3>
              <p class="brand-description">
                Empowering learners worldwide with intelligent AI assistance
              </p>
              <div class="social-links">
                <a href="#" class="social-link">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" class="social-link">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.85.38-1.75.64-2.7.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.54-2.11-9.91-5.02-.41.71-.65 1.53-.65 2.4 0 1.67.85 3.14 2.14 4.01-.79-.03-1.54-.24-2.19-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.91-.08.62 1.91 2.39 3.3 4.49 3.34-1.65 1.29-3.72 2.06-5.98 2.06-.39 0-.77-.02-1.15-.07 2.13 1.37 4.66 2.17 7.38 2.17 8.85 0 13.68-7.33 13.68-13.68 0-.21 0-.42-.01-.62.94-.68 1.76-1.53 2.4-2.5z"/>
                  </svg>
                </a>
                <a href="#" class="social-link">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">Product</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Features</a></li>
              <li><a href="#" class="footer-link">Pricing</a></li>
              <li><a href="#" class="footer-link">Use Cases</a></li>
              <li><a href="#" class="footer-link">API</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">Company</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">About</a></li>
              <li><a href="#" class="footer-link">Blog</a></li>
              <li><a href="#" class="footer-link">Careers</a></li>
              <li><a href="#" class="footer-link">Contact</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">Support</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Help Center</a></li>
              <li><a href="#" class="footer-link">Documentation</a></li>
              <li><a href="#" class="footer-link">Community</a></li>
              <li><a href="#" class="footer-link">Status</a></li>
            </ul>
          </div>
        </div>

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
import { ref, h, onMounted, onUnmounted } from 'vue'
import './MindgraspLanding.scss'
import MobileMenu from './MobileMenu.vue'

const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Icon components
const DocumentIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
])

const BrainIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' })
])

const ChatIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' })
])

const ChartIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
])

const ShieldIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' })
])

const GlobeIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
])

const features = ref([
  {
    id: 1,
    icon: DocumentIcon,
    title: 'Document Analysis',
    description: 'Upload PDFs, Word documents, and images for instant AI analysis and question answering.'
  },
  {
    id: 2,
    icon: BrainIcon,
    title: 'Smart Learning',
    description: 'Personalized learning paths that adapt to your progress and knowledge gaps.'
  },
  {
    id: 3,
    icon: ChatIcon,
    title: '24/7 AI Tutor',
    description: 'Get instant answers to your questions anytime, anywhere with our AI assistant.'
  },
  {
    id: 4,
    icon: ChartIcon,
    title: 'Progress Tracking',
    description: 'Monitor your learning progress with detailed analytics and insights.'
  },
  {
    id: 5,
    icon: ShieldIcon,
    title: 'Privacy First',
    description: 'Your data is encrypted and secure. We never share your personal information.'
  },
  {
    id: 6,
    icon: GlobeIcon,
    title: 'Multi-Language Support',
    description: 'Learn in your preferred language with support for 50+ languages.'
  }
])

const pricingPlans = ref([
  {
    id: 1,
    name: 'Starter',
    price: '9',
    description: 'Perfect for casual learners',
    featured: false,
    ctaText: 'Get Started',
    features: [
      '100 questions per month',
      'Basic document analysis',
      'Email support',
      'Mobile app access'
    ]
  },
  {
    id: 2,
    name: 'Pro',
    price: '29',
    description: 'Most popular for students',
    featured: true,
    ctaText: 'Start Free Trial',
    features: [
      'Unlimited questions',
      'Advanced document analysis',
      'Priority support',
      'Progress tracking',
      'Mobile & desktop apps',
      'Study groups'
    ]
  },
  {
    id: 3,
    name: 'Enterprise',
    price: '99',
    description: 'For teams and institutions',
    featured: false,
    ctaText: 'Contact Sales',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'Advanced analytics',
      'API access',
      'Training sessions'
    ]
  }
])

const testimonials = ref([
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Medical Student',
    content: 'MindGrasp AI has completely transformed how I study complex medical concepts. I can upload my lecture notes and get instant clarifications on difficult topics.',
    avatar: 'https://picsum.photos/seed/user1/100/100.jpg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Software Developer',
    content: 'As a developer learning new technologies, MindGrasp AI helps me understand documentation and code examples much faster. It\'s like having a personal tutor 24/7.',
    avatar: 'https://picsum.photos/seed/user2/100/100.jpg'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'High School Teacher',
    content: 'I use MindGrasp AI to create personalized learning materials for my students. The AI helps me explain concepts in different ways to suit various learning styles.',
    avatar: 'https://picsum.photos/seed/user3/100/100.jpg'
  }
])
</script>