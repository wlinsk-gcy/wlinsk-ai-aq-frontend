import axios, {
  type AxiosInterceptorManager,
  type AxiosPromise,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios'
import type { Result } from '@/api/models/Result'
import { Message, Modal } from '@arco-design/web-vue'
import { useUserStore } from '@/stores/userStore'

const tjRequest = axios.create({
  // baseURL: 'http://localhost:8081/api',
  baseURL: import.meta.env.VITE_TJ_PROJECT_HOST,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  withCredentials: true
})

// Add a request interceptor
tjRequest.interceptors.request.use(
  function (config) {
    //设置token
    config.headers.userid = useUserStore().loginUser.userId
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

tjRequest.interceptors.response.use(
  function (response: AxiosResponse<any, Result<any>>) {
    const result = response.data
    if (result.rspCd !== '00000' && result.rspInf !== 'success') {
      return Promise.reject(result.rspInf)
    }
    return result
  },
  function (error) {
    return Promise.reject(error)
  }
)

/**
 * 作用：自定义返回类型，R为具体的放回类型，T的作用是当没有指定R时，由T自动推导
 * 博客：https://docs.shanyuhai.top/frontend/typescript/change-axios-response-type.html
 */
export interface AxiosInstance {
  (config: AxiosRequestConfig): AxiosPromise

  (url: string, config?: AxiosRequestConfig): AxiosPromise

  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R>

  get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>

  delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>

  head<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R>

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R>

  patch<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<R>
}

export default tjRequest
