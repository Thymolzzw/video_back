import request from '@/utils/request'

export function login(data) {
  return request({
    // url: process.env.VUE_APP_severURL + '/doLogin',
    url: '/vue-element-admin/user/login',
    method: 'post',
    // data: data
    data
  })
}

export function getInfo(token) {
  return request({
    // url: process.env.VUE_APP_severURL + '/getUserInfo',
    url: '/vue-element-admin/user/info',
    method: 'get',
    // param: token
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

//获取列表信息（GET）
export const queryUsers = (params) => {
  return service.post('/api/users', { _method: 'GET', _args: params })
}

//删除单条信息
export const deleteUser = (id) => {
  return service.delete(`/api/users/${id}`)
}

//更细单条信息
export const updateUser = (id, params) => {
  return service.put(`/api/users/${id}`, params)
}

//获取单条信息
export const getUser = (id) => {
  return service.get(`/api/users/${id}`)
}

//新增一条数据（POST）
export const createUser = (params) => {
  return service.post('/api/users', params)
}

export function updatePassword(data) {
  // return axios({
  //   url: `/api/user/change_password`,
  //   method: 'post',
  //   data: data
  // })
  return service.post('/api/user/change_password', data)
}
