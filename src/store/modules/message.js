import {
  getMessage
} from '@/api/message'
import { getToken } from '@/utils/auth'

const state = {
  token: getToken(),
  unreadCount: 0,
  messageUnreadList: [],
  messageReadedList: [],
  messageTrashList: [],
  messageContentStore: {}
}

const mutations = {
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
        commit('setMessageUnreadList', res.data.unreadList)
        commit('setMessageReadedList', res.data.readedList)
        commit('setMessageTrashList', res.data.trashList)
        resolve(res)
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
