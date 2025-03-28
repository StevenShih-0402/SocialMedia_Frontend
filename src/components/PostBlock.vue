<template>
    <div class="dropdown">
        <button v-if="isOwner" class="dropdown-btn" @click="toggleDropdown"><i class="fa fa-angle-down fa-2x"></i></button>
        <div class="dropdown-menu" v-show="isDropdownOpen">
            <!-- 編輯 & 刪除按鈕，只有目前的使用者可以看到 -->
            <button @click="toggleShowUpdateForm" class="btn-edit-post">編輯</button>
            <button @click="deletePost" class="btn-delete-post">刪除</button>
        </div>
    </div>
    <div class="post">
        <h3>{{ post.userName }}</h3>
        <hr>
        <p>{{ post.content }}</p>

        <div class="button-area">
            <button @click="toggleShowComments" class="btn-check-comment"><i class="fa fa-comments"></i>查看留言</button>
        </div>
        <!-- 顯示留言區塊 -->
        <div v-if="showComments">
            <CommentBlock v-for="comment in comments" :key="comment.id" :comment="comment" />
        </div>

        <!-- 留言輸入區 -->
        <div class="comment-input">
            <input v-model="newComment" @keyup.enter="addComment" placeholder="輸入留言..." />
            <button @click="addComment">送出留言</button>
        </div>

        <!-- 編輯發文區塊 -->
        <div v-if="showUpdateForm" class="update-post-overlay">
            <div v-if="showUpdateForm" class="update-post-form">
                <h2>修改發表內容</h2>
                <textarea v-model="updatePostContent" placeholder="輸入您的貼文內容..."></textarea>
                <div class="button-area">
                    <button @click="updatePost">發布</button>
                    <button @click="cancelPost">返回</button>
                </div>
            </div>
        </div>

        <ErrorMessage v-if="errorMessage" :message="errorMessage" @update:message="errorMessage = $event" />
    </div>
</template>

<script>
import CommentBlock from './CommentBlock.vue';
import { socialMediaService } from '@/services/api.js';
import ErrorMessage from './ErrorMessage.vue';

export default {
    props: {
        currentUserId: {
            type: String,
            default: ''
        },
        post: {
            type: Object,
            default: null
        }
    },
    async mounted() {
        await this.fetchComments();
    },
    components: {
        CommentBlock, ErrorMessage
    },
    data() {
        return {
            showComments: false,
            showUpdateForm: false,
            newComment: '',
            updatePostContent: this.post.content,
            comments: [], // 儲存留言資料
            errorMessage: '',
            isDropdownOpen: false,
        };
    },
    computed: {
        postId() {
            return this.post.id;
        },
        // 檢查目前登入的使用者是否為貼文擁有者
        isOwner() {
            return this.post.userId === this.currentUserId;
        }
    },
    methods: {
        toggleShowComments() {
            this.showComments = !this.showComments;
        },
        toggleShowUpdateForm() {
            this.showUpdateForm = !this.showUpdateForm;
            this.isDropdownOpen = false;
        },
        async addComment() {
            const commentData = { postId: this.post.id, content: this.newComment };
            const response = await socialMediaService.createComment(commentData);
            if (response.code === '0' && response.message === 'SUCCESS') {
                this.newComment = '';
                this.showComments = true;
                this.addingComment = false;
                // 新增留言後重新載入留言
                await this.fetchComments();
            }else{
                this.errorMessage = response.message;
            }
        },
        async fetchComments() {
            try {
                const commentData = { postId: this.post.id };
                const response = await socialMediaService.queryCommentInPost(commentData);
                this.comments = response.data; // 設定留言資料
            } catch (error) {
                console.error("獲取留言失敗", error);
            }
        },
        async updatePost() {
            const postData = { id: this.post.id, content: this.updatePostContent };
            const response = await socialMediaService.updatePost(postData);
            if (response.code === '0' && response.message === 'SUCCESS') {
                this.showUpdateForm = false; // 隱藏發文表單
                this.updatePostContent = response.data.content;  // 重新初始化貼文內容
                // this.$emit("refreshPosts"); // 觸發父元件刷新貼文列表
                location.reload();
            } else {
                this.errorMessage = response.message;
            }
        },
        cancelPost() {
            this.showUpdateForm = false;
            this.updatePostContent = this.post.content;
        },
        async deletePost() {
            this.isDropdownOpen = false;
            if(this.post.userId === this.currentUserId){
                if (confirm("確定要刪除這篇貼文嗎？")) {
                    console.log(this.post.id);
                    const postData = { id: this.post.id };
                    await socialMediaService.deletePost(postData);
                    // this.$emit("refreshPosts"); // 觸發父元件刷新貼文列表
                    location.reload();
                }
            }
            else{
                this.errorMessage = "只有自己發布的文章才可以進行刪除。";
            }
        },
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
    }
};
</script>

