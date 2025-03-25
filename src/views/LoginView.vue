<template>
    <div class="login-container">
        <div class="login-card">
            <h2>登入</h2>
            <input v-model="phone" placeholder="輸入手機號碼" />
            <input v-model="password" type="password" placeholder="輸入密碼" />
            <div class="btn-area">
                <button @click="login">登入</button>
                <button @click="$router.push('/register')" class="register-btn">註冊</button>
            </div>
            <ErrorMessage v-if="errorMessage" :message="errorMessage" @update:message="errorMessage = $event" />
        </div>
    </div>
</template>
  
<script>
import { socialMediaService } from '@/services/api.js';
import ErrorMessage from '@/components/ErrorMessage.vue';

export default {
    components: { ErrorMessage },
    data() {
        return {
            phone: '',
            password: '',
            errorMessage: ''
        };
    },
    methods: {
        async login() {
            try {
                const response = await socialMediaService.login({ 
                    phone: this.phone, 
                    password: this.password 
                });

                // 確保 token 存在再存入 localStorage
                if (response.code == "0") {
                    localStorage.setItem('token', response.data);
                    this.$router.push('/home');
                } else if(response.code != "0"){
                    this.errorMessage = response.message;
                }
            } catch (error) {
                console.error('登入錯誤:', error);
                this.errorMessage = error.response?.message || '登入失敗，請稍後再試';
            }
        }
    }
};
</script>
  

<style scoped>
    /* 外部容器，讓卡片置中 */
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh; /* 讓它全螢幕置中 */
    }

    /* 登入卡片 */
    .login-card {
        width: 320px;
        padding: 20px;
        background: #ffffff;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        text-align: center;
    }

    /* 標題 */
    .login-card h2 {
        margin-bottom: 20px;
    }

    /* 輸入框 */
    .login-card input {
        width: 90%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
    }

    /* 按鈕設計 */
    .login-card .btn-area{
        display: flex;
        gap: 8px;
    }

    .login-card button {
        width: 100%;
        padding: 10px;
        margin-top: 10px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
    }

    /* 登入按鈕 */
    .login-card button:first-of-type {
        background-color: #007bff;
        color: white;
    }

    .login-card button:first-of-type:hover {
        background-color: #0056b3;
    }

    /* 註冊按鈕 */
    .login-card .register-btn {
        background-color: #6c757d;
        color: white;
    }

    .login-card .register-btn:hover {
        background-color: #545b62;
    }
</style>