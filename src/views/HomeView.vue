<template>
    <div class="home-container">
        <header class="header">
            <h2>社群平台</h2>
            <div class="btn-area">
                <button @click="showUserData" class="user-data">{{ userData.userName }}</button>
                <button @click="createPost" class="create-post">發文</button>
                <button @click="logout" class="logout">登出</button>
            </div>
        </header>

        <!-- 顯示用戶資訊區塊 -->
        <div v-if="showUserInfo" class="overlay">
            <div v-if="showUserInfo" class="user-info">
                <h2>用戶資訊</h2>
                <p><strong>用戶姓名：</strong>{{ userData.userName }}</p>
                <p><strong>電子郵件：</strong>{{ userData.email }}</p>
                <p><strong>電話號碼：</strong>{{ userData.phone }}</p>
                <p><strong>個人簡介：</strong>{{ userData.biography }}</p>
                <button @click="closeUserData">關閉</button>
            </div>
        </div>

        <!-- 顯示發文區塊 -->
        <div v-if="showPostForm" class="overlay">
            <div v-if="showPostForm" class="post-form">
                <h2>發表內容</h2>
                <textarea v-model="newPostContent" placeholder="輸入您的貼文內容..."></textarea>
                <button @click="submitPost">發布</button>
                <button @click="cancelPost">返回</button>
            </div>
        </div>

        <div class="post-area">
            <div v-if="loading">載入中...</div>
            <div v-else-if="posts.length === 0">目前沒有貼文</div>
            <div v-else>
                <PostBlock v-for="post in posts" :key="post.id" :post="post" :current-user-id="userData.id" @refreshPosts="fetchPosts" />
            </div>
        </div>

        <ErrorMessage v-if="errorMessage" :message="errorMessage" @update:message="errorMessage = $event" />
    </div>
</template>

<script>
import { socialMediaService } from '@/services/api.js';
import PostBlock from '@/components/PostBlock.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

export default {
    components: { PostBlock, ErrorMessage },
    data() {
        return {
            posts: [],
            loading: true,
            errorMessage: '',
            showUserInfo: false,   // 控制用戶資訊顯示
            showPostForm: false,   // 控制發文表單顯示
            userData: {},          // 儲存用戶資訊
            newPostContent: ''     // 儲存新貼文內容
        };
    },
    async mounted() {
        await this.fetchPosts();
        await this.showUserData();
        this.showUserInfo = false;
    },
    methods: {
        async fetchPosts() {
            try {
                const response = await socialMediaService.queryAllPosts();
                if (response.code === '0' && response.message === 'SUCCESS') {
                    this.posts = response.data;
                } else {
                    this.errorMessage = response.message;
                }
            } catch (error) {
                console.error("獲取貼文失敗", error);
                this.errorMessage = '無法載入貼文';
            } finally {
                this.loading = false;
            }
        },
        async showUserData() {
            try {
                const response = await socialMediaService.queryUser();
                if (response.code === '0' && response.message === 'SUCCESS') {
                    this.userData = response.data;
                    this.showUserInfo = true;
                } else {
                    this.errorMessage = response.message;
                }
            } catch (error) {
                console.error("獲取用戶資訊失敗", error);
                this.errorMessage = '無法獲取用戶資訊';
                this.$router.push('/');
            }
        },
        closeUserData() {
            this.showUserInfo = false;
        },
        createPost() {
            this.showPostForm = true;
        },
        async submitPost() {
            try {
                const postData = { content: this.newPostContent };
                const response = await socialMediaService.createPost(postData);
                if (response.code === '0' && response.message === 'SUCCESS') {
                    // 發文成功後重新載入貼文
                    await this.fetchPosts();
                    this.showPostForm = false; // 隱藏發文表單
                    this.newPostContent = '';  // 清空貼文內容
                } else {
                    this.errorMessage = response.message;
                }
            } catch (error) {
                console.error("發文失敗", error);
                this.errorMessage = '無法發布貼文';
            }
        },
        cancelPost() {
            this.showPostForm = false;
            this.newPostContent = '';  // 清空貼文內容
        },
        async logout() {
            try {
                const response = await socialMediaService.logout();
                if (response.code === "0") {
                    localStorage.removeItem('token');
                    this.$router.push('/');
                } else {
                    this.errorMessage = response.message;
                }
            } catch (error) {
                console.error("登出失敗", error);
            }
        }
    }
};
</script>