<style scoped>

    .comments {
        padding-left: 10px;
    }
    .delete-confirm {
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        color: white;
    }


    /* 編輯發文區塊 */
    .update-post-form {
        position: fixed;  /* 使發文區塊固定在畫面中央 */
        top: 50%;  /* 垂直置中 */
        left: 50%;  /* 水平置中 */
        transform: translate(-50%, -50%);  /* 真正的置中效果 */
        background-color: white;  /* 發文區塊的背景顏色 */
        padding: 20px;
        border-radius: 10px;  /* 邊框圓角 */
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);  /* 輕微陰影效果 */
        z-index: 1;  /* 確保它在其他元素之上 */
        width: 80%;  /* 控制發文區塊寬度 */
        max-width: 500px;  /* 控制最大寬度 */
    }

    /* 背景亮度降低效果 */
    .update-post-overlay {
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

    .update-post-form h2{
        text-align: center;
    }

    /* textarea 的樣式 */
    .update-post-form textarea {
        width: 100%;
        height: 300px;
        padding: 10px;
        font-size: 16px;
        border-radius: 5px;  /* 邊框圓角 */
        border: 1px solid #ccc;
        resize: vertical;  /* 允許垂直調整大小 */
        box-sizing: border-box;
        outline: none;
    }

    /* 發布和返回按鈕的樣式 */
    .update-post-form button {
        padding: 10px 20px;
        margin-top: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: #4CAF50;  /* 綠色背景 */
        color: white;
        font-size: 16px;
        transition: background-color 0.3s ease;  /* 滑鼠懸停變化 */
    }

    .update-post-form button:hover {
        background-color: #45a049;  /* 懸停時的顏色 */
    }

    /* 返回按鈕樣式，與發布按鈕不同 */
    .update-post-form button:last-child {
        background-color: #f44336;  /* 紅色背景 */
    }

    .update-post-form button:last-child:hover {
        background-color: #e53935;  /* 懸停時的顏色 */
    }


    /* Post 的卡片設計 */
    .post {
        border: 1px solid #ccc;
        margin-bottom: 10px;
        background-color: #fff;  /* 白色背景 */
        padding: 20px;
        border-radius: 10px;  /* 圓角邊框 */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);  /* 陰影效果 */
        margin-bottom: 20px;  /* 每個 Post 之間的間距 */
        width: 100%;
        max-width: 600px;  /* 最大寬度 */
        margin-left: auto;
        margin-right: auto;  /* 置中 */
        overflow: hidden;  /* 防止內容溢出 */
    }

    /* 標題 (h3) 和內容 (p) 保持左對齊 */
    .post h3 {
        margin: 0;
        font-size: 18px;
        font-weight: bold;
    }

    .post p {
        margin-top: 10px;
        line-height: 1.5;  /* 增加行高，使文字更易讀 */
        white-space: pre-wrap;  /* 保留換行效果 */
        word-wrap: break-word;  /* 超過寬度自動換行 */
    }

    /* 按鈕樣式 */
    .button-area{
        display: flex;
        gap: 10px;
    }
    .button-area button {
        padding: 10px 20px;
        margin-top: 10px;
        border: none;
        border-radius: 5px;  /* 5px 圓角邊框 */
        cursor: pointer;
        background-color: #4CAF50;  /* 默認綠色背景 */
        color: white;
        font-size: 16px;
        transition: background-color 0.3s ease;
        width: 100%;  /* 讓按鈕佔滿寬度 */
    }

    /* 當按鈕懸停時，改變背景顏色 */
    .button-area button:hover {
        background-color: #45a049;
    }

    /* 編輯和刪除按鈕的不同背景色 */
    .btn-edit-post {  /* 編輯按鈕 */
        background-color: #ff9800;
        color: white;
        border: none;
    }

    .btn-edit-post:hover {
        background-color: #e68900;
    }

    .btn-delete-post {  /* 刪除按鈕 */
        background-color: #f44336;
        color: white;
        border: none;
    }

    .btn-delete-post:hover {
        background-color: #e53935;
    }


    
    /* 留言輸入區塊的樣式 */
    .comment-input {
        margin-top: 15px;  /* 留言區塊和按鈕之間的間隔 */
        padding: 15px;
        border-radius: 15px;  /* 圓角 */
        background-color: #f9f9f9;  /* 淺灰背景 */
        display: flex;
        gap: 10px;
    }

    .comment-input input {
        flex: 4;
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border-radius: 15px;  /* 圓角 */
        border: 1px solid #ccc;
        margin-bottom: 10px;
        outline: none;
    }

    .comment-input button {
        flex: 1;
        background-color: #2196F3;  /* 藍色背景 */
        padding: 10px 20px;
        margin-bottom: 10px;
        border-radius: 15px;  /* 圓角 */
        color: white;
        font-size: 16px;
        width: 100%;
        border: none;
        cursor: pointer;
    }

    .comment-input button:hover {
        background-color: #1976D2;  /* 懸停時的藍色 */
    }

    .fa-comments{
        margin-right: 10px;
    }

    /* 下拉選單 */
    .dropdown {
        position: relative;
    }
    .dropdown-btn {
        position: absolute;
        top: 10px;
        left: 85%;
        border: none;
        background-color: white;
        cursor: pointer;
        z-index: 0;
    }

    .dropdown-menu {
        position: absolute;
        top: 40px;
        right: 12%;
        border-radius: 5px;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        min-width: 200px;
    }

    .dropdown-menu button{
        padding: 10px;
        text-align: left;
        cursor: pointer;
    }
</style>