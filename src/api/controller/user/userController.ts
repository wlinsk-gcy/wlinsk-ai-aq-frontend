import type { Result } from '@/api/models/Result'
import request from '@/request'
import type { QueryUserDetailRespDTO } from '@/api/models/user/user/QueryUserDetailRespDTO'
import type { UserLoginReqDTO } from '@/api/models/user/user/UserLoginReqDTO'
import type { UserLoginRespDTO } from '@/api/models/user/user/UserLoginRespDTO'
import type { UserRegisterReqDTO } from '@/api/models/user/user/UserRegisterReqDTO'
import type { ThreePartLoginReqDTO } from '@/api/models/user/user/ThreePartLoginReqDTO'
import { useUserStore } from '@/stores/userStore'

export async function queryDetails() {
  return request<any, Result<QueryUserDetailRespDTO>>('/user/queryDetails', {
    method: 'GET'
  })
}

export async function login(reqDTO: UserLoginReqDTO) {
  return request<any, Result<UserLoginRespDTO>>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: reqDTO
  }).then((res) => {
    // 登录成功后，将token存储到本地
    const data = res.data as UserLoginRespDTO
    localStorage.setItem('token', data.token)
    return res
  })
}
export async function threePartLogin(reqDTO: ThreePartLoginReqDTO){
  return request<any, Result<string>>('/user/threePartLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: reqDTO
  }).then((res) => {
    // 登录成功后，将token存储到本地
    const data = res.data as string
    return data
  })
}
export async function threePartLoginCallback(code: string){
  return request<any, Result<UserLoginRespDTO>>('/user/threePartLoginCallback/' + code, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => {
    // 登录成功后，将token存储到本地
    const data = res.data as UserLoginRespDTO
    localStorage.setItem('token', data.token)
    return res
  })
}

export async function register(reqDTO: UserRegisterReqDTO) {
  return request<any, Result<any>>('/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: reqDTO
  })
}
export async function logout(){
  return request<any, Result<any>>('/user/logout', {
    method: 'POST'
  }).then((res) => {
    // 退出登录后，清除本地存储的token
    localStorage.removeItem('token')
    useUserStore().setLoginUser({})
    return res
  })
}
