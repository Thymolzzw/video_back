import { login, logout, getInfo, register } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import axios from "axios";

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  user_info: '',
  roles: []
}

const mutations = {
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USER_INFO: (state, user_info) => {
    state.user_info = user_info
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user register
  register({ commit }, userInfo) {
    const { register_account_name, register_password, register_email } = userInfo
    // alert(username + password)
    return new Promise((resolve, reject) => {
      register({ register_account_name: register_account_name.trim(), register_password: register_password,
        register_email: register_email}).then(response => {

          commit('SET_TOKEN', response.token)
          setToken(response.token)
          resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },


  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        commit('SET_TOKEN', response.token)
        setToken(response.token)
        resolve()
      }).catch(error => {
        reject(error)
      })

    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      let info_data = new FormData()
      info_data.append("user_id", state.token)
      sessionStorage.setItem('token', state.token)
      console.log('src/store/modules/user.js')
      getInfo(state.token).then(response => {
        if (response.data == null) {
          reject('获取用户信息失败，请重新登录！')
        }
        const user_account_name = response.data.account_name
        const roles = response.data.roles

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', user_account_name)
        commit('SET_USER_INFO', response.data)
        commit('SET_AVATAR', response.data.avatar)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })

    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

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

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
