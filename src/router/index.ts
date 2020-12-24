import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'
import { Notification } from 'element-ui'
Vue.use(VueRouter)

// 路由配置规则
const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName:'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    children: [
      // {
      //   path: '',
      //   name: 'home',
      //   component: () => import(/* webpackChunkName:'home' */ '@/views/home/index.vue'),
      //   meta: {
      //     requiresAuth: true,
      //     title: 'Home'
      //   }
      // },
      {
        path: '',
        name: 'course',
        component: () => import(/* webpackChunkName:'course' */'@/views/course/index.vue'),
        meta: {
          requiresAuth: true,
          title: '课程管理'
        }
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName:'role' */ '@/views/role/index.vue'),
        meta: {
          requiresAuth: true,
          title: '角色管理'
        }
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName:'menu' */ '@/views/menu/index.vue'),
        meta: {
          requiresAuth: true,
          title: '菜单管理'
        }
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName:'resource' */ '@/views/resource/index.vue'),
        meta: {
          requiresAuth: true,
          title: '资源管理'
        }
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName:'course' */'@/views/course/index.vue'),
        meta: {
          requiresAuth: true,
          title: '课程管理'
        }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName:'user' */'@/views/user/index.vue'),
        meta: {
          requiresAuth: true,
          title: '用户管理'
        }
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName:'advert' */'@/views/advert/index.vue'),
        meta: {
          requiresAuth: true,
          title: '广告管理'
        }
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName:'advert-space' */'@/views/advert-space/index.vue'),
        meta: {
          requiresAuth: true,
          title: '广告位列表'
        }
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName:'menu-create' */'@/views/menu/create.vue'),
        meta: {
          requiresAuth: true,
          title: '编辑菜单'
        }
      },
      {
        path: '/resourceCategory',
        name: 'resourceCategory',
        component: () => import(/* webpackChunkName:'resourceCategory' */'@/views/resource/components/resourceCategory.vue'),
        meta: {
          requiresAuth: true,
          title: '资源分类'
        }
      },
      {
        path: '/allocMenu',
        name: 'allocMenu',
        component: () => import(/* webpackChunkName:'allocMenu' */'@/views/role/components/allocMenu.vue'),
        meta: {
          requiresAuth: true,
          title: '角色菜单管理'
        },
        // props: true // params传 将路由参数映射到组件中，组件名和路由名保持一一致allocMenu
        props: (route) => ({ roleId: route.query.roleId })// query传参 将路由参数映射到组件中，组件名和路由名保持一一致allocMenu
      },
      {
        path: '/allocResource',
        name: 'allocResource',
        component: () => import(/* webpackChunkName:'allocResource' */'@/views/role/components/allocResource.vue'),
        meta: {
          requiresAuth: true,
          title: '角色资源管理'
        },
        props: (route) => ({ roleId: route.query.roleId })// query传参 将路由参数映射到组件中，组件名和路由名保持一一致allocMenu
      },
      {
        path: '/course/edit',
        name: 'course_edit',
        component: () => import(/* webpackChunkName:'course_edit' */'@/views/course/components/edit.vue'),
        meta: {
          requiresAuth: true,
          title: '课程编辑'
        },
        props: (route) => ({ courseId: route.query.courseId })
      },
      {
        path: '/course/:courseId/section',
        name: 'course_section',
        component: () => import(/* webpackChunkName:'course_section' */'@/views/course/components/section.vue'),
        meta: {
          requiresAuth: true,
          title: '内容管理'
        },
        props: true
      },
      {
        path: '/course/:courseId/vedio',
        name: 'course_video',
        component: () => import(/* webpackChunkName:'course_video' */'@/views/course/components/video.vue'),
        meta: {
          requiresAuth: true,
          title: '上传视频'
        },
        props: true
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName:'advert-space' */'@/components/exception/404.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  routes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 只要有一级路由需要身份认证，就需要验证登录状态
    if (!store.state.user.user) {
      Notification({
        title: '重新登录',
        message: '用户信息失效'
      })
      next({
        name: 'login',
        query: {
          redirect: to.fullPath // 把登录成功需要返回的页面告诉登录页面
        }
      })
    } else {
      next() // 允许通过
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router
