import Vue from 'vue'
import store from '@/store/index.js'
import VueRouter from 'vue-router'
import MainPage from '@/views/MainPage.vue'
import AppDrawer from '@/views/MainPage/AppDrawer.vue'
import AppFooter from '@/views/MainPage/AppFooter.vue'
import AppNavBar from '@/views/MainPage/AppNavBar.vue'
import ManagePage from '@/views/ManagePage.vue'
import ManageNavBar from '@/views/ManagePage/ManageNavBar.vue'
import ManageNavDrawer from '@/views/ManagePage/ManageDrawer.vue'
import {userLogout} from '@/assets/js/account.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: {name: 'Main'}
  },
  {
    path: '/:shortURL@',
    name: 'LinkCheck'
  },
  {
    path: '/main',
    components:  {
      default: MainPage,
      navBar: AppNavBar,
      drawer: AppDrawer,
      footer: AppFooter
    },
    children: [
      {
        path: '',
        name: 'Main',
        component: () => import(/* webpackChunkName: "main" */ '@/views/MainPage/MainHome.vue'),
      },
      {
        path: 'api',
        name: 'MainAPI',
        component: () => import(/* webpackChunkName: "main" */ '@/views/MainPage/MainAPI.vue'),
      },
      {
        path: 'contact',
        name: 'MainContact',
        component: () => import(/* webpackChunkName: "main" */ '@/views/Contact.vue'),
      },
      {
        path: ':shortURL@',
        name: 'MainLinkCheck',
        component: () => import(/* webpackChunkName: "main" */ '@/views/LinkCheck.vue'),
      },
      {
        path: 'test',
        name: 'MainTest',
        component: () => import(/* webpackChunkName: "main" */ '@/components/Manage/StatisticsWindow.vue'),
      }
    ],
  },
  {
    path: '/manage',
    components: {
      default: ManagePage,
      navBar: ManageNavBar,
      drawer: ManageNavDrawer
    },
    children: [
      {
        path: '',
        name: 'Manage',
        component: () => import(/* webpackChunkName: "manageHome" */ '@/views/ManagePage/ManageHome.vue')
      },
      {
        path: 'favorite',
        name: 'ManageFavorite',
        component: () => import(/* webpackChunkName: "manageSub" */ '@/views/ManagePage/ManageFavorite.vue')
      },
      {
        path: 'tag',
        name: 'ManageTag',
        component: () => import(/* webpackChunkName: "manageSub" */ '@/views/ManagePage/ManageTag.vue')
      },
      {
        path: 'hidden',
        name: 'ManageHide',
        component: () => import(/* webpackChunkName: "manageSub" */ '@/views/ManagePage/ManageHide.vue')
      },
      {
        path: ':shortURL@',
        name: 'ManageLinkCheck',
        component: () => import(/* webpackChunkName: "manageLinkCheck" */ '@/views/LinkCheck.vue')
      },
      {
        path: 'test',
        name: 'ManageTest',
        component: () => import(/* webpackChunkName: "manage" */ '@/components/Manage/StatisticsWindow.vue')
      },
      {
        path: 'contact',
        name: 'ManageContact',
        component: () => import(/* webpackChunkName: "manage" */ '@/views/Contact.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach(function(to, from, next) {
  const loggedIn = store.state.userInfo.loggedIn
  const expiresAt = store.state.userInfo.expiresAt
  const loggedInPath = { name: 'Manage' }
  const defaultPath = { name: 'Main' }

  // ????????? ????????? ????????? ?????? ?????? ????????????
  if (expiresAt) {
    const now = new Date().getTime()

    if (now >= expiresAt) {
      userLogout()
      next(defaultPath)
      
      return
    }
  }

  // ??????????????? ??????
  if (to.matched.some(record => record.name === 'Home')) {
    //???????????? ????????? Manage???, ????????? Main?????? ?????????.
    if (loggedIn) next(loggedInPath)
    else next(defaultPath)

    return
  } else if (to.matched.some(record => record.name === 'LinkCheck')) {
    // LinkCheck ???????????? ??????
    // ????????? ????????? ?????? Main/Manage ?????? ???????????? ?????????.
    const shortURL = to.params.shortURL

    if (loggedIn) next({name: 'ManageLinkCheck', params:{shortURL} })
    else {
      const mainModule = store.state.moduleNames['main']

      store.commit(mainModule + '/setTabIndex', NaN)    // ??? ?????? ??????
      next({name: 'MainLinkCheck', params:{shortURL} })
    }

    return
  }
  
  // ???????????? ????????? Manage???, ????????? Main?????? ?????????.
  const manageReg = /\/manage.*/
  const mainReg = /\/main.*/

  // Manage ????????? ??????
  if (manageReg.test(to.fullPath)) {
    if (loggedIn) {
      next()
    } else {
      alert("???????????? ????????? ??????????????????.")
      next(defaultPath)
    }

    return
  // Main ????????? ??????  
  } else if (mainReg.test(to.fullPath)) {
    if (loggedIn) {
      next(loggedInPath)
    } else {
      next()
    }

    return
  }

  // ????????? ???????????? ???????????? ?????? ?????? ??????
  next()
})

export default router
