<template>
  <el-dialog
    :title="isEdit ? '編輯工作經歷' : '新增工作經歷'"
    :visible.sync="visible"
    width="560px"
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
      <el-form-item label="公司名稱" prop="company">
        <el-input v-model="form.company" placeholder="請輸入公司名稱" maxlength="200" />
      </el-form-item>

      <el-form-item label="職位" prop="position">
        <el-input v-model="form.position" placeholder="請輸入職位名稱" maxlength="100" />
      </el-form-item>

      <el-form-item label="開始日期" prop="startDate">
        <el-date-picker
          v-model="form.startDate"
          type="date"
          placeholder="選擇開始日期"
          value-format="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="目前在職">
        <el-checkbox v-model="form.isCurrent" @change="handleCurrentChange">目前在職</el-checkbox>
      </el-form-item>

      <el-form-item label="結束日期" prop="endDate">
        <el-date-picker
          v-model="form.endDate"
          type="date"
          placeholder="選擇結束日期（目前在職可不填）"
          value-format="yyyy-MM-dd"
          :disabled="form.isCurrent"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="工作描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="請輸入工作內容描述（選填）"
          maxlength="2000"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="排序" prop="sortOrder">
        <el-input-number
          v-model="form.sortOrder"
          :min="0"
          controls-position="right"
          placeholder="數字越小越前面（選填）"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">
        {{ saving ? '儲存中...' : '儲存' }}
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'WorkExperienceModal',
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
      form: {
        company: '',
        position: '',
        startDate: null,
        endDate: null,
        isCurrent: false,
        description: '',
        sortOrder: null
      },
      rules: {
        company: [{ required: true, message: '請輸入公司名稱', trigger: 'blur' }],
        position: [{ required: true, message: '請輸入職位', trigger: 'blur' }],
        startDate: [{ required: true, message: '請選擇開始日期', trigger: 'change' }]
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
        this.form.company = this.editData.company || ''
        this.form.position = this.editData.position || ''
        this.form.startDate = this.editData.startDate || null
        this.form.endDate = this.editData.endDate || null
        this.form.isCurrent = !!this.editData.isCurrent
        this.form.description = this.editData.description || ''
        this.form.sortOrder = this.editData.sortOrder != null ? this.editData.sortOrder : null
      }
    }
  },
  methods: {
    handleCurrentChange (val) {
      if (val) {
        this.form.endDate = null
      }
    },
    async handleSave () {
      const valid = await this.$refs.form.validate().catch(() => false)
      if (!valid) return

      this.saving = true
      try {
        const payload = {
          company: this.form.company,
          position: this.form.position,
          startDate: this.form.startDate,
          endDate: this.form.isCurrent ? null : (this.form.endDate || null),
          isCurrent: this.form.isCurrent,
          description: this.form.description || null,
          sortOrder: this.form.sortOrder
        }

        let res
        if (this.isEdit) {
          res = await this.$axios.put(`/work-experiences/${this.editData.id}`, payload)
        } else {
          res = await this.$axios.post('/work-experiences', payload)
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
      this.form.isCurrent = false
      this.form.sortOrder = null
      this.$emit('update:editData', null)
    }
  }
}
</script>
