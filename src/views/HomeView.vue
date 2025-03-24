<template>
    <div class="home-container">
        <header class="header">
            <h2>社群平台</h2>
            <button @click="showUserData">{{ userData.userName }}</button>
            <button @click="createPost">發文</button>
            <button @click="logout">登出</button>
        </header>

        <!-- 顯示用戶資訊區塊 -->
        <div v-if="showUserInfo" class="user-info">
            <h3>用戶資訊</h3>
            <p><strong>用戶姓名：</strong>{{ userData.userName }}</p>
            <p><strong>電子郵件：</strong>{{ userData.email }}</p>
            <p><strong>電話號碼：</strong>{{ userData.phone }}</p>
            <p><strong>個人簡介：</strong>{{ userData.biography }}</p>
            <button @click="closeUserData">關閉</button>
        </div>

        <!-- 顯示發文區塊 -->
        <div v-if="showPostForm" class="post-form">
            <textarea v-model="newPostContent" placeholder="輸入您的貼文內容..."></textarea>
            <button @click="submitPost">發布</button>
            <button @click="cancelPost">返回</button>
        </div>

        <div class="content">
            <h3>貼文動態</h3>
            <div v-if="loading">載入中...</div>
            <div v-else-if="posts.length === 0">目前沒有貼文</div>
            <div v-else>
                <PostBlock v-for="post in posts" :key="post.id" :post="post" :current-user-id="userData.id" />
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

    .header {
        display: flex;
        justify-content: space-between;
        width: 100%;
        max-width: 800px;
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    .content {
        width: 100%;
        max-width: 800px;
        margin-top: 20px;
    }

    .user-info, .post-form {
    margin-top: 20px;
    }

    textarea {
        width: 100%;
        height: 100px;
    }

    button {
        margin-top: 10px;
    }
</style>
