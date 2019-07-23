import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist没有重定向白名单,不进行权限验证

router.beforeEach(async(to, from, next) => {
  // console.log('%c 路由 beforeEach, 路游开始进入,逻辑处理', 'background:#ccc;color:red')
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    // console.log('发现了ToKen--用户已登陆')
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      // console.log('发现了ToKen--用户已登陆')
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断用户是否具有获得他的许可通过getInfo角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // console.log('%c 已在--VUEX中-已获取 角色', 'color:#0000EE', store.getters.roles, store.getters.roles.length)
        next()
      } else {
        try {
          // get user info
          // note: 角色必须是一个对象数组。如: ['admin'] or ,['developer','editor']
          // console.log('%c 未在--VUEX中-已获取 角色', 'color:#FF7F00', store.getters.roles, store.getters.roles.length)
          const getInfoData = await store.dispatch('user/getInfo')
          const { roles } = getInfoData.user

          // generate accessible routes map based on roles 生成基于角色访问的路游
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes 动态添加路游导航
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          alert('路游捕获异常')
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // console.log('没有发现 ToKen', whiteList, to.path)
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  // console.log('%c 路由 afterEach, 路游已经完全进入', 'background:#ccc;color:red')
  NProgress.done()
})
