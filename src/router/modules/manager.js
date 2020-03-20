/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const managerRouter = {
  path: '/manager',
  component: Layout,
  redirect: '/manager/list',
  name: 'Manager',
  meta: {
    title: '管理员管理',
    icon: 'manager',
  },
  children: [{
    path: '/manager/list',
    component: () =>
      import('@/views/system/manager-list'),
    name: 'managerList',
    meta: {
      title: '管理员列表',
      roles: ['admin'] // or you can only set roles in sub nav
    }
  }
  , {
    path: '/manager/setting',
    component: () =>
      import('@/views/system/manager-setting'),
    name: 'managerSetting',
    meta: {
      title: '设置',
      roles: ['admin'] // or you can only set roles in sub nav
    }
  }
 ]
}

export default managerRouter