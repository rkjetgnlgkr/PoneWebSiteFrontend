export const state = () => ({
  token: null,
  username: null
})

export const mutations = {
  SET_AUTH (state, { token, username }) {
    state.token = token
    state.username = username
    if (process.client) {
      localStorage.setItem('token', token)
      localStorage.setItem('username', username)
    }
  },
  CLEAR_AUTH (state) {
    state.token = null
    state.username = null
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    }
  },
  RESTORE_AUTH (state) {
    if (process.client) {
      const token = localStorage.getItem('token')
      const username = localStorage.getItem('username')
      if (token) {
        state.token = token
        state.username = username
      }
    }
  }
}

export const actions = {
  nuxtClientInit ({ commit }) {
    commit('RESTORE_AUTH')
  }
}

export const getters = {
  isLoggedIn: state => !!state.token
}
