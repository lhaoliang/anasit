/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const checkRouter = {
  path: '/check',
  component: Layout,
  redirect: '/check/list',
  name: 'Member',
  meta: {
    title: '检查管理',
    icon: 'member',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [{
    path: '/check/list',
    component: () =>
      import('@/views/check/list'),
    name: 'list',
    meta: {
      title: '检查表管理',
      roles: ['admin'] // or you can only set roles in sub nav
    }
  },
  {
    path: '/check/record',
    component: () =>
      import('@/views/check/record'),
    name: 'record',
    meta: {
      title: '检查打分记录',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/check/total-record',
    component: () =>
      import('@/views/check/total-record'),
    name: 'record',
    meta: {
      title: '检查打分记录',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/check/no-record',
    component: () =>
      import('@/views/check/no-record'),
    name: 'record',
    meta: {
      title: '检查打分记录',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/check/item',
    component: () =>
      import('@/views/check/item'),
    name: 'item',
    meta: {
      title: '检查项分类',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/check/check-detail/:id',
    component: () =>
      import('@/views/check/check-detail'),
    name: 'item',
    meta: {
      title: '预览',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/check/record-detail/:id',
    component: () =>
      import('@/views/check/record-detail'),
    name: 'item',
    meta: {
      title: '预览',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/check/item-detail',
    component: () =>
      import('@/views/check/item-detail'),
    name: 'item',
    meta: {
      title: '预览',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/check/add-item',
    component: () =>
      import('@/views/check/add-item'),
    name: 'item',
    meta: {
      title: '检查项',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/check/sort',
    component: () =>
      import('@/views/check/sort'),
    name: 'sort',
    meta: {
      title: '检查打分排行',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/check/sort-total',
    component: () =>
      import('@/views/check/sort-total'),
    name: 'sort',
    meta: {
      title: '检查打分排行',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  ]
}

export default checkRouter
