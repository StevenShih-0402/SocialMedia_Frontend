import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'


// 創建帶有默認配置的 axios 實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加請求攔截器，自動添加 token
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token') // 從 localStorage 取出 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}` // 設置 Authorization 標頭
    }
    return config
  }, error => {
    return Promise.reject(error)
})

// 處理過期(未授權)的 Token
apiClient.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response && error.response.status === 401) {
        // 401 未授權，清除 token 並重定向到登錄頁面
        localStorage.removeItem('token')
        window.location.href = '/login'
    }
    return Promise.reject(error)
})

export const socialMediaService = {

  // 查詢貼文內所有留言
  async queryCommentInPost(commentData) {
    const response = await apiClient.post('/comment/query', commentData)
    return response.data
  },

  // 新增留言
  async createComment(commentData) {
    const response = await apiClient.post('/comment/create', commentData)
    return response.data
  },

  // 刪除貼文
  async deletePost(postData) {
    const response = await apiClient.delete('/post/delete', { data: postData })
    return response.data
  },

  // 編輯貼文
  async updatePost(postData) {
    const response = await apiClient.put('/post/update', postData)
    return response.data
  },

  // 查詢所有貼文
  async queryAllPosts() {
    const response = await apiClient.get('/post/query')
    return response.data
  },

  // 發布貼文
  async createPost(postData) {
    const response = await apiClient.post('/post/create', postData)
    return response.data
  },

  // 登入
  async login(userData) {
    const response = await apiClient.post('/user/login', userData)
    return response.data
  },

  // 註冊新用戶
  async register(userData) {
    const response = await apiClient.post('/user/register', userData)
    return response.data
  },

  // 查詢用戶資訊
  async queryUser() {
    const response = await apiClient.get('/user/query')
    return response.data
  },

  //登出
  async logout() {
    const response = await apiClient.post('/user/logout')
    return response.data
  }
} 