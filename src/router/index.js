import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import insideRouter from './modules/inside'
import priceRouter from './modules/price'
import itemRouter from './modules/item'
import checkRouter from './modules/check'
import eliminationRouter from './modules/elimination'
import feeRouter from './modules/fee'
import blacklistRouter from './modules/blacklist'
import complainRouter from './modules/complain'
import noticeRouter from './modules/notice'
import dataRouter from './modules/data'
import managerRouter from './modules/manager'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

    {
        path: '/login',
        name: '登录页',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/lock',
        hidden: true,
        name: '锁屏页',
        component: () =>
            import ('@/views/lock/index')
    },

    {
        path: '',
        component: Layout,
        redirect: 'dashboard',
        children: [{
                path: 'dashboard',
                component: () =>
                    import ('@/views/dashboard/index'),
                name: 'Dashboard',
                meta: { title: 'dashboard', icon: 'dashboard', affix: true }
            },
            {
                path: 'message',
                hidden: true,
                name: '消息通知',
                component: () =>
                    import ('@/views/message/index')
            },
        ]
    },
    {
        path: '/permission',
        component: Layout,
        redirect: '/permission/page',
        alwaysShow: true, // will always show the root menu
        name: 'Permission',
        meta: {
            title: 'permission',
            icon: 'lock',
            roles: ['admin', 'editor'] // you can set roles in root nav
        },
        children: [{
                path: 'page',
                component: () =>
                    import ('@/views/permission/page'),
                name: 'PagePermission',
                meta: {
                    title: 'pagePermission',
                    roles: ['admin'] // or you can only set roles in sub nav
                }
            },
            {
                path: 'menubar',
                component: () =>
                    import ('@/views/permission-setting/menu-bar'),
                name: 'DirectivePermission',
                meta: {
                    title: 'directivePermission'
                        // if do not set roles, means: this page does not require permission
                }
            }
        ]
    },
    insideRouter,
    checkRouter,
    priceRouter,
    itemRouter,
    eliminationRouter,
    feeRouter,
    blacklistRouter,
    complainRouter,
    noticeRouter,
    dataRouter,
    managerRouter
]

const createRouter = () => new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router