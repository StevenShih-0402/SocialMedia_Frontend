<template>
    <div class="post">
        <h3>{{ post.userName }}</h3>
        <p>{{ post.content }}</p>
        <button @click="toggleShowComments">查看留言</button>
        <button @click="toggleCommentInput">新增留言</button>

        <!-- 編輯 & 刪除按鈕，僅當前使用者可見 -->
        <button v-if="isOwner" @click="toggleShowUpdateForm">編輯</button>
        <button v-if="isOwner" @click="deletePost">刪除</button>
        
        <!-- 顯示留言區塊 -->
        <div v-if="showComments">
            <CommentBlock v-for="comment in comments" :key="comment.id" :comment="comment" />
        </div>

        <!-- 留言輸入區 -->
        <div v-if="addingComment">
            <input v-model="newComment" @keyup.enter="addComment" placeholder="輸入留言..." />
            <button @click="addComment">送出留言</button>
        </div>

        <!-- 編輯發文區塊 -->
        <div v-if="showUpdateForm" class="update-post-form">
            <textarea v-model="updatePostContent" placeholder="輸入您的貼文內容..."></textarea>
            <button @click="updatePost">發布</button>
            <button @click="cancelPost">返回</button>
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
            addingComment: false,
            newComment: '',
            updatePostContent: this.post.content,
            comments: [], // 儲存留言資料
            errorMessage: ''
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
        toggleCommentInput() {
            this.addingComment = !this.addingComment;
        },
        toggleShowComments() {
            this.showComments = !this.showComments;
        },
        toggleShowUpdateForm() {
            this.showUpdateForm = !this.showUpdateForm;
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
                this.$emit("refreshPosts"); // 觸發父元件刷新貼文列表
            } else {
                this.errorMessage = response.message;
            }
        },
        cancelPost() {
            this.showUpdateForm = false;
            this.updatePostContent = this.post.content;
        },
        async deletePost() {
            if(this.post.userId === this.currentUserId){
                if (confirm("確定要刪除這篇貼文嗎？")) {
                    const postData = { id: this.post.id };
                    await socialMediaService.deletePost(postData);
                    this.$emit("refreshPosts"); // 觸發父元件刷新貼文列表
                }
            }
            else{
                this.errorMessage = "只有自己發布的文章才可以進行刪除。";
            }
        }

    }
};
</script>

<style scoped>
.post {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
}

.comments {
    padding-left: 10px;
}

.delete-confirm {
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;
    color: white;
}
</style>