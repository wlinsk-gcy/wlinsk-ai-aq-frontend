import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { QueryUserDetailRespDTO } from '@/api/models/user/user/QueryUserDetailRespDTO'
import { queryDetails } from '@/api/controller/user/userController'
import ACCESS_ENUM from '@/access/accessEnum'

export const useUserStore = defineStore('loginUser', () => {
  const loginUser = ref<QueryUserDetailRespDTO>({

  })

  async function fetchLoginUser() {
    const result = await queryDetails()
    loginUser.value = result.data as QueryUserDetailRespDTO ?? {userRole: ACCESS_ENUM.NOT_LOGIN}
    console.log('userStores: ',loginUser.value)
  }

  function setLoginUser(newLoginUser: QueryUserDetailRespDTO) {
    loginUser.value = newLoginUser
  }

  return { loginUser, setLoginUser, fetchLoginUser }
},{
  //开启持久化
  persist: true
})
