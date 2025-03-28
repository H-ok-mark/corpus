<script setup lang="ts">
    import { ref } from 'vue';
    import { Search } from '@element-plus/icons-vue';
    import { useCorpusStore } from '@/stores/corpusStore';
    // import type { WordData } from '@/utils/apiTypes';

    const corpusStore = useCorpusStore();
    const word = ref('');

    // 表格数据
    // 修改表格排序
    const tableData = ref([]);

    import { wordsListService } from '@/api/words.js';
    import { ElMessage } from 'element-plus';
    import { el } from 'element-plus/dist/locale/zh-cn';
    import type { ComponentSize } from 'element-plus';

    //分页条数据模型
    const pageNum = ref(1); //当前页
    const total = ref(5000); //总条数
    const pageSize = ref(10); // 每页显示的数据条数
    const size = ref<ComponentSize>('default');

    const loading = ref(false);
    const allwords = ref(true);
    // 搜索词频显示函数
    const wordsList = async () => {
        loading.value = true;
        try {
            const result = await wordsListService({
                corpusId: corpusStore.appliedCorpusId,
                word: word.value,
                pageNum: pageNum.value,
                pageSize: pageSize.value,
            });
            total.value = result.total;

            if (!word.value) {
                tableData.value = result.data.map(item => ({
                    word: item.word,
                    frequency: item.frequency,
                    range: item.range,
                }));
                allwords.value = true;
            } else {
                tableData.value = [
                    {
                        word: result.data.word,
                        frequency: result.data.frequency,
                        range: result.data.range,
                    },
                ];
                allwords.value = false;
            }
        } catch (error) {
            ElMessage.info('请先选择要应用的语料库');
            tableData.value = [];
        } finally {
            loading.value = false;
        }
    };

    //调用全部词频显示函数
    if (corpusStore.appliedCorpusId != null) {
        wordsList();
    }

    const searchWord = () => {
        console.log('搜索值为：', word.value);
        console.log('当前应用的语料库为', corpusStore.appliedCorpusId);
        wordsList();
    };

    // 处理分页变化
    const handlePageChange = newPage => {
        pageNum.value = newPage;
        wordsList(); // 当前页码变化时重新发起查询
    };
    const handleSizeChange = (val: number) => {
        pageSize.value = val;
        wordsList(); // 每页显示条数变化时重新发起查询
    };
</script>

<template>
    <el-card class="words-container">
        <template #header>
            <div class="header">
                <h2>词频统计</h2>
                <p>当前语料库：《{{ corpusStore.appliedCorpusName }}》</p>
            </div>
        </template>

        <!-- 词频搜索框 -->
        <div class="words-search">
            <el-input
                v-model="word"
                style="max-width: 600px"
                placeholder="请输入要搜索的单词"
                size="large"
            >
                <template #append>
                    <el-button
                        class="search-button"
                        type="primary"
                        :icon="Search"
                        @click="searchWord()"
                        >搜索</el-button
                    >
                </template>
            </el-input>
        </div>
        <!-- 词频结果表格 -->
        <div class="search-result">
            <el-table
                :data="tableData"
                stripe
                style="width: 60%"
                :border="true"
                :default-sort="{ prop: 'frequency', order: 'descending' }"
                margin-left="200px"
            >
                <el-table-column prop="word" label="单词" :width="250" />
                <el-table-column
                    prop="frequency"
                    label="次数"
                    :width="250"
                    sortable
                />
                <el-table-column prop="range" label="频率" />
            </el-table>
        </div>
        <!-- 分页条1 -->
        <el-pagination
            v-if="allwords && tableData.length > 0 && tableData[0].word !== ''"
            v-model:current-page="pageNum"
            v-model:page-size="pageSize"
            :page-sizes="[10, 15, 20]"
            layout="sizes,jumper, prev, pager, next"
            background
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
            style="margin-top: 20px; justify-content: flex-end"
        />
    </el-card>
</template>

<style scoped>
    .words-search {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }

    /* 默认按钮样式 */
    .words-search .search-button {
        border-radius: 4px;
        font-weight: bold;
        padding: 6px 16px;
        transition: background-color 0.3s ease, color 0.3s ease, transform 0.1s ease;
    }

    .search-result {
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }

    .words-container {
        min-height: 100%;
        box-sizing: border-box;
    }

    .header {
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
