<template>
    <div>
        <h2>登入</h2>
        <input v-model="phone" placeholder="輸入手機號碼" />
        <input v-model="password" type="password" placeholder="輸入密碼" />
        <button @click="login">登入</button>
        <button @click="$router.push('/register')">註冊</button>
        <ErrorMessage v-if="errorMessage" :message="errorMessage" @update:message="errorMessage = $event" />
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
  