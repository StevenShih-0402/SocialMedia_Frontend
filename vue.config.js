const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src') // 設定 `@` 為 `src` 目錄
      }
    }
  },
  devServer: {
    port: 3000, // 與 Vite 相同的開發伺服器端口
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 後端運行在 8080 端口
        changeOrigin: true,
        pathRewrite: { '^/api': '' } // 代理時移除 `/api`
      }
    }
  }
});