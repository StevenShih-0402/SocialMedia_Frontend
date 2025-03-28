<template>
    <div class="home-container">
        <header class="header">
            <h2>社群平台</h2>
            <div class="header-btn">
                <button @click="createPost" class="create-post">發文</button>
                <div class="dropdown">
                    <button class="dropdown-btn" @click="toggleDropdown"><i class="fa fa-bars fa-2x"></i></button>
                    <div class="dropdown-menu" v-show="isDropdownOpen">
                        <button @click="showUserData">{{ userData.userName }}</button>
                        <button @click="logout">登出</button>
                    </div>
                </div>
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

        <div class="control-btns">
            <button class="back-to-top" @click="scrollToTop"> ▲ </button>
            <button class="go-to-bottom" @click="scrollToBottom"> ▼ </button>
        </div>

        <ErrorMessage v-if="errorMessage" :message="errorMessage" @update:message="errorMessage = $event" />
    </div>
</template>

<script>
import { socialMediaService } from '@/services/api.js';
import PostBlock from '@/components/PostBlock.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import _ from "lodash";     // Lodash(_) 是一個 JavaScript 工具函式庫，提供許多實用的函式來處理陣列、物件、字串、數學計算等。

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
            newPostContent: '',    // 儲存新貼文內容
            isDropdownOpen: false, // 下拉清單顯示狀態
            pageNo: 0,             // 目前的頁數
            pageSize: 5,           // 每個分頁的頁數
            isLoading: false,      // 避免重複加載
            hasMore: true          // 若剩餘文章數為 0 則不執行查詢
        };
    },
    async mounted() {
        await this.fetchPosts();
        await this.showUserData();
        this.showUserInfo = false;
        window.addEventListener("scroll", _.throttle(this.handleScroll, 1000)); // 監聽滾動事件，並設定節流，每秒最多觸發一次
    },
    beforeUnmount() {
        window.removeEventListener("scroll", this.handleScroll); // 離開頁面前移除事件監聽
    },
    methods: {
        scrollToTop() {
            window.scrollTo({ top: 0, behavior: "smooth" }); // 平滑滾動到頂部
        },
        scrollToBottom() {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" }); // 平滑滾動到底部
        },
        handleScroll() {
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.offsetHeight;
            const bottomOffset = 100; // 提前 100px 觸發加載

            if (scrollPosition >= pageHeight - bottomOffset) {
                this.loadMorePosts();
            }
        },
        async loadMorePosts() {
            if (!this.isLoading || this.hasMore){
                this.isLoading = true; // **立即設為 true，避免短時間內重複觸發**
                await this.fetchPosts();
                this.isLoading = false; // **確保請求完成後才解除鎖定**
            }
        },
        async fetchPosts() {
            try {
                if(this.hasMore){               
                    const postData = {
                        pageNo: this.pageNo,
                        pageSize: this.pageSize
                    };
                    const response = await socialMediaService.queryAllPosts(postData);
                    if (response.code === '0' && response.message === 'SUCCESS') {
                        // this.posts = response.data;
                        if (response.data.length > 0) {
                            this.posts = [...this.posts, ...response.data]; // 追加新資料
                            this.pageNo++;  // 正確增加頁數
                        } else {
                            this.hasMore = false; // **如果回傳 0 筆資料，代表沒有更多數據**
                        }
                    } else {
                        this.errorMessage = response.message;
                    }
                }
            } catch (error) {
                console.error("獲取貼文失敗", error);
                this.errorMessage = '無法載入貼文';
            } finally {
                this.loading = false;
                setTimeout(() => { this.isLoading = false; }, 500); // 0.5 秒後允許下一次加載
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
                this.isDropdownOpen = false;
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
                    // await this.fetchPosts();
                    location.reload();
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
            this.isDropdownOpen = false;
        },
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
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
    .header-btn{
        display: flex;
        gap: 10px;
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
        z-index: 4;
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
        z-index: 3;
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
        padding: 5px 20px;
        border: none;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        transition: background-color 0.3s ease;
    }

    .create-post {  /* 發文按鈕 */
        background-color: #ff9800;  /* 橙色背景 */
        color: white;
        border-radius: 5px;
    }
    .create-post:hover {
        background-color: #e68900;  /* 發文按鈕懸停橙色 */
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
        z-index: 2; /* 確保顯示在其他元素之上 */
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
        z-index: 2;
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

    /* 下拉選單 */
    .dropdown {
        position: relative;
    }
    .dropdown-btn {
        background-color: #333;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        right: 0%;
        border-radius: 5px;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        min-width: 200px;
        margin-top: 12px;
    }

    .dropdown-menu button{
        padding: 10px;
        text-align: left;
        cursor: pointer;
    }

    .dropdown-menu button:last-child{
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .dropdown-menu button:hover {
        background-color: #333;
        color: white;
    }

    /* 回到頁面最上/最下層 */
    .control-btns{
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: fixed;
        bottom: 40px;
        right: 20px;
    }

    .back-to-top,
    .go-to-bottom{
        padding: 10px 15px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: opacity 0.3s;
    }
    .back-to-top:hover, 
    .go-to-bottom:hover {
        background-color: #0056b3;
    }
</style>
