<template>
  <div class="settings-page">
    <!-- 大頭貼 -->
    <el-card class="settings-card">
      <div slot="header" class="card-header">
        <span>大頭貼</span>
      </div>
      <div class="avatar-section" v-loading="avatarLoading">
        <div class="avatar-preview">
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar-img" alt="大頭貼" />
          <div v-else class="avatar-placeholder">
            <i class="el-icon-user" />
          </div>
        </div>
        <div class="avatar-actions">
          <el-upload
            ref="avatarUpload"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            accept="image/*"
          >
            <el-button icon="el-icon-upload2">選擇圖片</el-button>
          </el-upload>
          <el-button
            type="primary"
            :loading="avatarSaving"
            :disabled="!pendingAvatarFile"
            @click="handleAvatarSave"
          >
            上傳大頭貼
          </el-button>
        </div>
        <p class="avatar-hint">支援 jpg / png / gif，建議尺寸 200×200px 以上</p>
      </div>
    </el-card>

    <!-- 版面設定 -->
    <el-card class="settings-card">
      <div slot="header" class="card-header">
        <span>版面設定</span>
      </div>
      <el-form :model="form" label-width="100px" v-loading="loading">
        <el-form-item label="主題風格">
          <el-select v-model="form.themeStyle" placeholder="請選擇主題風格" style="width: 220px;">
            <el-option
              v-for="option in themeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="handleSave">儲存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage',
  data () {
    return {
      // 版面設定
      loading: false,
      saving: false,
      form: {
        themeStyle: 'dark_star'
      },
      themeOptions: [
        { value: 'dark_star', label: '深色星空' },
        { value: 'nature', label: '自然' },
        { value: 'terminal', label: '終端機' }
      ],
      // 大頭貼
      avatarLoading: false,
      avatarSaving: false,
      avatarUrl: null,
      pendingAvatarFile: null
    }
  },
  created () {
    this.fetchSettings()
    this.fetchProfile()
  },
  methods: {
    async fetchSettings () {
      this.loading = true
      try {
        const res = await this.$axios.get('/settings')
        this.form.themeStyle = res.data.data.themeStyle
      } catch (e) {
        this.$message.error('載入設定失敗')
      } finally {
        this.loading = false
      }
    },
    async handleSave () {
      this.saving = true
      try {
        await this.$axios.put('/settings', { themeStyle: this.form.themeStyle })
        this.$message.success('儲存成功')
      } catch (e) {
        this.$message.error('儲存失敗')
      } finally {
        this.saving = false
      }
    },
    async fetchProfile () {
      this.avatarLoading = true
      try {
        const res = await this.$axios.get('/profile')
        const avatar = res.data.data.avatar
        if (avatar) {
          this.avatarUrl = this.resolveUrl(avatar)
        }
      } catch (e) {
        // 載入失敗不提示，維持空白即可
      } finally {
        this.avatarLoading = false
      }
    },
    handleAvatarChange (file) {
      this.pendingAvatarFile = file.raw
      // 本地預覽
      const reader = new FileReader()
      reader.onload = (e) => { this.avatarUrl = e.target.result }
      reader.readAsDataURL(file.raw)
    },
    async handleAvatarSave () {
      if (!this.pendingAvatarFile) return
      this.avatarSaving = true
      try {
        const formData = new FormData()
        formData.append('file', this.pendingAvatarFile)
        const res = await this.$axios.post('/profile/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.avatarUrl = this.resolveUrl(res.data.data)
        this.pendingAvatarFile = null
        this.$message.success('大頭貼已更新')
      } catch (e) {
        this.$message.error('上傳失敗')
      } finally {
        this.avatarSaving = false
      }
    },
    resolveUrl (path) {
      if (!path) return null
      if (path.startsWith('http')) return path
      return `${this.$axios.defaults.baseURL.replace(/\/api$/, '')}${path}`
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-page {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-card {
  .card-header {
    font-size: 15px;
    font-weight: 600;
  }
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #dcdfe6;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-placeholder {
    font-size: 40px;
    color: #c0c4cc;
  }
}

.avatar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-hint {
  font-size: 12px;
  color: #909399;
  margin: 0;
}
</style>
