
<script setup lang="ts">
    import { ref } from 'vue';
    import { Search } from '@element-plus/icons-vue';
    const word = ref('');

    // 点击搜索按钮触发的方法
    const onSearch = () => {
        console.log('搜索内容:', word.value);
    };
    // 表格数据
    //修改表格排序
    const tableData = ref([
        {
            word: 'hello',
            frequency: '1',
            range: '10',
            query_count: '5',
        },
        {
            word: 'hello',
            frequency: '2',
            range: '10',
            query_count: '5',
        },
        {
            word: 'hello',
            frequency: '3',
            range: '10',
            query_count: '5',
        },
        {
            word: 'hello',
            frequency: '4',
            range: '10',
            query_count: '5',
        },
        {
            word: 'hello',
            frequency: '5',
            range: '10',
            query_count: '5',
        },
        {
            word: 'hello',
            frequency: '6',
            range: '10',
            query_count: '5',
        },
        {
            word: 'hello',
            frequency: '7',
            range: '10',
            query_count: '5',
        },
        {
            word: 'hello',
            frequency: '8',
            range: '10',
            query_count: '5',
        },
        {
            word: 'hello',
            frequency: '9',
            range: '10',
            query_count: '5',
        },
    ]);
    import { wordsSearchService } from '@/api/words.js';

    //分页条数据模型
    const pageNum = ref(1); //当前页
    const total = ref(100); //总条数
    const size = ref(10); // 每页显示的数据条数

    //调用搜索词频显示函数
    const searchWords = async () => {
        let result = await wordsSearchService({
            params: {
                word: word.value,
                page: pageNum.value,
                size: size.value,
            },
        });
        tableData.value = result.data;
        total.value = result.data.total;
    };
    //调用全部词频显示函数
    searchWords();
    // 处理分页变化
    const handlePageChange = newPage => {
        pageNum.value = newPage;
        searchWords(); // 当前页码变化时重新发起查询
    };
</script>

<template>
    <el-card class="words-container">
        <template #header>
            <div class="header">
                <h2>词频统计</h2>
            </div>
        </template>

        <!-- 词频搜索框 -->
        <div class="words-search">
            <el-input
                v-model="word"
                style="max-width: 600px"
                placeholder="Please input"
                size="large"
            >
                <template #append>
                    <el-button
                        class="search-button"
                        type="primary"
                        :icon="Search"
                        @click="onSearch"
                        >Search</el-button
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
                <el-table-column prop="word" label="Word" :width="250" />
                <el-table-column
                    prop="frequency"
                    label="Frequency"
                    :width="250"
                    sortable
                />
                <el-table-column prop="range" label="Range" />
            </el-table>
        </div>
        <!-- 分页条 -->
        <el-pagination
            v-model:current-page="pageNum"
            layout="jumper, total, prev, pager, next"
            background
            :total="total"
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

    /* 悬停时的样式 */
    .words-search .search-button:hover {
        background-color: #b4b8bb; /* 悬停时灰色变浅 */
        color: #fff;
    }

    /* 点击时的样式：按下按钮时缩小 */
    .words-search .search-button:active {
        transform: scale(0.95); /* 缩小按钮 5% */
        background-color: #63696b; /* 点击时按钮的灰色变深 */
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
