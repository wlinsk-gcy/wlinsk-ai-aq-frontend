import ACCESS_ENUM from '@/access/accessEnum'
import UserLoginPage from '@/views/user/UserLoginPage.vue'
import UserRegisterPage from '@/views/user/UserRegisterPage.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import AdminUserPage from '@/views/admin/AdminUserPage.vue'
import AdminAppPage from '@/views/admin/AdminAppPage.vue'
import HomePage from '@/views/HomePage.vue'
import AppDetailsPage from '@/views/user/AppDetailsPage.vue'
import AddAppPage from '@/views/user/AddAppPage.vue'
import AddQuestionPage from '@/views/user/AddQuestionPage.vue'
import AddScoringResultPage from '@/views/user/AddScoringResultPage.vue'
import DoAnswerPage from '@/views/user/answer/DoAnswerPage.vue'
import AnswerResultPage from '@/views/user/answer/AnswerResultPage.vue'
import MyAnswerPage from '@/views/user/answer/MyAnswerPage.vue'
import MyAppPage from '@/views/user/MyAppPage.vue'

export const routes = [
  {
    path: '/',
    name: '首页',
    component: HomePage
  },
  {
    path: '/app/details/:appId',
    name: '应用详情',
    component: AppDetailsPage,
    //如果不设置props则无法获取到动态路由的参数
    props: true,
    meta: {
      hideInMenu: true
    }
  },
  {
    path: '/add/app',
    name: '创建应用',
    component: AddAppPage,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/add/app/:appId',
    name: '修改应用',
    props: true,
    component: AddAppPage,
    meta: {
      hideInMenu: true
    }
  },
  {
    path: '/app/my',
    name: '我的应用',
    component: MyAppPage,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/add/question/:appId",
    name: "创建题目",
    component: AddQuestionPage,
    props: true,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/add/scoringResult/:appId",
    name: "创建评分",
    component: AddScoringResultPage,
    props: true,
    meta: {
      hideInMenu: true,
    },
  },
  {
    path: "/answer/do/:appId",
    name: "答题",
    component: DoAnswerPage,
    props: true,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/answer/result/:recordId",
    name: "答题结果",
    component: AnswerResultPage,
    props: true,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/answer/my",
    name: "我的答题",
    component: MyAnswerPage,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: '/admin/user',
    name: '用户管理',
    component: AdminUserPage,
    meta: {
      access: ACCESS_ENUM.ADMIN
    }
  },
  {
    path: '/admin/app',
    name: '应用管理',
    component: AdminAppPage,
    meta: {
      access: ACCESS_ENUM.ADMIN
    }
  },
  {
    path: '/user',
    name: '用户',
    component: UserLayout,
    meta: {
      hideInMenu: true
    },
    children: [
      {
        path: '/user/login',
        name: '用户登录',
        component: UserLoginPage
      },
      {
        path: '/user/register',
        name: '用户注册',
        component: UserRegisterPage
      }
    ]
  },
  {
    path: '/noAuth',
    name: '无权限',
    component: () => import('../views/NoAuthPage.vue'),
    meta: {
      hideInMenu: true
    }
  }
  /*{
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  }*/
]
