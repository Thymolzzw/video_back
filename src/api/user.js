import request from '@/utils/request'

export function login(data) {
  // alert(data.username)
  let login_data = new FormData()
  login_data.append("username", data.username)
  login_data.append("password", data.password)
  return request({
    url: process.env.VUE_APP_severURL + '/doLogin',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: login_data
  })
}

export function register(data) {
  // alert(data.username)
  let login_data = new FormData()
  login_data.append("register_account_name", data.register_account_name)
  login_data.append("register_password", data.register_password)
  login_data.append("register_email", data.register_email)
  return request({
    url: process.env.VUE_APP_severURL + '/doSignUp',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: login_data
  })
}

export function getInfo(token) {
  // console.log("request")
  return request({
    url: process.env.VUE_APP_severURL + '/getUserInfo',
    method: 'get',
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
