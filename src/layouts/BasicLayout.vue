<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import { Modal } from '@arco-design/web-vue'
import CustomerServiceFloat from '@/components/CustomerServiceFloat.vue'

const handleClickInfo = () => {
  Modal.info({
    content: '祝您生活愉快！'
  });
};
</script>

<template>
  <div id="basicLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a-button type="text" @click="handleClickInfo">WLINSK</a-button>
      </a-layout-footer>
    </a-layout>
    <CustomerServiceFloat />
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
    //居中 离底部28px
    margin: 0 auto 28px;
    //缩进20px
    padding: 20px;
    //background-color: aquamarine;
  }

  .footer {
    padding: 16px;
    text-align: center;
    background: #efefef;
  }
}
</style>
