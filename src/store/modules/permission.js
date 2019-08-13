import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
function filterRoutes(asyncRoutes, roles) {
  const res = []
  roles.forEach(temp => {
    const tem = { ...temp }
    asyncRoutes.forEach(item => {
      const ilist = { ...item }
      ilist.meta ? '' : ilist.meta = {}
      if ((tem.title === ilist.meta.title) && (tem.path === ilist.path)) {
        res.push(item)
        if (tem.children) {
          item.children = filterRoutes(ilist.children, tem.children)
        }
      }
    })
  })
  return res
}
// function filterRoutes(asyncRoutes, roles) {
//   console.log(asyncRoutes, roles, 888999)
//   const res = []
//   roles.forEach(route => {
//     const tmp = { ...route }
//     if (tmp.children) {
//       tmp.meta = {
//         title: tmp.title,
//         icon: tmp.icon
//       }
//       tmp.children = filterRoutes(asyncRoutes, tmp.children)
//     } else {
//       tmp.meta = {
//         title: tmp.title
//       }
//     }
//     res.push(tmp)
//   })
//   return res
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      let accessedRoutes2
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        accessedRoutes2 = filterRoutes(asyncRoutes, roles) // 新曾对比
      }
      commit('SET_ROUTES', accessedRoutes2)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
