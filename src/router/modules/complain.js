/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const complainRouter = {
  path: '/complain/record',
  component: Layout,
  redirect: '/complain/record',
  name: 'Member',
  meta: {
    title: '投诉管理',
    icon: 'member',
  },
  children: [{
    path: '/complain/record',
    component: () =>
      import('@/views/complain'),
    name: 'complain',
    meta: {
      title: '投诉管理',
      roles: ['admin'] // or you can only set roles in sub nav
    }
  },
  ]
}

export default complainRouter
