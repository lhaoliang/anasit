/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const eliminationRouter = {
  path: '/elimination/plan',
  component: Layout,
  name: 'Member',
  redirect: '/elimination/plan',
  meta: {
    title: '淘汰计划管理',
    icon: 'member',
  },
  children: [{
    path: '/elimination/plan',
    component: () =>
      import('@/views/elimination/branchNum'),
    name: 'elimination',
    meta: {
      title: '分公司淘汰数值',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
 
  ]
}

export default eliminationRouter
