/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const feeRouter = {
  path: '/fee/pay',
  component: Layout,
  name: 'Member',
  redirect: '/fee/pay',
  meta: {
    title: '费用实收管理',
    icon: 'member',
  },
  children: [{
    path: '/fee/pay',
    component: () =>
      import('@/views/fee/pay'),
    name: 'fee',
    meta: {
      title: '费用实收管理',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
 
  ]
}

export default feeRouter
