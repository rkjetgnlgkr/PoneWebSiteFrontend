<template>
  <el-dialog
    :title="isEdit ? '編輯技能' : '新增技能'"
    :visible.sync="visible"
    width="480px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="right"
    >
      <el-form-item label="技能名稱" prop="name">
        <el-input v-model="form.name" placeholder="請輸入技能名稱" maxlength="100" />
      </el-form-item>

      <el-form-item label="分類" prop="category">
        <el-input v-model="form.category" placeholder="例如：前端、後端、資料庫（選填）" maxlength="50" />
      </el-form-item>

      <el-form-item label="熟練度" prop="level">
        <div class="level-input-row">
          <el-slider
            v-model="form.level"
            :min="1"
            :max="100"
            class="level-slider"
          />
          <el-input-number
            v-model="form.level"
            :min="1"
            :max="100"
            controls-position="right"
            class="level-number"
          />
        </div>
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
  name: 'SkillModal',
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
        name: '',
        category: '',
        level: 80,
        sortOrder: null
      },
      rules: {
        name: [{ required: true, message: '請輸入技能名稱', trigger: 'blur' }],
        level: [{ required: true, message: '請輸入熟練度', trigger: 'blur' }]
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
        this.form.category = this.editData.category || ''
        this.form.level = this.editData.level != null ? this.editData.level : 80
        this.form.sortOrder = this.editData.sortOrder != null ? this.editData.sortOrder : null
      }
    }
  },
  methods: {
    async handleSave () {
      const valid = await this.$refs.form.validate().catch(() => false)
      if (!valid) return

      this.saving = true
      try {
        const payload = {
          name: this.form.name,
          category: this.form.category || null,
          level: this.form.level,
          sortOrder: this.form.sortOrder
        }

        let res
        if (this.isEdit) {
          res = await this.$axios.put(`/skills/${this.editData.id}`, payload)
        } else {
          res = await this.$axios.post('/skills', payload)
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
      this.form.level = 80
      this.form.sortOrder = null
      this.$emit('update:editData', null)
    }
  }
}
</script>

<style lang="scss" scoped>
.level-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.level-slider {
  flex: 1;
}

.level-number {
  width: 100px;
  flex-shrink: 0;
}
</style>
