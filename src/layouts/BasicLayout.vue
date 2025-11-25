<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import CustomerServiceFloat from '@/components/CustomerServiceFloat.vue'
</script>

<template>
  <div id="basicLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
        <CustomerServiceFloat />
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
    </a-layout>
  </div>

</template>

<style scoped lang="scss">
#basicLayout {
  width: 100%;

  .header {
    margin-bottom: 16px;
    //盒子阴影
    box-shadow: #eee 1px 1px 5px;
  }

  .content {
    //盒子最大宽度
    max-width: 1200px;
    width: 100%;
    box-sizing: border-box;
    //居中 离顶部96px，离底部28px
    margin: 108px auto;
    //缩进20px
    padding: 20px;
    //background-color: aquamarine;
  }
}
</style>
