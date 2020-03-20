const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  isLock: state => state.user.isLock,
  lockPasswd: state => state.user.lockPasswd,
  messageUnreadList: state => state.user.messageUnreadList,
  messageReadedList: state => state.user.messageReadedList,
  messageTrashList: state => state.user.messageTrashList,
  messageUnreadCount: state => state.user.messageUnreadCount,
  messageReadedCount: state => state.user.messageReadedCount,
  messageTrashCount: state => state.user.messageTrashCount,


}
export default getters
