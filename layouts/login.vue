<template>
  <div class="login-layout">
    <nuxt />
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/scss/variables';
@import '~/assets/scss/mixins';

.login-layout {
  min-height: 100vh;
  background: $gradient-primary;
  @include flex-center;
}
</style>
