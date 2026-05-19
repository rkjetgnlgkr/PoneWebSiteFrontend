<template>
  <div class="callback-page">
    <div class="callback-card">
      <i v-if="!error" class="el-icon-loading callback-icon" />
      <i v-else class="el-icon-circle-close callback-icon error" />
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LineCallbackPage',
  layout: 'login',
  data () {
    return {
      message: 'LINE 登入處理中...',
      error: false
    }
  },
  async created () {
    const { code, state, error } = this.$route.query

    if (error) {
      this.error = true
      this.message = 'LINE 登入已取消'
      setTimeout(() => this.$router.push('/login'), 2000)
      return
    }

    const savedState = sessionStorage.getItem('line_oauth_state')
    if (!state || state !== savedState) {
      this.error = true
      this.message = 'LINE 登入驗證失敗（state 不符）'
      setTimeout(() => this.$router.push('/login'), 2000)
      return
    }
    sessionStorage.removeItem('line_oauth_state')

    if (!code) {
      this.error = true
      this.message = 'LINE 登入失敗，缺少授權碼'
      setTimeout(() => this.$router.push('/login'), 2000)
      return
    }

    try {
      const redirectUri = `${window.location.origin}/line-callback`
      const res = await this.$axios.post('/auth/line', { code, redirectUri })
      if (res.data.code === 200) {
        this.$store.commit('SET_AUTH', {
          token: res.data.data.token,
          username: res.data.data.username
        })
        this.message = 'LINE 登入成功，跳轉中...'
        this.$router.push('/portfolio')
      } else {
        throw new Error(res.data.message || 'LINE 登入失敗')
      }
    } catch (err) {
      this.error = true
      this.message = err.response?.data?.message || err.message || 'LINE 登入失敗，請稍後再試'
      setTimeout(() => this.$router.push('/login'), 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
.callback-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
}

.callback-card {
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

  p {
    margin-top: 16px;
    font-size: 15px;
    color: #606266;
  }
}

.callback-icon {
  font-size: 48px;
  color: #06C755;

  &.error {
    color: #f56c6c;
  }
}
</style>
