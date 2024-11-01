import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import ACCESS_ENUM from '@/access/accessEnum'
import checkAccess from '@/access/checkAccess'

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
    // 如果之前没有尝试获取过登录用户信息，才自动登录
    /*if (!loginUser || !loginUser.userRole) {
      // 加 await 是为了等待用户登录成功并获取到值后，再执行后续操作
      await userStore.fetchLoginUser()
      loginUser = userStore.loginUser
    }*/
    //跳转需要登录的页面
    if (!loginUser || !loginUser.userRole || loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
      //没有登录则跳转登录页
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
    //已经登录但权限不足，跳转到无权限页面
    if (!checkAccess(loginUser, needAccess)) {
      next('/noAuth')
      return
    }
  }
  next();
})
