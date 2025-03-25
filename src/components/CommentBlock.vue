<template>
    <div class="comments">
        <div v-for="comment in comments" :key="comment.id">
            <strong>{{ comment.userName }}:</strong> {{ comment.content }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        comment:{
            type: Object,
            default: null
        }
    },
    data() {
        return {
            comments: [this.comment] // 直接接收單一留言
        };
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
