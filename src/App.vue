<template>
    <router-view></router-view>
</template>

<script>
export default {
    name: 'App',
    mounted() {
        this.checkServerStatus();  // 後端關閉重啟時，回到登入畫面
    },
    methods: {
        async checkServerStatus() {
            try {
                const response = await fetch('http://your-backend-url/health'); // 檢查後端狀態
                if (!response.ok) {
                    throw new Error('Server down');
                }
            } catch (error) {
                localStorage.removeItem('token'); // 移除 Token
                this.$router.push('/'); // 跳轉回登入頁
            }
        }
    }
}
</script>

<style>
    html{
        background-color: #cfcfcf;
    }
</style>