/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const insideRouter = {
  path: '/inside-admin',
  component: Layout,
  redirect: '/inside-admin/shop',
  name: 'Member',
  meta: {
    title: '内部管理',
    icon: 'member',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [{
    path: '/inside-admin/branch',
    component: () =>
      import('@/views/inside-admin/branch'),
    name: 'branch',
    meta: {
      title: '分公司管理',
      roles: ['admin'] // or you can only set roles in sub nav
    }
  },
  {
    path: '/inside-admin/shop',
    component: () =>
      import('@/views/inside-admin/shop'),
    name: 'shop',
    meta: {
      title: '分店管理',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/inside-admin/cycle',
    component: () =>
      import('@/views/inside-admin/cycle'),
    name: 'cycle',
    meta: {
      title: '周期管理',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/inside-admin/file',
    component: () =>
      import('@/views/inside-admin/file'),
    name: 'file',
    meta: {
      title: '档口档案管理',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  ]
}

export default insideRouter
