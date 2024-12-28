<template>
    <el-card>
        <!-- 数据表格 -->
        <el-table :data="tableData" stripe>
            <el-table-column label="ID" prop="id" width="100"></el-table-column>
            <el-table-column label="Name" prop="name"></el-table-column>
            <el-table-column
                label="Age"
                prop="age"
                width="100"
            ></el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange"
        />
    </el-card>
</template>
  
  <script setup lang="ts">
    import { ref } from 'vue';
    import { ElMessage } from 'element-plus';
    import axios from 'axios';

    // 设定分页相关的响应数据
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(10); // 每页显示的条数
    const total = ref(100); // 总数据条数
    const tableData = ref([]); // 表格数据

    // 请求数据函数
    const fetchData = async (page: number, size: number) => {
        try {
            // 发起请求
            const response = await axios.get('/api/v1/data', {
                params: {
                    page, // 当前页
                    size, // 每页条数
                },
            });

            // 假设返回的结构是 { data: [], total: 100 }
            const { data, totalCount } = response.data;

            // 更新表格数据和总条数
            tableData.value = data;
            total.value = totalCount;
        } catch (error) {
            ElMessage.error('数据加载失败');
        }
    };

    // 页面切换时的回调
    const handlePageChange = (page: number) => {
        currentPage.value = page;
        fetchData(page, pageSize.value);
    };

    // 初始化数据
    fetchData(currentPage.value, pageSize.value);
</script>
  
  <style scoped>
    /* 可根据需要调整样式 */
</style>
  