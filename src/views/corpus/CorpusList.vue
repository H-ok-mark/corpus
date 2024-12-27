<script setup lang="ts">
    import { ref } from 'vue';
    import { Search } from '@element-plus/icons-vue';

    // 搜索关键词
    const searchQuery = ref('');

    // 模拟的语料库数据
    const corpusListData = ref([
        {
            id: 1,
            name: '英语新闻语料库',
            description: '包含近5年的英语新闻文章，涵盖政治、经济、科技等领域',
            size: '10MB',
        },
        {
            id: 2,
            name: '学术论文语料库',
            description: '收录各领域英语学术论文摘要，适合学术写作研究',
            size: '15MB',
        },
        {
            id: 3,
            name: '文学作品语料库',
            description: '经典英语文学作品集合，包括小说、诗歌等体裁',
            size: '20MB',
        },
    ]);

    import { corpusListService } from '@/api/corpusList.js';
    const corpusList = async () => {
        let result = await corpusListService();
        corpusListData.value = result.data;
    };
    // 搜索方法
    const handleSearch = () => {
        console.log('搜索关键词:', searchQuery.value);
    };
</script>

<template>
    <el-card class="corpus-container">
        <template #header>
            <div class="header">
                <h2>获取语料库</h2>
            </div>
        </template>
        <!-- 搜索框 -->
        <div class="search-box">
            <el-input
                v-model="searchQuery"
                placeholder="请输入语料库名称"
                class="search-input"
                size="large"
            >
                <template #append>
                    <el-button :icon="Search" @click="handleSearch">
                        搜索
                    </el-button>
                </template>
            </el-input>
        </div>

        <!-- 语料库列表 -->
        <div class="corpus-list">
            <el-card
                v-for="corpus in corpusListData"
                :key="corpus.name"
                class="corpus-item"
                shadow="hover"
            >
                <div class="corpus-content">
                    <div class="corpus-info">
                        <h2 class="corpus-title">
                            {{ corpus.name }}
                            <el-tag
                                class="corpus-tag"
                                type="info"
                                size="small"
                                >{{ corpus.size }}</el-tag
                            >
                        </h2>

                        <p class="corpus-description">
                            {{ corpus.description }}
                        </p>
                    </div>
                    <div class="corpus-actions">
                        <el-button-group>
                            <el-button type="primary" size="large">
                                下载
                            </el-button>
                        </el-button-group>
                    </div>
                </div>
            </el-card>
        </div>
    </el-card>
</template>

<style scoped>
    .corpus-container {
        padding: 20px;
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .search-box {
        max-width: 600px;
        margin: 20px auto;
    }

    .search-input {
        width: 100%;
    }

    .corpus-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-top: 20px;
    }

    .corpus-item {
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .corpus-item:hover {
        transform: translateX(5px);
    }

    .corpus-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }

    .corpus-info {
        flex: 1;
        margin-right: 20px;
    }

    .corpus-title {
        margin: 0 0 8px 0;
        font-size: 20px;
        color: #303133;
    }
    .corpus-tag {
        margin-left: 30px;
    }

    .corpus-description {
        margin: 0;
        color: #606266;
        font-size: 14px;
    }

    .corpus-actions {
        flex-shrink: 0;
    }

    :deep(.el-button-group .el-button) {
        margin-right: -1px;
    }
</style>
