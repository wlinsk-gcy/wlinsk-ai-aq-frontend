import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { QueryAppDetailsRespDTO } from '@/api/models/user/app/QueryAppDetailsDTO'
import { queryById } from '@/api/controller/user/appController'

export const useAppStore = defineStore('app', () => {
  const appInfo = ref<QueryAppDetailsRespDTO>({})
  async function fetchAppInfo(appId: string){
    const result = await queryById(appId)
    appInfo.value = result.data as QueryAppDetailsRespDTO
  }
  return{appInfo,fetchAppInfo}

})