<style scoped>
    .home-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
    }
    .post-area {
        width: 100%;
        max-width: 800px;
        margin-top: 80px;
    }
    .user-info, .post-form {
        margin-top: 20px;
    }

    
    /* 背景亮度降低效果 */
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); /* 降低亮度 */
        display: flex;
        justify-content: center;
        align-items: center;
    }


    /* Header區塊樣式 */
    .header {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;  /* 使h2和按鈕區塊分佈 */
        align-items: center;  /* 垂直置中 */
        background-color: #333;  /* 頂部背景顏色 */
        color: white;  /* 文字顏色為白色 */
        padding: 15px 30px;  /* 上下 15px，左右 30px 的內邊距 */
        width: 100%;  /* 讓區塊寬度占滿螢幕 */
        box-sizing: border-box;  /* 包括邊距與邊框在內 */
    }

    .header h2 {
        margin: 0;  /* 去除標題的外邊距 */
        font-size: 24px;  /* 標題字體大小 */
        font-weight: bold;  /* 加粗標題 */
    }

    /* 按鈕區塊樣式，讓按鈕並排顯示 */
    .header .btn-area {
        display: flex;
        gap: 15px;  /* 按鈕間隔 */
    }

    /* 按鈕樣式 */
    .header button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;  /* 圓角按鈕 */
        cursor: pointer;
        font-size: 16px;
        background-color: #4CAF50;  /* 默認綠色背景 */
        color: white;  /* 白色文字 */
        transition: background-color 0.3s ease;
    }

    .btn-area .user-data {  /* 用戶名顯示按鈕 */
        background-color: #2196F3;  /* 藍色背景 */
    }
    .btn-area .user-data:hover {
        background-color: #1976D2;  /* 用戶名按鈕懸停藍色 */
    }

    .btn-area .create-post {  /* 發文按鈕 */
        background-color: #ff9800;  /* 橙色背景 */
    }
    .btn-area .create-post:hover {
        background-color: #e68900;  /* 發文按鈕懸停橙色 */
    }

    .btn-area .logout {  /* 登出按鈕 */
        background-color: #f44336;  /* 紅色背景 */
    }
    .btn-area .logout:hover {
        background-color: #d22825;  /* 登出按鈕懸停紅色 */
    }


    /* 用戶資訊卡片樣式 */
    .user-info {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); /* 使其完全居中 */
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 80%; /* 可以根據需要調整寬度 */
        max-width: 500px; /* 限制最大寬度 */
        z-index: 1000; /* 確保顯示在其他元素之上 */
    }

    .user-info h2 {
        text-align: center;
    }

    .user-info p {
        font-size: 16px;
        padding: 8px 20%;
    }

    .user-info button {
        display: block;
        margin: 0 auto;
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px; /* 5px border-radius */
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s ease;
    }

    .user-info button:hover {
        background-color: #0056b3;
    }


    /* 發文區塊卡片設計 */
    .post-form {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 80%;
        max-width: 500px;
        z-index: 1000;
        text-align: center; /* 讓內容置中 */
    }

    /* textarea 設計 */
    .post-form textarea {
        width: 90%; /* 使 textarea 寬度自適應 */
        height: 300px;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        font-size: 14px;
        resize: vertical; /* 允許垂直調整大小 */
        line-height: 1.6; /* 增加行高，提升可讀性 */
        margin-bottom: 20px; /* 設置與按鈕的間距 */
    }

    /* 按鈕設計 */
    .post-form button {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 10px; /* 設置按鈕間距 */
        transition: background-color 0.3s ease;
    }

    /* 按鈕 hover 效果 */
    .post-form button:hover {
        background-color: #0056b3;
    }

    .post-form button + button {
        margin-left: 10px; /* 設置兩個按鈕的間距 */
    }
</style>
