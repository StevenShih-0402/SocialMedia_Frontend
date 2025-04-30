<template>
    <div class="comments">
        <div v-for="comment in comments" :key="comment.id">
            <strong>{{ comment.userName }}:</strong> {{ comment.content }}
        </div>
        <div class="floor">
            <button @click="toggleReplyInput">B{{ index }}</button>
        </div>
    </div>
    <!-- 回覆留言輸入區 -->
    <div v-if="showReplyInput" class="comment-input">
        <div class="input-wrapper">
            <span class="reply-floor">B{{ index }}</span>
            <input v-model="replyContent" @keyup.enter="submitReply" placeholder="輸入回覆..." />
        </div>
        <button @click="submitReply">送出回覆</button>
    </div>
    <ErrorMessage v-if="errorMessage" :message="errorMessage" @update:message="errorMessage = $event" />
</template>

<script>
import { socialMediaService } from '@/services/api.js';
import ErrorMessage from './ErrorMessage.vue';

export default {
    props: {
        comment:{
            type: Object,
            default: null
        },
        index: {
            type: Number,
            required: true
        }
    },
    components: {
        ErrorMessage
    },
    data() {
        return {
            comments: [this.comment], // 直接接收單一留言
            showReplyInput: false,
            replyContent: '',
            errorMessage: ''
        };
    },
    methods: {
        toggleReplyInput() {
            this.showReplyInput = !this.showReplyInput;
            if (this.showReplyInput) {
                this.replyContent = '';
            }
        },
        async submitReply() {
            try {
                const commentData = { 
                    postId: this.comment.postId, 
                    content: `B${this.index} ${this.replyContent}`,
                    parentId: this.comment.id  // 添加要回覆的留言 ID
                };
                const response = await socialMediaService.createComment(commentData);
                if (response.code === '0' && response.message === 'SUCCESS') {
                    this.showReplyInput = false;
                    this.replyContent = '';
                    // 觸發父元件重新載入留言
                    this.$emit('refresh-comments');
                } else {
                    this.errorMessage = response.message;
                }
            } catch (error) {
                console.error("發送回覆失敗", error);
                this.errorMessage = "發送回覆失敗，請稍後再試";
            }
        }
    }
};
</script>

<style scoped>
    strong{
        padding-right: 5px;
    }

    /* 通用 comment 設計 */
    .comments {
        padding: 10px;
        display: flex;
        justify-content: space-between;
    }

    .floor button{
        margin: 0;
        background-color: inherit;  /* 繼承父元素的顏色 */
        border: none;
        cursor: pointer;
    }

    /* 回覆留言輸入區塊的樣式 */
    .comment-input {
        margin-top: 15px;
        padding: 15px;
        border-radius: 15px;
        background-color: #f9f9f9;
        display: flex;
        gap: 10px;
    }

    .input-wrapper {
        flex: 4;
        display: flex;
        align-items: center;
        gap: 5px;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 15px;
        padding: 0 10px;
    }

    .input-wrapper input {
        flex: 1;
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border: none;
        outline: none;
        background: transparent;
    }

    .comment-input button {
        flex: 1;
        background-color: #2196F3;
        padding: 10px 20px;
        margin-bottom: 10px;
        border-radius: 15px;
        color: white;
        font-size: 16px;
        width: 100%;
        border: none;
        cursor: pointer;
    }

    .comment-input button:hover {
        background-color: #1976D2;
    }

    /* 回覆樓層的樣式 */
    .reply-floor {
        color: #9c27b0;  /* 紫色 */
        font-weight: bold;
        white-space: nowrap;
    }

    /* 第一個 comment 的邊框圓角 */
    .comments:first-child {
        margin-top: 10px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    /* 最後一個 comment 的邊框圓角 */
    .comments:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    /* 偶數 comment 背景顏色 */
    .comments:nth-child(even) {
        background-color: #8efef7;
    }

    /* 奇數 comment 背景顏色 */
    .comments:nth-child(odd) {
        background-color: #c7ffb9;
    }
</style>
