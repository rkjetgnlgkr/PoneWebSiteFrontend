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
        password: '',
        confirmPassword: ''
      },
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
  methods: {
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
    },
    handleRegister () {
      this.$refs.registerForm.validate(async (valid) => {
        if (!valid) return
        this.registerLoading = true
        try {
          const payload = {
            username: this.registerForm.username,
            nickname: this.registerForm.nickname || null,
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

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
}

.login-card {
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.logo i {
  font-size: 32px;
  color: #fff;
}

.login-header h2 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #303133;
}

.login-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.login-form {
  margin-top: 8px;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  letter-spacing: 2px;
  margin-top: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
}

.login-btn:hover {
  opacity: 0.9;
}

.register-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #909399;
}

.register-link .el-button {
  padding: 0;
  font-size: 14px;
}

/* RWD */
@media (max-width: 480px) {
  .login-card {
    margin: 16px;
    padding: 32px 24px;
  }
}
</style>
