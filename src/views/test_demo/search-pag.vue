<template>
    <el-card class="search-container">
        <template #header>
            <div class="header">
                <span>词频统计</span>
            </div>
        </template>

        <!-- 词频搜索框 -->
        <div class="search-box">
            <el-input
                v-model="word"
                placeholder="请输入搜索词"
                size="large"
                style="max-width: 400px"
            >
                <template #append>
                    <el-button
                        class="search-button"
                        type="primary"
                        icon="el-icon-search"
                        @click="searchWords"
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
                style="width: 100%"
                :border="true"
                :default-sort="{ prop: 'frequency', order: 'descending' }"
            >
                <el-table-column prop="word" label="Word" :width="250" />
                <el-table-column
                    prop="frequency"
                    label="Frequency"
                    :width="250"
                    sortable
                />
                <el-table-column prop="range" label="Range%" />
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
  
  <script setup lang="ts">
    import { ref } from 'vue';
    import axios from 'axios';

    const word = ref('');
    const tableData = ref([]);
    const pageNum = ref(1);
    const total = ref(0);
    const size = ref(10); // 每页显示的数据条数

    // 搜索词查询方法
    const searchWords = async () => {
        try {
            const response = await axios.get('/api/search', {
                params: {
                    word: word.value,
                    page: pageNum.value,
                    size: size.value,
                },
            });
            // 更新表格数据
            tableData.value = response.data.records;
            total.value = response.data.total;
        } catch (error) {
            console.error('搜索失败', error);
        }
    };

    // 处理分页变化
    const handlePageChange = newPage => {
        pageNum.value = newPage;
        searchWords(); // 当前页码变化时重新发起查询
    };

    // 组件挂载时默认查询
    searchWords();
</script>
  
  <style scoped>
    .search-box {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    .search-button {
        border-radius: 4px;
    }

    .search-result {
        margin-top: 20px;
    }

    .header {
        font-size: 18px;
        font-weight: bold;
    }
</style>
  