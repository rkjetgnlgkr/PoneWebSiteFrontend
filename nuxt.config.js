export default {
  // SPA 模式
  ssr: false,
  target: 'static',

  head: {
    title: 'PoneWebSite - 個人作品集',
    htmlAttrs: { lang: 'zh-TW' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '個人作品集管理平台' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/assets/scss/main.scss'
  ],

  plugins: [
    '~/plugins/element-ui.js',
    '~/plugins/axios.js'
  ],

  components: true,

  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    baseURL: process.env.API_BASE_URL || 'http://localhost:8080/api',
    credentials: false
  },

  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:8080'
  },

  router: {
    middleware: ['auth']
  },

  build: {
    transpile: [/^element-ui/]
  }
}
