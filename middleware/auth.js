export default function ({ store, redirect, route }) {
  // 從 localStorage 還原 auth 狀態（SPA 模式）
  store.commit('RESTORE_AUTH')

  const isLoggedIn = store.getters.isLoggedIn

  // 根路徑永遠轉導：未登入 → /login，已登入 → /portfolio
  if (route.path === '/') {
    return redirect(isLoggedIn ? '/portfolio' : '/login')
  }

  const isLoginPage = route.path === '/login'

  if (!isLoggedIn && !isLoginPage) {
    return redirect('/login')
  }

  if (isLoggedIn && isLoginPage) {
    return redirect('/portfolio')
  }
}
