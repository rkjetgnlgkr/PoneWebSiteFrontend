<template>
  <div class="settings-page">
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
      loading: false,
      saving: false,
      form: {
        themeStyle: 'default'
      },
      themeOptions: [
        { value: 'default', label: '預設' },
        { value: 'dark', label: '深色' },
        { value: 'blue', label: '藍色' },
        { value: 'green', label: '綠色' }
      ]
    }
  },
  created () {
    this.fetchSettings()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-page {
  max-width: 600px;
}

.settings-card {
  .card-header {
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
