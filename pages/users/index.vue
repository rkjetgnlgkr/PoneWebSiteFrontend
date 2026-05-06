<template>
  <div class="users-page">
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
        <el-table-column prop="id" label="Id" width="80" align="center" />

        <el-table-column prop="username" label="使用者帳號" min-width="130" show-overflow-tooltip />

        <el-table-column prop="nickname" label="暱稱" min-width="120" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-if="row.nickname">{{ row.nickname }}</span>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="phone" label="電話" min-width="130" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-if="row.phone">{{ row.phone }}</span>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="電子郵件" min-width="180" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span v-if="row.email">{{ row.email }}</span>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>

        <el-table-column label="註冊時間" min-width="160" align="center">
          <template slot-scope="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsersPage',
  data () {
    return {
      loading: false,
      tableData: []
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    async fetchList () {
      this.loading = true
      try {
        const res = await this.$axios.get('/users')
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
    formatDate (dateStr) {
      if (!dateStr) return '-'
      const d = new Date(dateStr)
      const pad = n => String(n).padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables';
@import '~/assets/scss/mixins';

.users-page {
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
}

.empty-text {
  color: $color-text-placeholder;
}
</style>
