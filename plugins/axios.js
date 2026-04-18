export default function ({ $axios, store, redirect }) {
  // 請求攔截：自動帶上 token
  $axios.onRequest(config => {
    const token = store.state.token
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  })

  // 回應攔截：處理 401 未授權
  $axios.onResponseError(error => {
    if (error.response && error.response.status === 401) {
      store.commit('CLEAR_AUTH')
      redirect('/login')
    }
    return Promise.reject(error)
  })
}
