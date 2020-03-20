/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const noticeRouter = {
  path: '/notice/message',
  component: Layout,
  redirect: '/notice/message',
  name: 'Member',
  meta: {
    title: '通知管理',
    icon: 'member',
  },
  children: [{
    path: '/notice/message',
    component: () =>
      import('@/views/notice'),
    name: 'notice',
    meta: {
      title: '消息管理',
      roles: ['admin'] // or you can only set roles in sub nav
    }
  },
  {
    path: '/notice/list',
    component: () =>
      import('@/views/notice-list'),
    name: 'notice',
    meta: {
      title: '消息列表',
      roles: ['admin'] // or you can only set roles in sub nav
    }
  },
  ]
}

export default noticeRouter
