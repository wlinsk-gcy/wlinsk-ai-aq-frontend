import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { QueryUserDetailRespDTO } from '@/api/models/user/user/QueryUserDetailRespDTO'
import { queryDetails } from '@/api/controller/user/userController'
import ACCESS_ENUM from '@/access/accessEnum'

export const useUserStore = defineStore('loginUser', () => {
  const loginUser = ref<QueryUserDetailRespDTO>({
    userName: '未登录'
  })

  async function fetchLoginUser() {
    try {
      const result = await queryDetails()
      loginUser.value = result.data as QueryUserDetailRespDTO
    } catch (e) {
      loginUser.value = { userRole: ACCESS_ENUM.NOT_LOGIN };
    }
  }

  function setLoginUser(newLoginUser: QueryUserDetailRespDTO) {
    loginUser.value = newLoginUser
  }

  return { loginUser, setLoginUser, fetchLoginUser }
})
