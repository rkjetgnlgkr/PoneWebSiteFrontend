<template>
  <div class="portfolio-page">
    <div class="page-card">
      <!-- 工具列 -->
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
          新增作品
        </el-button>
      </div>

      <!-- 資料表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        empty-text="暫無資料，請點擊查詢"
      >
        <el-table-column type="index" label="#" width="55" align="center" />

        <el-table-column prop="name" label="作品名稱" min-width="150" show-overflow-tooltip />

        <el-table-column prop="description" label="作品詳細描述" min-width="200" show-overflow-tooltip />

        <el-table-column label="作品 URL" min-width="180">
          <template slot-scope="{ row }">
            <a
              v-if="row.url"
              :href="row.url"
              target="_blank"
              class="url-link"
            >{{ row.url }}</a>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>

        <el-table-column label="作品圖片" width="200" align="center">
          <template slot-scope="{ row }">
            <div v-if="row.images && row.images.length" class="image-preview-group">
              <el-image
                v-for="(img, idx) in row.images.slice(0, 3)"
                :key="idx"
                :src="getImageUrl(img.imagePath)"
                :preview-src-list="row.images.map(i => getImageUrl(i.imagePath))"
                class="preview-image"
                fit="cover"
              />
              <span v-if="row.images.length > 3" class="more-badge">
                +{{ row.images.length - 3 }}
              </span>
            </div>
            <span v-else class="empty-text">無圖片</span>
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

    <!-- 新增/編輯 Modal -->
    <portfolio-modal
      v-model="modalVisible"
      :edit-data.sync="editData"
      @saved="fetchList"
    />

    <!-- 刪除確認 Dialog -->
    <el-dialog
      title="刪除確認"
      :visible.sync="deleteDialogVisible"
      width="360px"
      center
    >
      <div class="delete-confirm-content">
        <i class="el-icon-warning-outline warning-icon" />
        <p>確定要刪除作品 <strong>「{{ deleteTarget && deleteTarget.name }}」</strong> 嗎？</p>
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
  name: 'PortfolioPage',
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
        const res = await this.$axios.get('/portfolios')
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
        const res = await this.$axios.delete(`/portfolios/${this.deleteTarget.id}`)
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
    },
    getImageUrl (path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      return (process.env.BACKEND_URL || 'http://localhost:8080') + path
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables';
@import '~/assets/scss/mixins';

.portfolio-page {
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

  @include respond-to(tablet) {
    flex-wrap: wrap;
  }
}

.url-link {
  color: $color-primary;
  text-decoration: none;
  display: inline-block;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;

  &:hover {
    text-decoration: underline;
  }
}

.empty-text {
  color: $color-text-placeholder;
}

.image-preview-group {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}

.preview-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  border: 1px solid $color-border;
  cursor: pointer;
}

.more-badge {
  background: $color-bg-badge;
  color: $color-text-regular;
  font-size: 12px;
  padding: 2px 6px;
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

@include respond-to(small) {
  :deep(.el-table) {
    font-size: 12px;
  }
}
</style>
