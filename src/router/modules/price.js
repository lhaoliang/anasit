/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const priceRouter = {
  path: '/layout/price',
  component: Layout,
  name: 'Member',
  redirect: '/layout/price',
  meta: {
    title: '布局定价计划管理',
    icon: 'member',
  },
  children: [{
    path: '/layout/price',
    component: () =>
      import('@/views/price'),
    name: 'branch',
    meta: {
      title: '布局定价计划管理',
      roles: ['admin'] // or you can only set roles in sub nav
    }
  },
 
  ]
}

export default priceRouter
