<template>
    <div>
        <h2>註冊</h2>
        <input v-model="userName" placeholder="使用者名稱" />
        <input v-model="email" placeholder="電子郵件" />
        <input v-model="password" type="password" placeholder="密碼" />
        <input v-model="biography" placeholder="個人簡介" />
        <input v-model="phone" placeholder="手機號碼" />
        <button @click="register">註冊</button>
        <button @click="$router.push('/')">回到登入</button>
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
