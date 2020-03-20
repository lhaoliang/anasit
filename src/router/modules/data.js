/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const dataRouter = {
  path: '/data',
  component: Layout,
  redirect: '/data/number',
  name: 'Member',
  meta: {
    title: '数据统计',
    icon: 'member',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [{
    path: '/data/number',
    component: () =>
      import('@/views/data/number'),
    name: 'number',
    meta: {
      title: '数值统计分析',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/data/number-single',
    component: () =>
      import('@/views/data/number-single'),
    name: 'number',
    meta: {
      title: '数值统计分析',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/data/number-area',
    component: () =>
      import('@/views/data/number-area'),
    name: 'number',
    meta: {
      title: '数值统计分析',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/data/singleItem',
  component: () =>
    import('@/views/data/singleItem'),
  name: 'singleItem',
  meta: {
    title: '单项目数值',
    roles: ['admin'] // or you can only set roles in sub nav
  }
},
  {
    path: '/data/project',
    component: () =>
      import('@/views/data/project'),
    name: 'project',
    meta: {
      title: '项目统计分析',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/data/flow',
    component: () =>
      import('@/views/data/flow'),
    name: 'project',
    meta: {
      title: '项目统计分析',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
 
  {
    path: '/data/area',
    component: () =>
      import('@/views/data/area'),
    name: 'project',
    meta: {
      title: '项目统计分析',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  {
    path: '/data/project-detail',
    component: () =>
      import('@/views/data/project-detail'),
    name: 'item',
    meta: {
      title: '详情',
      roles: ['admin'] // or you can only set roles in sub nav
    },
  },
  ]
}

export default dataRouter
