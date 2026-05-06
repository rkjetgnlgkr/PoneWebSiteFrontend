<template>
  <el-container class="main-container">
    <!-- 左側側邊欄 -->
    <el-aside :width="sidebarCollapsed ? '64px' : '220px'" class="sidebar">
      <div class="sidebar-header">
        <span v-if="!sidebarCollapsed" class="sidebar-title">作品集管理</span>
        <el-button
          type="text"
          :icon="sidebarCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          class="collapse-btn"
          @click="sidebarCollapsed = !sidebarCollapsed"
        />
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="sidebarCollapsed"
        background-color="#2d3a4a"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
        class="sidebar-menu"
      >
        <el-menu-item index="/portfolio">
          <i class="el-icon-picture-outline" />
          <span slot="title">作品集</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <i class="el-icon-user" />
          <span slot="title">使用者</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右側主內容區 -->
    <el-container class="content-wrapper">
      <!-- 頂部導覽列 -->
      <el-header class="header">
        <div class="header-left">
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <span class="welcome-text">歡迎，{{ username }}</span>
          <el-button type="text" icon="el-icon-switch-button" @click="handleLogout">
            登出
          </el-button>
        </div>
      </el-header>

      <!-- 主要內容 -->
      <el-main class="main-content">
        <nuxt />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      sidebarCollapsed: false
    }
  },
  computed: {
    username () {
      return this.$store.state.username || '使用者'
    },
    activeMenu () {
      return this.$route.path
    },
    pageTitle () {
      const titles = {
        '/portfolio': '作品集',
        '/users': '使用者'
      }
      return titles[this.$route.path] || ''
    }
  },
  methods: {
    handleLogout () {
      this.$confirm('確定要登出嗎？', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('CLEAR_AUTH')
        this.$router.push('/login')
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/variables';
@import '~/assets/scss/mixins';

$header-height: 60px;

.main-container {
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  background-color: $color-sidebar-bg;
  transition: width 0.3s;
  overflow: hidden;

  &-header {
    height: $header-height;
    @include flex-between;
    padding: 0 16px;
    border-bottom: 1px solid $color-sidebar-border;
  }

  &-title {
    color: $color-bg-white;
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
  }

  &-menu {
    border-right: none;
    flex: 1;
  }
}

.collapse-btn {
  color: $color-sidebar-text !important;
  font-size: 18px;
}

.content-wrapper {
  flex-direction: column;
  overflow: hidden;
}

.header {
  background: $color-bg-white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  @include flex-between;
  padding: 0 24px;
  height: $header-height !important;

  &-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: $color-text-primary;
}

.welcome-text {
  color: $color-text-regular;
  font-size: 14px;
}

.main-content {
  background: $color-bg-page;
  overflow-y: auto;
  padding: 20px;
}
</style>
