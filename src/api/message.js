import request from '@/utils/request'

export function getMessage (token) {
  return request({
    url: '/message/list',
    method: 'get',
    params: { token }
  })
}
