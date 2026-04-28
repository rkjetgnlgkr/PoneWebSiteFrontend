<template>
  <el-dialog
    :title="isEdit ? '編輯作品' : '新增作品'"
    :visible.sync="visible"
    width="600px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="作品名稱" prop="name">
        <el-input v-model="form.name" placeholder="請輸入作品名稱" maxlength="100" />
      </el-form-item>

      <el-form-item label="詳細描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="請輸入作品詳細描述"
          maxlength="1000"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="作品 URL" prop="url">
        <el-input v-model="form.url" placeholder="請輸入作品連結 (選填)" />
      </el-form-item>

      <el-form-item label="作品圖片">
        <el-upload
          ref="upload"
          action="#"
          list-type="picture-card"
          :file-list="fileList"
          :auto-upload="false"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
          :on-preview="handlePreview"
          multiple
          accept="image/*"
        >
          <i class="el-icon-plus" />
          <div slot="tip" class="el-upload__tip">支援 jpg/png/gif，每張不超過 10MB</div>
        </el-upload>
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">
        {{ saving ? '儲存中...' : '儲存' }}
      </el-button>
    </span>

    <!-- 圖片預覽 Dialog -->
    <el-dialog :visible.sync="previewVisible" append-to-body width="auto">
      <img :src="previewUrl" style="max-width:100%;display:block" alt="預覽">
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  name: 'PortfolioModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      saving: false,
      fileList: [],
      newFiles: [],       // 新上傳的 File 物件
      previewVisible: false,
      previewUrl: '',
      form: {
        name: '',
        description: '',
        url: ''
      },
      rules: {
        name: [{ required: true, message: '請輸入作品名稱', trigger: 'blur' }]
      }
    }
  },
  computed: {
    visible: {
      get () { return this.value },
      set (val) { this.$emit('input', val) }
    },
    isEdit () {
      return !!this.editData
    }
  },
  watch: {
    value (val) {
      if (val && this.editData) {
        this.form.name = this.editData.name || ''
        this.form.description = this.editData.description || ''
        this.form.url = this.editData.url || ''
        // 將已有圖片填入 fileList
        this.fileList = (this.editData.images || []).map(img => ({
          name: img.imagePath.split('/').pop(),
          url: 'http://localhost:8080' + img.imagePath,
          existingPath: img.imagePath  // 標記為已存在的圖片
        }))
        this.newFiles = []
      }
    }
  },
  methods: {
    handleFileChange (file, fileList) {
      // 只收集 raw File 物件（新上傳的）
      this.fileList = fileList
      this.newFiles = fileList
        .filter(f => f.raw)
        .map(f => f.raw)
    },
    handleFileRemove (file, fileList) {
      this.fileList = fileList
      this.newFiles = fileList
        .filter(f => f.raw)
        .map(f => f.raw)
    },
    handlePreview (file) {
      this.previewUrl = file.url
      this.previewVisible = true
    },
    async handleSave () {
      const valid = await this.$refs.form.validate().catch(() => false)
      if (!valid) return

      this.saving = true
      try {
        // 1. 先上傳新增的圖片
        let newImagePaths = []
        if (this.newFiles.length > 0) {
          const formData = new FormData()
          this.newFiles.forEach(f => formData.append('files', f))
          const uploadRes = await this.$axios.post('/files', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          if (uploadRes.data.code === 200) {
            newImagePaths = uploadRes.data.data
          } else {
            this.$message.error('圖片上傳失敗')
            return
          }
        }

        // 2. 收集所有圖片路徑（已存在 + 新上傳）
        const existingPaths = this.fileList
          .filter(f => f.existingPath)
          .map(f => f.existingPath)

        const allImagePaths = [...existingPaths, ...newImagePaths]

        // 3. 呼叫新增或更新 API
        const payload = {
          name: this.form.name,
          description: this.form.description,
          url: this.form.url,
          imagePaths: allImagePaths
        }

        let res
        if (this.isEdit) {
          res = await this.$axios.put(`/portfolios/${this.editData.id}`, payload)
        } else {
          res = await this.$axios.post('/portfolios', payload)
        }

        if (res.data.code === 200) {
          this.$message.success(this.isEdit ? '更新成功' : '新增成功')
          this.$emit('saved')
          this.visible = false
        } else {
          this.$message.error(res.data.message || '操作失敗')
        }
      } catch (err) {
        this.$message.error(err.response?.data?.message || '操作失敗')
      } finally {
        this.saving = false
      }
    },
    handleClosed () {
      this.$refs.form.resetFields()
      this.fileList = []
      this.newFiles = []
      this.$emit('update:editData', null)
    }
  }
}
</script>

<style lang="scss" scoped>
$thumb-size: 100px;

:deep(.el-upload--picture-card) {
  width: $thumb-size;
  height: $thumb-size;
  line-height: $thumb-size;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: $thumb-size;
  height: $thumb-size;
}
</style>
