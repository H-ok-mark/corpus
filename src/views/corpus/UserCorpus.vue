<script setup lang="ts">
    import { ref } from 'vue';
</script>

<template>
    <el-card class="index-container">
        <template #header>
            <div class="header">
                <span
                    >创建用户语料库 包括： 1. 上传语料库 2.
                    编辑自己的语料库</span
                >
            </div>
        </template>
    </el-card>
</template>

<style scoped>
    .index-container {
        min-height: 100%;
        box-sizing: border-box;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
