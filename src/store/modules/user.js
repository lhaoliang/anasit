import {
  login,
  logout,
  getInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import {
  setStore,
  getStore,
  removeStore
} from '@/utils/store'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  isLock: getStore({
    name: 'isLock'
  }) || false,
  lockPasswd: getStore({
    name: 'lockPasswd'
  }) || '',
  unreadCount: 0,
  messageUnreadList: [],
  messageReadedList: [],
  messageTrashList: [],
  messageContentStore: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_LOCK_PASSWD: (state, lockPasswd) => {
    state.lockPasswd = lockPasswd
    setStore({
      name: 'lockPasswd',
      content: state.lockPasswd,
      type: 'session'
    })
  },
  SET_LOCK: (state, action) => {
    state.isLock = true
    setStore({
      name: 'isLock',
      content: state.isLock,
      type: 'session'
    })
  },
  CLEAR_LOCK: (state, action) => {
    state.isLock = false
    state.lockPasswd = ''
    removeStore({
      name: 'lockPasswd'
    })
    removeStore({
      name: 'isLock'
    })
  },
  setMessageCount(state, count) {
    state.unreadCount = count
  },
  setMessageUnreadList(state, list) {
    state.messageUnreadList = list
  },
  setMessageReadedList(state, list) {
    state.messageReadedList = list
  },
  setMessageTrashList(state, list) {
    state.messageTrashList = list
  },
  updateMessageContentStore(state, { msg_id, content }) {
    state.messageContentStore[msg_id] = content
  },
  moveMsg(state, { from, to, msg_id }) {
    const index = state[from].findIndex(_ => _.msg_id === msg_id)
    const msgItem = state[from].splice(index, 1)[0]
    msgItem.loading = false
    state[to].unshift(msgItem)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // set lock screen passwd
  lockScreen({ commit }, lockPasswd) {
    return new Promise(resolve => {
      commit('SET_LOCK_PASSWD', lockPasswd)
      commit('SET_LOCK', '')
      resolve()
    })
  },

  // unlock screen
  unlockScreen({ commit }) {
    return new Promise(resolve => {
      commit('CLEAR_LOCK', '')
      resolve()
    })
  },


  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  },
  // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
  getUnreadMessageCount({ state, commit }) {
    getUnreadCount().then(res => {
      const { data } = res
      commit('setMessageCount', data)
    })
  },
  // 获取消息列表，其中包含未读、已读、回收站三个列表
  getMessageList({ state, commit }) {
    return new Promise((resolve, reject) => {
      getMessage(state.token).then(res => {
        const { unread, readed, trash } = res.data
        commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
        commit('setMessageReadedList', readed.map(_ => {
          _.loading = false
          return _
        }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
        commit('setMessageTrashList', trash.map(_ => {
          _.loading = false
          return _
        }).sort((a, b) => new Date(b.create_time) - new Date(a.create_time)))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 根据当前点击的消息的id获取内容
  getContentByMsgId({ state, commit }, { msg_id }) {
    return new Promise((resolve, reject) => {
      let contentItem = state.messageContentStore[msg_id]
      if (contentItem) {
        resolve(contentItem)
      } else {
        getContentByMsgId(msg_id).then(res => {
          const content = res.data
          commit('updateMessageContentStore', { msg_id, content })
          resolve(content)
        })
      }
    })
  },
  // 把一个未读消息标记为已读
  hasRead({ state, commit }, { msg_id }) {
    return new Promise((resolve, reject) => {
      hasRead(msg_id).then(() => {
        commit('moveMsg', {
          from: 'messageUnreadList',
          to: 'messageReadedList',
          msg_id
        })
        commit('setMessageCount', state.unreadCount - 1)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 删除一个已读消息到回收站
  removeReaded({ commit }, { msg_id }) {
    return new Promise((resolve, reject) => {
      removeReaded(msg_id).then(() => {
        commit('moveMsg', {
          from: 'messageReadedList',
          to: 'messageTrashList',
          msg_id
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 还原一个已删除消息到已读消息
  restoreTrash({ commit }, { msg_id }) {
    return new Promise((resolve, reject) => {
      restoreTrash(msg_id).then(() => {
        commit('moveMsg', {
          from: 'messageTrashList',
          to: 'messageReadedList',
          msg_id
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
