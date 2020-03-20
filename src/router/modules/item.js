/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const itemRouter = {
  path: '/item/gate',
  component: Layout,
  redirect: '/item/gate',
  name: 'Member',
  meta: {
    title: '项目分类管理',
    icon: 'member',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [{
    path: '/item/gate',
    component: () =>
      import('@/views/item/gateItem'),
    name: 'Item',
    meta: {
      title: '项目分类管理',
      roles: ['admin'] // or you can only set roles in sub nav
    }
  },
 
  ]
}

export default itemRouter
