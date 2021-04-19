import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'


export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/test_index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/main/index2'),
        name: '主页-轮播图',
        meta: { title: '主页-轮播图', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/hotPoint',
    component: Layout,
    children: [
      {
        path: 'hotPoint',
        component: () => import('@/views/hotPoint/index'),
        name: '热点视频',
        meta: { title: '热点视频', icon: 'guide' }
      }
    ]
  },
  {
    path: '/video_classification',
    component: Layout,
    name: 'video_classification',
    meta: {
      title: '视频分类',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'shizhan',
        component: () => import('@/views/video_classification/shizhan'),
        name: 'shizhan',
        meta: { title: '实战', icon: 'edit' }
      },
      {
        path: 'yanxi',
        component: () => import('@/views/video_classification/yanxi'),
        name: 'yanxi',
        meta: { title: '演习', icon: 'edit' }
      },
      {
        path: 'yantao',
        component: () => import('@/views/video_classification/yantao'),
        name: 'yantao',
        meta: { title: '研讨', icon: 'edit' }
      },
      {
        path: 'guanjianrenwu',
        component: () => import('@/views/video_classification/guanjianrenwu'),
        name: 'guanjianrenwu',
        meta: { title: '关键人物', icon: 'edit' }
      }
    ]
  },
  {
    path: '/search',
    component: Layout,
    children: [
      {
        path: 'search',
        component: () => import('@/views/search/new_index'),
        name: '视频搜索',
        meta: { title: '视频搜索', icon: 'link' }
      }
    ]
  },
  {
    path: '/functions',
    component: Layout,
    // redirect: '/example/list',
    name: 'functions',
    meta: {
      title: '功能模块',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'face',
        component: () => import('@/views/functions/face'),
        name: 'face',
        meta: { title: '人脸识别', icon: 'edit' }
      },

      {
        path: 'mubiaojianceyushibie',
        component: () => import('@/views/functions/mubiaojianceyushibie'),
        name: 'mubiaojianceyushibie',
        meta: { title: '目标检测与识别', icon: 'edit' }
      },
      {
        path: 'yantaochangjing',
        component: () => import('@/views/functions/yantaochangjing'),
        name: 'yantaochangjing',
        meta: { title: '研讨场景PPT识别', icon: 'edit' }
      },
      {
        path: 'ziranchangjing_text',
        component: () => import('@/views/functions/ziranchangjing_text'),
        name: 'ziranchangjing_text',
        meta: { title: '自然场景文本识别', icon: 'edit' }
      },
      {
        path: 'yuyinshibie',
        component: () => import('@/views/functions/yuyinshibie'),
        name: 'yuyinshibie',
        meta: { title: '语音识别', icon: 'edit' }
      },
      {
        path: 'shengwen',
        component: () => import('@/views/functions/shengwen'),
        name: 'shengwen',
        meta: { title: '声纹识别', icon: 'edit' }
      }
    ]
  },
  {
    path: '/player',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'videoPlayer',
        component: () => import('@/views/videoPlayer/copy_tencent'),
        name: '视频播放详情页',
        meta: { title: '视频播放详情页', icon: 'star' }
      }
    ]
  },

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [


//
//   /** when your routing map is too long, you can split it into small modules **/
//   componentsRouter,
//   chartsRouter,
//   nestedRouter,
//   tableRouter,

  {
    path: '/admin_functions',
    component: Layout,
    // redirect: '/example/list',
    name: 'admin_functions',
    meta: {
      title: '数据修改',
      icon: 'el-icon-s-help',
      roles: ['admin', 'editor', 'visitor']
    },
    children: [
      {
        path: 'videoUpload',
        component: () => import('@/views/videoUpload/fake'),
        name: '视频上传',
        meta: { title: '视频上传', icon: 'link' }
      },

      {
        path: 'videoCtrl',
        component: () => import('@/views/admin_functions/videoCtrl'),
        name: '视频管理',
        meta: { title: '视频管理', icon: 'link' }
      },
      {
        path: 'video_info',
        component: () => import('@/views/admin_functions/video_info'),
        name: '视频信息修改',
        meta: { title: '视频信息修改', icon: 'link' }
      },

      {
        path: 'face',
        component: () => import('@/views/admin_functions/face'),
        name: 'face',
        meta: { title: '人脸识别管理', icon: 'edit' }
      },
      {
        path: 'mubiaojianceyushibie',
        component: () => import('@/views/admin_functions/mubiaojianceyushibie'),
        name: 'mubiaojianceyushibie',
        meta: { title: '目标检测与识别管理', icon: 'edit' }
      },
      {
        path: 'yantaochangjing',
        component: () => import('@/views/admin_functions/yantaochangjing'),
        name: 'yantaochangjing',
        meta: { title: '研讨场景PPT识别管理', icon: 'edit' }
      },
      {
        path: 'ziranchangjing_text',
        component: () => import('@/views/admin_functions/ziranchangjing_text'),
        name: 'ziranchangjing_text',
        meta: { title: '自然场景文本识别管理', icon: 'edit' }
      },
      {
        path: 'yuyinshibie',
        component: () => import('@/views/admin_functions/yuyinshibie'),
        name: 'yuyinshibie',
        meta: { title: '语音识别管理', icon: 'edit' }
      },
      {
        path: 'voiceprintmanage',
        component: () => import('@/views/admin_functions/voiceprintmanage'),
        name: 'voiceprintmanage',
        meta: { title: '声纹识别管理', icon: 'edit' }
      },
      {
        path: 'resourcemanage',
        component: () => import('@/views/admin_functions/resourcemanage'),
        name: 'resourcemanage',
        meta: { title: '视频源管理', icon: 'edit' }
      },
      {
        path: 'countrymanage',
        component: () => import('@/views/admin_functions/countrymanage'),
        name: 'countrymanage',
        meta: { title: '来源国家管理', icon: 'edit' }
      },
      {
        path: 'people_relation_manage',
        component: () => import('@/views/admin_functions/people_relation_manage'),
        name: 'test',
        meta: { title: '人物关系管理', icon: 'edit' }
      },
      {
        path: 'test',
        component: () => import('@/views/admin_functions/test'),
        name: 'test',
        meta: { title: 'test', icon: 'edit' }
      }
    ]
  },

  {
    path: '/manage',
    component: Layout,
    // redirect: '/example/list',
    name: 'manage',
    meta: {
      title: '系统管理',
      icon: 'el-icon-s-help',
      roles: ['admin']
    },
    children: [
      {
        path: 'users',
        component: () => import('@/views/manage/user_temp'),
        name: 'users',
        meta: { title: '人员管理', icon: 'edit' }
      },
      // {
      //   path: 'messge_origin',
      //   component: () => import('@/views/manage/messge_origin'),
      //   name: 'messge_origin',
      //   meta: { title: '信息源管理', icon: 'edit' }
      // },
      // {
      //   path: 'data_pool',
      //   component: () => import('@/views/manage/data_pool'),
      //   name: 'data_pool',
      //   meta: { title: '数据池管理', icon: 'edit' }
      // },
      {
        path: 'people',
        component: () => import('@/views/manage/people'),
        name: 'people',
        meta: { title: '人物管理', icon: 'edit' }
      },
      // {
      //   path: 'video_data',
      //   component: () => import('@/views/manage/video_data'),
      //   name: 'video_data',
      //   meta: { title: '视频分析结果管理', icon: 'edit' }
      // },
      // {
      //   path: 'products',
      //   component: () => import('@/views/manage/products'),
      //   name: 'products',
      //   meta: { title: '产品管理', icon: 'edit' }
      // },
      // {
      //   path: 'user_log',
      //   component: () => import('@/views/manage/user_log'),
      //   name: 'user_log',
      //   meta: { title: '用户操作记录管理', icon: 'edit' }
      // },
      {
        path: 'power',
        component: () => import('@/views/manage/power'),
        name: 'power',
        meta: { title: '权限管理', icon: 'edit' }
      }
    ]
  },



  // 404 page must be placed at the end !!!

  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
