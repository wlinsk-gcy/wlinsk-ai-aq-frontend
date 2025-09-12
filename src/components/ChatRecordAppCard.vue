<!-- ChatRecordAppCard.vue -->
<template>
  <div class="card">
    <img :src="card.appIcon" alt="图标" class="icon" />
    <div class="info">
      <h4>{{ card.appName }}</h4>
      <p>
        {{
          card.appDesc && card.appDesc.length > 20
            ? card.appDesc.substring(0, 20) + '...'
            : card.appDesc
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'

defineProps<{ card: QueryAppDetailsRespDTO }>()
</script>

<style scoped>
.card {
  display: flex;
  border: 1px solid #eee;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  background: #fafafa;
}

.icon {
  width: 48px;
  height: 48px;
  margin-right: 10px;
}

.info h4 {
  margin: 0;
  font-size: 16px;
}

.info p {
  margin: 0;
  font-size: 13px;
  color: #666;
}
</style>
