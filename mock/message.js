import Mock from 'mockjs'

const unreadList = []
const readedList = []
const trashList = []

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://file.iviewui.com/dist/a0e88e83800f138b94d2414621bd9704.png',
    name: 'Normal Editor'
  }
}

const count = 100

for (let i = 0; i < 5; i++) {
  unreadList.push(Mock.mock({
    title: '@title(5, 10)',
    create_time: '@date',
    msg_id: '@increment'
  }))
}

for (let i = 0; i < 5; i++) {
  readedList.push(Mock.mock({
    title: '@title(5, 10)',
    create_time: '@date',
    msg_id: '@increment'
  }))
}

for (let i = 0; i < 5; i++) {
  trashList.push(Mock.mock({
    title: '@title(5, 10)',
    create_time: '@date',
    msg_id: '@increment'
  }))
}

export default [
  // get message list
  {
    url: '/message/list',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: {
          unreadList,
          readedList,
          trashList
        }
      }
    }
  },
]

