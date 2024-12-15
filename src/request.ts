import axios, {
  type AxiosInterceptorManager,
  type AxiosPromise,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios'
import type { Result } from '@/api/models/Result'
import { Message, Modal } from '@arco-design/web-vue'
import { useUserStore } from '@/stores/userStore'
const request = axios.create({
  // baseURL: 'http://localhost:8081/api',
  baseURL: import.meta.env.VITE_REQUEST_HOST,
  timeout: 60000,
  // headers: {'X-Custom-Header': 'foobar'},
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  withCredentials: true
})

// Add a request interceptor
request.interceptors.request.use(
  function (config) {
    //设置token
    config.headers.token = localStorage.getItem('token');
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
request.interceptors.response.use(
  function (response: AxiosResponse<any, Result<any>>) {
    const result = response.data
    if (result.rspCd !== '00000' && result.rspInf !== 'success') {
      if (result.rspCd === '9991') {
        const token = localStorage.getItem('token')
        if (!token){
          //如果token为空，从来没有登陆过，是游客，直接跳转到首页
          Modal.warning({
            title:'温馨提示',
            content: '请登录后再操作吧',
            onOk: () => {
              window.location.href = '/'
            }
          })
        }else {
          Modal.warning({
            title:'温馨提示',
            content: '当前登录凭证已失效，请重新登录',
            onOk: () => {
              localStorage.removeItem('token')
              useUserStore().setLoginUser({})
              //token失效跳转到登录页
              if (`${window.location.pathname}`.startsWith('/user/login')){
                window.location.href = '/user/login'
              }else {
                window.location.href = `/user/login?redirect=${window.location.pathname}`
              }
            }
          })
        }
        return {};
      }else if (result.rspCd === '9990'){
        //权限不足，跳转到无权限页面
        window.location.href = '/noAuth'
      }
      // console.log('response error: ', result.rspInf)
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

export default request
