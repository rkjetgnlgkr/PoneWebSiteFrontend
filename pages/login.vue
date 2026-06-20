<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <i class="el-icon-collection" />
        </div>
        <h2>作品集管理系統</h2>
        <p>請登入您的帳號</p>
      </div>

      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        class="login-form"
        @keyup.enter.native="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="請輸入帳號"
            prefix-icon="el-icon-user"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="請輸入密碼"
            prefix-icon="el-icon-lock"
            show-password
            size="large"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          {{ loading ? '登入中...' : '登入' }}
        </el-button>

        <div class="register-link">
          <span>還沒有帳號？</span>
          <el-button type="text" @click="openRegisterModal">立即註冊</el-button>
        </div>

        <div class="divider">
          <span>或</span>
        </div>

        <div id="google-signin-btn" class="google-btn-wrapper" />

        <button type="button" class="line-login-btn" @click="handleLineLogin">
          <svg class="line-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="10" fill="white"/>
            <path d="M24 8C15.163 8 8 14.328 8 22.084c0 6.996 6.204 12.854 14.594 13.896.568.122 1.342.374 1.538.858.176.44.115 1.13.056 1.576l-.248 1.494c-.076.44-.35 1.724 1.51.94 1.858-.786 10.02-5.9 13.672-10.1C41.614 27.73 40 24.998 40 22.084 40 14.328 32.837 8 24 8z" fill="#06C755"/>
            <path d="M20.5 25.5h-3a.5.5 0 01-.5-.5v-7a.5.5 0 011 0v6.5h2.5a.5.5 0 010 1zM22.5 25a.5.5 0 01-1 0v-7a.5.5 0 011 0v7zM30.5 25a.5.5 0 01-.4.49L26 19.63V25a.5.5 0 01-1 0v-7a.5.5 0 01.9-.31l4.1 5.86V18a.5.5 0 011 0v7zM35.5 20.5h-2.5V22h2.5a.5.5 0 010 1h-2.5v1.5h2.5a.5.5 0 010 1H32.5a.5.5 0 01-.5-.5v-7a.5.5 0 01.5-.5h3a.5.5 0 010 1z" fill="white"/>
          </svg>
          <span>使用 LINE 帳號登入</span>
        </button>
      </el-form>
    </div>

    <!-- 註冊 Modal -->
    <el-dialog
      title="註冊新帳號"
      :visible.sync="registerVisible"
      width="420px"
      :close-on-click-modal="false"
      @closed="resetRegisterForm"
    >
      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="registerRules"
        label-width="110px"
      >
        <el-form-item label="帳號" prop="username">
          <el-input v-model="registerForm.username" placeholder="請輸入帳號（3~50 字元）" />
        </el-form-item>

        <el-form-item label="暱稱">
          <el-input v-model="registerForm.nickname" placeholder="選填" />
        </el-form-item>

        <el-form-item label="電話">
          <el-input v-model="registerForm.phone" placeholder="選填" />
        </el-form-item>

        <el-form-item label="電子郵件">
          <el-input v-model="registerForm.email" placeholder="選填" />
        </el-form-item>

        <el-form-item label="密碼" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="請輸入密碼（至少 6 字元）"
            show-password
          />
        </el-form-item>

        <el-form-item label="再次確認密碼" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="請再次輸入密碼"
            show-password
          />
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="registerVisible = false">取消</el-button>
        <el-button type="primary" :loading="registerLoading" @click="handleRegister">確認</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  layout: 'login',
  head () {
    return {
      script: [{ src: 'https://accounts.google.com/gsi/client', async: true, defer: true }]
    }
  },
  data () {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('兩次輸入的密碼不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
        password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }]
      },
      registerVisible: false,
      registerLoading: false,
      registerForm: {
        username: '',
        nickname: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      googleLoading: false,
      registerRules: {
        username: [
          { required: true, message: '請輸入帳號', trigger: 'blur' },
          { min: 3, max: 50, message: '帳號長度需在 3~50 字元之間', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 6, message: '密碼至少需要 6 個字元', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '請再次輸入密碼', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.initGoogleSignIn()
  },
  methods: {
    handleLineLogin () {
      const clientId = process.env.LINE_CHANNEL_ID
      if (!clientId) {
        this.$message.error('LINE 登入尚未設定，請聯繫管理員')
        return
      }
      const redirectUri = encodeURIComponent(`${window.location.origin}/line-callback`)
      const state = Math.random().toString(36).substring(2)
      sessionStorage.setItem('line_oauth_state', state)
      const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile`
      window.location.href = url
    },
    initGoogleSignIn (retryCount = 0) {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.GOOGLE_CLIENT_ID,
          callback: this.handleGoogleCredential
        })
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', width: 320, text: 'signin_with', locale: 'zh_TW' }
        )
      } else if (retryCount < 20) {
        setTimeout(() => this.initGoogleSignIn(retryCount + 1), 100)
      }
    },
    async handleGoogleCredential ({ credential }) {
      this.googleLoading = true
      try {
        const res = await this.$axios.post('/auth/google', { idToken: credential })
        if (res.data.code === 200) {
          this.$store.commit('SET_AUTH', {
            token: res.data.data.token,
            username: res.data.data.username
          })
          this.$message.success('Google 登入成功')
          this.$router.push('/portfolio')
        } else {
          this.$message.error(res.data.message || 'Google 登入失敗')
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Google 登入失敗，請稍後再試'
        this.$message.error(msg)
      } finally {
        this.googleLoading = false
      }
    },
    handleLogin () {
      if (this.loading) return
      this.loading = true
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) return
        try {
          const res = await this.$axios.post('/auth/login', this.form)
          if (res.data.code === 200) {
            this.$store.commit('SET_AUTH', {
              token: res.data.data.token,
              username: res.data.data.username
            })
            this.$message.success('登入成功')
            this.$router.push('/portfolio')
          } else {
            this.$message.error(res.data.message || '登入失敗')
          }
        } catch (err) {
          const msg = err.response?.data?.message || '登入失敗，請稍後再試'
          this.$message.error(msg)
        } finally {
          this.loading = false
        }
      })
    },
    openRegisterModal () {
      this.registerVisible = true
    },
    resetRegisterForm () {
      this.$refs.registerForm && this.$refs.registerForm.resetFields()
      this.registerForm.nickname = ''
      this.registerForm.phone = ''
      this.registerForm.email = ''
    },
    handleRegister () {
      this.$refs.registerForm.validate(async (valid) => {
        if (!valid) return
        this.registerLoading = true
        try {
          const payload = {
            username: this.registerForm.username,
            nickname: this.registerForm.nickname || null,
            phone: this.registerForm.phone || null,
            email: this.registerForm.email || null,
            password: this.registerForm.password
          }
          const res = await this.$axios.post('/auth/register', payload)
          if (res.data.code === 200) {
            this.$message.success('註冊成功，請登入')
            this.registerVisible = false
            this.form.username = this.registerForm.username
            this.form.password = ''
          } else {
            this.$message.error(res.data.message || '註冊失敗')
          }
        } catch (err) {
          const msg = err.response?.data?.message || '註冊失敗，請稍後再試'
          this.$message.error(msg)
        } finally {
          this.registerLoading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables';
@import '~/assets/scss/mixins';

.login-page {
  @include flex-center;
  width: 100%;
  min-height: 100vh;
}

.login-card {
  background: $color-bg-white;
  border-radius: 12px;
  padding: 48px 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

  @include respond-to(mobile) {
    margin: 16px;
    padding: 32px 24px;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 36px;

  h2 {
    margin: 0 0 8px;
    font-size: 22px;
    color: $color-text-primary;
  }

  p {
    margin: 0;
    color: $color-text-secondary;
    font-size: 14px;
  }
}

.logo {
  width: 72px;
  height: 72px;
  background: $gradient-primary;
  border-radius: 50%;
  @include flex-center;
  margin: 0 auto 16px;

  i {
    font-size: 32px;
    color: $color-bg-white;
  }
}

.login-form {
  margin-top: 8px;

  .el-form-item {
    margin-bottom: 20px;
  }
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  letter-spacing: 2px;
  margin-top: 8px;
  background: $gradient-primary;
  border: none;

  &:hover {
    opacity: 0.9;
  }
}

.register-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: $color-text-secondary;

  .el-button {
    padding: 0;
    font-size: 14px;
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0 16px;
  color: $color-text-secondary;
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-top: 1px solid #e0e0e0;
  }

  span {
    margin: 0 12px;
  }
}

.google-btn-wrapper {
  display: flex;
  justify-content: center;
  min-height: 44px;
}

.line-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 44px;
  margin-top: 12px;
  background-color: #06C755;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.88;
  }

  .line-icon {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
  }
}
</style>
