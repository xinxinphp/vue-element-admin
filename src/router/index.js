import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html#配置项
 *
 * hidden: true                   //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1 (默认 false)

 //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 //只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 //若你想不管路由下面的 children 声明的个数都显示你的根路由
 //你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由

 * alwaysShow: true               if set true, will always show the root menu
 *
 * redirect: noRedirect           //当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    //设置该路由进入的权限，支持多个权限叠加
    title: 'title'               //设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             //设置该路由的图标
    noCache: true                //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    affix: true                  //如果设置True,这个tag将要固定在tags-view中
    breadcrumb: false            //如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/example/list'  如果设置路径,侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
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
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/documents',
    component: Layout,
    redirect: '/documents/purchaseOrder',
    alwaysShow: true, // will always show the root menu
    name: 'Documents',
    meta: {
      title: '单据',
      icon: 'documentation'
    },
    children: [
      {
        path: 'purchaseOrder',
        component: () => import('@/views/documents/purchaseOrder'),
        name: 'PurchaseOrder',
        meta: {
          title: '采购订单'
        }
      },
      {
        path: 'receiptOrders',
        component: () => import('@/views/documents/receiptOrders'),
        name: 'ReceiptOrders',
        meta: {
          title: '收货单'
        }
      },
      {
        path: 'inspection',
        component: () => import('@/views/documents/inspection'),
        name: 'Inspection',
        meta: {
          title: '质检'
        }
      },
      {
        path: 'orderItemList',
        component: () => import('@/views/documents/orderItemList'),
        name: 'OrderItemList',
        meta: {
          title: '生产订单'
        }
      },
      {
        path: 'ladingOrders',
        component: () => import('@/views/documents/ladingOrders'),
        name: 'LadingOrders',
        meta: {
          title: '提单'
        }
      },
      {
        path: 'pickOrders',
        component: () => import('@/views/documents/pickOrders'),
        name: 'PickOrders',
        meta: {
          title: '领料单'
        }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/report/inOutDetail',
    alwaysShow: true, // will always show the root menu
    name: 'Report',
    meta: {
      title: '报表',
      icon: 'chart'
    },
    children: [
      {
        path: 'inOutDetail',
        component: () => import('@/views/report/inOutDetail'),
        name: 'InOutDetail',
        meta: {
          title: '出入库明细'
        }
      },
      {
        path: 'accountingRecords',
        component: () => import('@/views/report/accountingRecords'),
        name: 'AccountingRecords',
        meta: {
          title: 'SAP过账记录'
        }
      }
    ]
  },
  {
    path: '/masterData',
    component: Layout,
    redirect: '/masterData/factoryMaterialInfo',
    alwaysShow: true,
    name: 'MasterData',
    meta: {
      title: '主数据',
      icon: 'form'
    },
    children: [
      {
        path: 'factoryMaterialInfo',
        component: () => import('@/views/masterData/factoryMaterialInfo'),
        name: 'FactoryMaterialInfo',
        meta: {
          title: '工厂物料管理'
        }
      },
      {
        path: 'labelQuery',
        component: () => import('@/views/masterData/labelQuery'),
        name: 'LabelQuery',
        meta: {
          title: '标签查询'
        }
      },
      {
        path: 'labelFreeze',
        component: () => import('@/views/masterData/labelFreeze'),
        name: 'LabelFreeze',
        meta: {
          title: '标签冻结'
        }
      },
      {
        path: 'supplierLabelQuery',
        component: () => import('@/views/masterData/supplierLabelQuery'),
        name: 'SupplierLabelQuery',
        meta: {
          title: '供应商标签查询'
        }
      }
    ]
  },
  {
    path: '/print',
    component: Layout,
    redirect: '/print/purchaseOrder',
    alwaysShow: true, // will always show the root menu
    name: 'Print',
    meta: {
      title: '标签打印',
      icon: 'pdf'
    },
    children: [
      {
        path: 'printingWithOrders',
        component: () => import('@/views/print/printingWithOrders'),
        name: 'PrintingWithOrders',
        meta: {
          title: '有订单打印'
        }
      },
      {
        path: 'printingWithoutOrder',
        component: () => import('@/views/print/printingWithoutOrder'),
        name: 'PrintingWithoutOrder',
        meta: {
          title: '无订单打印'
        }
      },
      {
        path: 'supplierPrint',
        component: () => import('@/views/print/supplierPrint'),
        name: 'SupplierPrint',
        meta: {
          title: '供应商打码'
        }
      },
      {
        path: 'missedPatches',
        component: () => import('@/views/print/missedPatches'),
        name: 'MissedPatches',
        meta: {
          title: '漏打补打'
        }
      }
    ]
  },
  {
    path: '/organization',
    component: Layout,
    redirect: '/organization/factory',
    alwaysShow: true, // will always show the root menu
    name: 'Organization',
    meta: {
      title: '组织架构管理',
      icon: 'tree'
    },
    children: [
      {
        path: 'factory',
        component: () => import('@/views/organization/factory'),
        name: 'Factory',
        meta: {
          title: '工厂管理'
        }
      },
      {
        path: 'warehouses',
        component: () => import('@/views/organization/warehouses'),
        name: 'Warehouses',
        meta: {
          title: '仓库管理'
        }
      },
      {
        path: 'warehouseAreas',
        component: () => import('@/views/organization/warehouseAreas'),
        name: 'WarehouseAreas',
        meta: {
          title: '库区管理'
        }
      },
      {
        path: 'spots',
        component: () => import('@/views/organization/spots'),
        name: 'Spots',
        meta: {
          title: '货位管理'
        }
      },
      {
        path: 'productionLines',
        component: () => import('@/views/organization/productionLines'),
        name: 'ProductionLines',
        meta: {
          title: '产线管理'
        }
      }
    ]
  },
  {
    path: '/authority',
    component: Layout,
    redirect: '/authority/users',
    alwaysShow: true, // will always show the root menu
    name: 'Authority',
    meta: {
      title: '权限管理',
      icon: 'lock'
    },
    children: [
      {
        path: 'users',
        component: () => import('@/views/authority/users'),
        name: 'Users',
        meta: {
          title: '用户管理'
        }
      },
      {
        path: 'roles',
        component: () => import('@/views/authority/roles'),
        name: 'Roles',
        meta: {
          title: '角色管理'
        }
      },
      {
        path: 'menus',
        component: () => import('@/views/authority/menus'),
        name: 'Menus',
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: 'changePassword',
        component: () => import('@/views/authority/changePassword'),
        name: 'ChangePassword',
        hidden: true,
        meta: {
          title: '修改密码'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
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
