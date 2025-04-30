<template>
    <div v-if="message" class="error-overlay">
        <div class="error-message">
            <h2>錯誤</h2>
            <p>{{ message }}</p>
            <button @click="clearError">確認</button>
        </div>
    </div>
</template>
  
<script>
    export default {
        props: ['message'],
        methods: {
            clearError() {
                // 關閉錯誤視窗並清除錯誤訊息
                this.$emit('update:message', '');
            }
        }
    };
</script>
  
<style scoped>
    .error-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); /* 降低亮度 */
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }

    .error-message {
        background: rgb(150, 0, 0);
        color: white;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        min-width: 300px;
    }

    .error-message button {
        margin-top: 10px;
        padding: 5px 10px;
        background: white;
        color: red;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .error-message button:hover {
        background: #f1f1f1;
    }
</style>