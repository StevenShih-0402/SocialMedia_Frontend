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
.comments {
    padding-left: 10px;
}
</style>
