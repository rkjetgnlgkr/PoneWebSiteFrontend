export default function ({ store, redirect, route }) {
  // 從 localStorage 還原 auth 狀態（SPA 模式）
  store.commit('RESTORE_AUTH')

  const isLoggedIn = store.getters.isLoggedIn
  const isLoginPage = route.path === '/login' || route.path === '/'

  if (!isLoggedIn && !isLoginPage) {
    return redirect('/login')
  }

  if (isLoggedIn && isLoginPage) {
    return redirect('/portfolio')
  }
}
