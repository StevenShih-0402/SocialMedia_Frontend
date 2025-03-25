<template>
    <div class="register-container">
        <div class="register-card">
            <h2>註冊</h2>
            <input v-model="userName" placeholder="使用者名稱" />
            <input v-model="email" placeholder="電子郵件" />
            <input v-model="password" type="password" placeholder="密碼" />
            <input v-model="biography" placeholder="個人簡介" />
            <input v-model="phone" placeholder="手機號碼" />
            <div class="btn-area">
                <button @click="register" class="register-btn">註冊</button>
                <button @click="$router.push('/')" class="back-btn">回到登入</button>
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
                userName: '',
                email: '',
                password: '',
                biography: '',
                phone: '',
                errorMessage: ''
            };
        },
        methods: {
            async register() {
                const response = await socialMediaService.register({
                    userName: this.userName, 
                    email: this.email, 
                    password: this.password, 
                    biography: this.biography, 
                    phone: this.phone }
                );

                if(response.code == "0"){
                    localStorage.setItem('token', response.data);
                    this.$router.push('/home');
                } else if(response.code != "0"){
                    this.errorMessage = response.message;
                }
            }
        }
    };
</script>

<style scoped>

    /* 讓整個註冊區塊置中 */
    .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* 讓它佔滿整個畫面 */
    }

    /* 註冊卡片樣式 */
    .register-card {
    background: white;
    padding: 30px;
    width: 350px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    }

    /* 讓 input 保持間距 */
    .register-card input {
    width: 90%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    }

    .btn-area{
        display: flex;
        gap: 8px;
    }

    /* 註冊按鈕 */
    .register-btn {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    }

    /* 返回按鈕 */
    .back-btn {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    background-color: #d10000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    }

    /* 按鈕 hover 效果 */
    .register-btn:hover {
    background-color: #0056b3;
    }
    .back-btn:hover {
    background-color: #8a0000;
    }
</style>
