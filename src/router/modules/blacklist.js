/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const blacklistRouter = {
  path: '/blacklist/blackAdmin',
  component: Layout,
  redirect: '/blacklist/blackAdmin',
  name: 'Member',
  meta: {
    title: '黑名单管理',
    icon: 'blacklist',
  },
  children: [{
    path: '/blacklist/blackAdmin',
    component: () =>
      import('@/views//blacklist'),
    name: 'blacklist',
    meta: {
      title: '黑名单管理',
      roles: ['admin'] // or you can only set roles in sub nav
    }
  },
  ]
}

export default blacklistRouter
