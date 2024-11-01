<script setup lang="ts">
import { Modal } from '@arco-design/web-vue'

const handleClickInfo = () => {
  Modal.info({
    content: '祝您生活愉快！'
  });
};
</script>

<template>
  <div id="userLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img class="logo" src="@/assets/logo.png" alt="logo" />
          <div>AI Answering Application Platform</div>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a-button type="text" @click="handleClickInfo">WLINSK</a-button>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped lang="scss">
#userLayout {
  text-align: center;
  background: url('https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png') 0% 0% /
    100% 100%;

  .logo {
    width: 100px;
    height: 60px;
  }

  .header {
    margin-top: 16px;
    font-size: 21px;
  }

  .content {
    margin-bottom: 16px;
    padding: 20px;
  }

  .footer {
    padding: 16px;
    text-align: center;
    background: #efefef;
  }
}
</style>
