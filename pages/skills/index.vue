<template>
  <div class="skills-page">
    <div class="page-card">
      <div class="toolbar">
        <el-button
          type="primary"
          icon="el-icon-search"
          :loading="loading"
          @click="fetchList"
        >
          查詢
        </el-button>
        <el-button
          type="success"
          icon="el-icon-plus"
          @click="handleAdd"
        >
          新增技能
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        empty-text="暫無資料，請點擊查詢"
      >
        <el-table-column type="index" label="#" width="55" align="center" />
        <el-table-column prop="name" label="技能名稱" min-width="140" show-overflow-tooltip />
        <el-table-column prop="category" label="分類" min-width="120" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-if="row.category">{{ row.category }}</span>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>
        <el-table-column label="熟練度" width="200" align="center">
          <template slot-scope="{ row }">
            <div class="level-wrapper">
              <el-progress
                :percentage="row.level"
                :stroke-width="10"
                :show-text="false"
                class="level-bar"
              />
              <span class="level-num">{{ row.level }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sortOrder" label="排序" width="80" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.sortOrder != null">{{ row.sortOrder }}</span>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(row)"
            >
              編輯
            </el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(row)"
            >
              刪除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <skill-modal
      v-model="modalVisible"
      :edit-data.sync="editData"
      @saved="fetchList"
    />

    <el-dialog
      title="刪除確認"
      :visible.sync="deleteDialogVisible"
      width="360px"
      center
    >
      <div class="delete-confirm-content">
        <i class="el-icon-warning-outline warning-icon" />
        <p>確定要刪除技能 <strong>「{{ deleteTarget && deleteTarget.name }}」</strong> 嗎？</p>
        <p class="delete-tip">此操作無法復原！</p>
      </div>
      <span slot="footer">
        <el-button @click="deleteDialogVisible = false">否</el-button>
        <el-button type="danger" :loading="deleting" @click="confirmDelete">是，確定刪除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SkillsPage',
  data () {
    return {
      loading: false,
      tableData: [],
      modalVisible: false,
      editData: null,
      deleteDialogVisible: false,
      deleteTarget: null,
      deleting: false
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    async fetchList () {
      this.loading = true
      try {
        const res = await this.$axios.get('/skills')
        if (res.data.code === 200) {
          this.tableData = res.data.data || []
        } else {
          this.$message.error(res.data.message || '查詢失敗')
        }
      } catch (err) {
        this.$message.error('查詢失敗，請稍後再試')
      } finally {
        this.loading = false
      }
    },
    handleAdd () {
      this.editData = null
      this.modalVisible = true
    },
    handleEdit (row) {
      this.editData = { ...row }
      this.modalVisible = true
    },
    handleDelete (row) {
      this.deleteTarget = row
      this.deleteDialogVisible = true
    },
    async confirmDelete () {
      this.deleting = true
      try {
        const res = await this.$axios.delete(`/skills/${this.deleteTarget.id}`)
        if (res.data.code === 200) {
          this.$message.success('刪除成功')
          this.deleteDialogVisible = false
          this.fetchList()
        } else {
          this.$message.error(res.data.message || '刪除失敗')
        }
      } catch (err) {
        this.$message.error('刪除失敗，請稍後再試')
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables';
@import '~/assets/scss/mixins';

.skills-page {
  padding: 0;
}

.page-card {
  background: $color-bg-white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  @include respond-to(tablet) {
    padding: 12px;
  }
}

.toolbar {
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
}

.empty-text {
  color: $color-text-placeholder;
}

.level-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-bar {
  flex: 1;
}

.level-num {
  font-size: 12px;
  color: $color-text-regular;
  width: 28px;
  text-align: right;
  flex-shrink: 0;
}

.delete-confirm-content {
  text-align: center;
  padding: 8px 0;

  p {
    margin: 6px 0;
    color: $color-text-primary;
    font-size: 14px;
  }
}

.warning-icon {
  font-size: 48px;
  color: $color-warning;
  margin-bottom: 12px;
  display: block;
}

.delete-tip {
  color: $color-danger !important;
  font-size: 12px !important;
}
</style>
