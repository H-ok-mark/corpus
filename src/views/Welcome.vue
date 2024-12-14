
<script setup lang="ts">
    import { ref } from 'vue';
</script>

<template>
    <el-card class="index-container">
        <template #header>
            <div class="header">
                <span>介绍平台的功能和亮点</span>
            </div>
        </template>

        <div>welcome to the platform</div>
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
