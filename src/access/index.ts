import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import ACCESS_ENUM from '@/access/accessEnum'
import checkAccess from '@/access/checkAccess'
import { Modal } from '@arco-design/web-vue'
import { isEmptyObject } from '@arco-design/web-vue/es/_utils/is'
import { useChatSessionStore } from '@/stores/chatSessionStore'

router.beforeEach(async (to, from, next) => {
  if (to.path === '/user/login' || to.path === '/user/threePartLogin' || to.path === '/user/register'){
    const token = localStorage.getItem('token')
    if (token){
      next('/')
      return
    }
    next();
    return
  }
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    const userStore = useUserStore()
    const loginUser = userStore.loginUser
    if (!localStorage.getItem('token')){
      //如果token为空，从来没有登陆过，是游客，直接跳转到首页
      Modal.warning({
        title:'温馨提示',
        content: '请登录后再操作吧',
      })
      next( '/')
      return
    }
    // 如果之前没有尝试获取过登录用户信息，才自动登录
    if (isEmptyObject(loginUser)) {
      // 加 await 是为了等待用户登录成功并获取到值后，再执行后续操作
      await userStore.fetchLoginUser()
      //当token已失效的情况下，获取到的角色会是NOT_LOGIN的逻辑，所以不继续放行了
      if (ACCESS_ENUM.NOT_LOGIN === userStore.loginUser?.userRole){
        next(from.path)
        return
      }else {
        next()
        return
      }
    }else if (!checkAccess(loginUser, needAccess)) {
      //已经登录但权限不足，跳转到无权限页面
      next('/noAuth')
      return
    }
  }
  next();
})
