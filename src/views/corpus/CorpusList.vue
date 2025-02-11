<script setup lang="ts">
    import { ref } from 'vue';
    import { Search } from '@element-plus/icons-vue';

    // 搜索关键词
    const keyword = ref(null);

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
    const pageNum = ref(1);
    const total = ref(20);
    const pageSize = ref(4); // 每页显示的数据条数
    const isUser = ref(false);

    import { corpusListService, corpusDownloadService } from '@/api/corpusList.js';
    import { ElMessage } from 'element-plus';
    //获取语料库列表
    const corpusList = async () => {
        let result = await corpusListService({
            pageNum: pageNum.value,
            pageSize: pageSize.value,
            keyword: keyword.value,
            isUser: isUser.value,
        });

        // 将筛选后的数据存入 corpusListData
        corpusListData.value = result.data.map(item => {
            return {
                id: item.id,
                name: item.name,
                description: item.description,
                size: '10MB', // 这里可以根据需要设置静态值或动态计算
            };
        });
        total.value = result.total;
        console.log(corpusListData.value);
    };
    corpusList();

    //下载语料库
    const handleDownload = async (id: number) => {
        try {
            console.log('下载语料库:', id);
            const response = await corpusDownloadService(id);
            // 创建 Blob 对象，确保类型为 application/octet-stream
            const blob = new Blob([response.data], {
                type: 'application/octet-stream',
            });
            // 尝试从响应头中获取 filename，若无效则使用默认文件名
            const disposition = response.headers?.['content-disposition'];
            let filename = 'download.bin';
            if (disposition && disposition.indexOf('filename') !== -1) {
                const match = disposition.match(/filename\*?=([^;]+)/i);
                if (match && match[1]) {
                    filename = match[1].replace(/UTF-8''/i, '').trim();
                    filename = filename.replace(/['"]/g, '');
                    try {
                        filename = decodeURIComponent(filename);
                    } catch (e) {
                        console.warn('文件名解码失败，使用默认文件名');
                        filename = 'download.txt';
                    }
                }
            }
            // 因为后端返回的 header 无效，您也可以直接定义文件名
            // filename = '学术论文用词趋势.txt';
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('下载出错：', error);
            console.log(Blob);
        }
    };

    // 处理分页变化
    const handlePageChange = newPage => {
        pageNum.value = newPage;
        corpusList(); // 当前页码变化时重新发起查询
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
                v-model="keyword"
                placeholder="请输入语料库名称"
                class="search-input"
                size="large"
            >
                <template #append>
                    <el-button :icon="Search" @click="corpusList()">
                        搜索
                    </el-button>
                </template>
            </el-input>
        </div>

        <!-- 语料库列表 -->
        <div class="corpus-list">
            <el-card
                v-for="corpus in corpusListData"
                :key="corpus.id"
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
                            <el-button
                                type="primary"
                                size="large"
                                @click="handleDownload(corpus.id)"
                            >
                                下载
                            </el-button>
                        </el-button-group>
                    </div>
                </div>
            </el-card>
        </div>
        <!-- 分页查询 -->
        <div class="pagination">
            <el-pagination
                v-model:current-page="pageNum"
                v-model:page-size="pageSize"
                :total="total"
                layout="jumper,total,prev, pager, next "
                @current-change="handlePageChange"
            />
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
    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
</style>
