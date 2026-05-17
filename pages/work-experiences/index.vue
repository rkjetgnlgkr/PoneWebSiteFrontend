<template>
  <div class="work-experiences-page">
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
          新增工作經歷
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
        <el-table-column prop="company" label="公司" min-width="140" show-overflow-tooltip />
        <el-table-column prop="position" label="職位" min-width="140" show-overflow-tooltip />
        <el-table-column label="期間" min-width="200">
          <template slot-scope="{ row }">
            <span>{{ row.startDate }}</span>
            <span class="date-sep"> ~ </span>
            <span v-if="row.isCurrent" class="current-badge">目前在職</span>
            <span v-else-if="row.endDate">{{ row.endDate }}</span>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-if="row.description">{{ row.description }}</span>
            <span v-else class="empty-text">-</span>
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

    <work-experience-modal
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
        <p>確定要刪除 <strong>「{{ deleteTarget && deleteTarget.company }} - {{ deleteTarget && deleteTarget.position }}」</strong> 嗎？</p>
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
  name: 'WorkExperiencesPage',
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
        const res = await this.$axios.get('/work-experiences')
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
        const res = await this.$axios.delete(`/work-experiences/${this.deleteTarget.id}`)
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

.work-experiences-page {
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

.date-sep {
  color: $color-text-placeholder;
}

.current-badge {
  display: inline-block;
  background: #e1f3d8;
  color: #67c23a;
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 10px;
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
