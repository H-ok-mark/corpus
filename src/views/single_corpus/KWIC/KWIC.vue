<script setup lang="ts">
    import { ref, reactive, computed } from 'vue';
    import {
        Search,
        Aim,
        PieChart,
        Connection,
        Filter,
        Download,
        FullScreen,
        Star,
        DataLine,
        Operation,
    } from '@element-plus/icons-vue';

    // 搜索词
    const searchWord = ref('');
    const hasSearchResult = ref(false);

    // 词义分析数据
    const semanticResults = ref([
        {
            definition: '椅子(家具)',
        },
        {
            definition: '主席(职位)',
        },
        {
            definition: '教授(职位)',
        },
    ]);

    // 句法结构数据
    const syntaxPatterns = ref([
        {
            structure: 'get + 名词',
        },
        {
            structure: 'get + 形容词',
        },
    ]);

    // KWIC数据
    const kwicData = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(100);
    // 表格数据
    //修改表格排序
    const tableData = [
        {
            file: 'hello',
            left: '1',
            node: '10',
            right: '10',
        },
        {
            file: 'hello',
            context: 'The chair of the meeting decided to postpone the vote.',
            leftContext: 'The',
            keyword: 'chair',
            rightContext: 'of the meeting decided to postpone the vote.',
        },
    ];

    // 处理搜索
    const handleSearch = () => {
        if (!searchWord.value) return;
        hasSearchResult.value = true;
        // TODO: 调用API获取分析结果
    };

    // 处理分页
    const handlePageChange = (page: number) => {
        currentPage.value = page;
        // TODO: 获取对应页的数据
    };
    // 筛选框的复选内容数组
    const Filters = [
        { text: 'L1', value: 'L1' },
        { text: 'L2', value: 'L2' },
        { text: 'L3', value: 'L3' },
        { text: 'L4', value: 'L4' },
        { text: 'L5', value: 'L5' },
        { text: 'L6', value: 'L6' },
        { text: 'L7', value: 'L7' },
        { text: 'L8', value: 'L8' },
        { text: 'L9', value: 'L9' },
        { text: 'L10', value: 'L10' },
    ];

    // 存储选中的复选框内容
    const selectedLeftFilters = ref(['L1', 'L2', 'L3', 'L4', 'L5']);
    const selectedRightFilters = ref(['L1', 'L2', 'L3', 'L4', 'L5']);

    // 控制 Popover 显示状态
    const isLeftPopoverVisible = ref(false);
    const isRightPopoverVisible = ref(false);

    // 清空筛选
    const clearLeftFilter = () => {
        selectedLeftFilters.value = [];
    };
    const clearRightFilter = () => {
        selectedRightFilters.value = [];
    };

    // 应用筛选：关闭 Popover 并打印选中的值
    const applyFilter = () => {
        console.log('选中的筛选条件:', selectedLeftFilters.value);
        console.log('选中的筛选条件:', selectedRightFilters.value);
        isLeftPopoverVisible.value = false;
        isRightPopoverVisible.value = false; // 关闭弹出框
    };
    // 控制 Popover 显示状态
    const isNodePopoverVisible = ref(false);

    // 添加词汇用法数据
    const vocabUsageData = ref([
        {
            subject: 'The chair',
            adverbOrModal: 'usually',
            adjective: 'comfortable',
            none: '',
        },
        {
            subject: 'He',
            adverbOrModal: 'will',
            adjective: '',
            none: 'chairs',
        },
        {
            subject: 'They',
            adverbOrModal: 'might',
            adjective: 'wooden',
            none: '',
        },
    ]);

    // 控制弹窗显示
    const dialogVisible = ref(false);
    // 分页参数
    const dialogCurrentPage = ref(1);
    const dialogPageSize = ref(10);

    // 计算分页后的数据
    const paginatedData = computed(() => {
        const start = (dialogCurrentPage.value - 1) * dialogPageSize.value;
        const end = start + dialogPageSize.value;
        return vocabUsageData.value.slice(start, end);
    });

    // 处理分页变化
    const handleDialogPageChange = (val: number) => {
        dialogCurrentPage.value = val;
    };

    // 加载状态控制
    const semanticLoading = ref(false);
    const vocabLoading = ref(false);
    const syntaxLoading = ref(false);

    // 内容显示控制
    const showSemanticContent = ref(false);
    const showVocabContent = ref(false);
    const showSyntaxContent = ref(false);

    // 处理开始分析点击事件
    const handleStartAnalysis = async (type: string) => {
        switch (type) {
            case 'semantic':
                semanticLoading.value = true;
                await new Promise(resolve => setTimeout(resolve, 1000));
                showSemanticContent.value = true;
                semanticLoading.value = false;
                break;
            case 'vocab':
                vocabLoading.value = true;
                await new Promise(resolve => setTimeout(resolve, 1000));
                showVocabContent.value = true;
                vocabLoading.value = false;
                break;
            case 'syntax':
                syntaxLoading.value = true;
                await new Promise(resolve => setTimeout(resolve, 1000));
                showSyntaxContent.value = true;
                syntaxLoading.value = false;
                break;
        }
    };
</script>

<template>
    <div class="kwic-analysis">
        <!-- 搜索区域 -->
        <el-card class="search-card" shadow="hover">
            <div class="search-area">
                <h2>KWIC智能分析</h2>
                <el-input
                    v-model="searchWord"
                    placeholder="请输入检索词"
                    class="search-input"
                    size="large"
                >
                    <template #append>
                        <el-button :icon="Search" @click="handleSearch">
                            Search
                        </el-button>
                    </template>
                </el-input>
            </div>
        </el-card>

        <!-- 分析结果展示区 -->
        <div class="analysis-cards" v-if="hasSearchResult">
            <!-- 词义分析卡片 -->
            <el-card class="semantic-card" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <h3>
                            <el-icon><Aim /></el-icon> 词义分析
                        </h3>
                        <h4>
                            <el-tag type="info" size="large"
                                >共{{ semanticResults.length }} 种词义</el-tag
                            >
                        </h4>
                    </div>
                </template>
                <div v-if="!showSemanticContent" class="card-empty">
                    <el-button
                        type="primary"
                        :loading="semanticLoading"
                        @click="handleStartAnalysis('semantic')"
                        size="large"
                    >
                        开始使用
                    </el-button>
                </div>
                <div v-else>
                    <el-skeleton :loading="semanticLoading" animated :rows="3">
                        <template #default>
                            <div class="meaning-contain">
                                <div
                                    v-for="(meaning, index) in semanticResults"
                                    :key="index"
                                    class="meaning-item"
                                >
                                    <div class="meaning-header">
                                        <span class="meaning-definition"
                                            >{{ meaning.definition }}
                                        </span>
                                        <el-button
                                            circle
                                            type="default"
                                            :icon="Search"
                                            size="small"
                                        ></el-button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-skeleton>
                </div>
            </el-card>

            <!-- 词汇用法总结卡片 -->
            <el-card class="vocab-usage-card" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <h3>
                            <el-icon><DataLine /></el-icon> 词汇用法总结
                        </h3>
                        <el-button
                            class="fullscreen-btn"
                            type="default"
                            :icon="FullScreen"
                            circle
                            size="large"
                            @click="dialogVisible = true"
                        />
                    </div>
                </template>
                <div v-if="!showVocabContent" class="card-empty">
                    <el-button
                        size="large"
                        type="primary"
                        :loading="vocabLoading"
                        @click="handleStartAnalysis('vocab')"
                    >
                        开始使用
                    </el-button>
                </div>
                <div v-else>
                    <el-skeleton :loading="vocabLoading" animated :rows="3">
                        <template #default>
                            <div class="vocab-usage-table scrollable">
                                <el-table
                                    :data="vocabUsageData"
                                    style="width: 120%"
                                    :border="true"
                                    stripe
                                    height="300"
                                >
                                    <el-table-column
                                        prop="subject"
                                        label="Subject"
                                    />
                                    <el-table-column
                                        prop="adverbOrModal"
                                        label="Adverb/Modal"
                                    />
                                    <el-table-column
                                        prop="adjective"
                                        label="Adjective"
                                    />
                                    <el-table-column prop="none" label="None" />
                                </el-table>
                            </div>
                        </template>
                    </el-skeleton>
                </div>
            </el-card>

            <!-- 全屏弹窗 -->
            <el-dialog
                v-model="dialogVisible"
                title="词汇用法总结"
                fullscreen
                :show-close="true"
            >
                <el-table
                    class="fullScreenTable"
                    :data="paginatedData"
                    style="width: 100%"
                    :border="true"
                    stripe
                >
                    <el-table-column prop="subject" label="Subject" />
                    <el-table-column
                        prop="adverbOrModal"
                        label="Adverb/Modal"
                    />
                    <el-table-column prop="adjective" label="Adjective" />
                    <el-table-column prop="none" label="None" />
                </el-table>

                <div class="dialog-pagination">
                    <el-pagination
                        v-model:current-page="dialogCurrentPage"
                        :page-size="dialogPageSize"
                        :total="vocabUsageData.length"
                        @current-change="handleDialogPageChange"
                        layout="total, prev, pager, next"
                    />
                </div>
            </el-dialog>

            <!-- 句法结构分析卡片 -->
            <el-card class="syntax-card" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <h3>
                            <el-icon><Operation /></el-icon> 句法结构分析
                        </h3>
                        <h4>
                            <el-tag type="info" size="large"
                                >共{{ syntaxPatterns.length }}种结构</el-tag
                            >
                        </h4>
                    </div>
                </template>
                <div v-if="!showSyntaxContent" class="card-empty">
                    <el-button
                        type="primary"
                        :loading="syntaxLoading"
                        @click="handleStartAnalysis('syntax')"
                        size="large"
                    >
                        开始使用
                    </el-button>
                </div>
                <div v-else>
                    <el-skeleton :loading="syntaxLoading" animated :rows="3">
                        <template #default>
                            <div class="syntax-list">
                                <div
                                    v-for="(pattern, index) in syntaxPatterns"
                                    :key="index"
                                    class="syntax-item"
                                >
                                    <div class="pattern-content">
                                        <span class="pattern-structure"
                                            >{{ pattern.structure }}
                                        </span>
                                        <el-button
                                            circle
                                            type="default"
                                            :icon="Search"
                                            size="small"
                                        ></el-button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-skeleton>
                </div>
            </el-card>
        </div>

        <!-- KWIC详情表格 -->
        <el-card class="kwic-table-card" shadow="hover" v-if="hasSearchResult">
            <div class="search-result">
                <el-table
                    :data="tableData"
                    stripe
                    style="width: 100%"
                    :border="true"
                    margin-left="200px"
                >
                    <el-table-column prop="file" label="File" :width="100" />
                    <el-table-column prop="left" label="Left Context">
                        <!-- 自定义表头内容 -->
                        <template #header>
                            <div
                                style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                "
                            >
                                <span>左边内容</span>
                                <!-- 筛选按钮 -->
                                <el-popover
                                    placement="bottom"
                                    trigger="click"
                                    width="200"
                                    v-model:visible="isLeftPopoverVisible"
                                >
                                    <template #reference>
                                        <el-button
                                            size="default"
                                            type="info"
                                            plain
                                            :icon="Filter"
                                            circle
                                        ></el-button>
                                    </template>

                                    <!-- 筛选内容：复选框组 -->
                                    <el-checkbox-group
                                        v-model="selectedLeftFilters"
                                    >
                                        <el-checkbox
                                            v-for="item in Filters"
                                            :key="item.value"
                                            :label="item.value"
                                        >
                                            {{ item.text }}
                                        </el-checkbox>
                                    </el-checkbox-group>

                                    <!-- 筛选操作按钮：两端分布 -->
                                    <div
                                        style="display: flex; margin-top: 10px"
                                    >
                                        <el-button
                                            size="small"
                                            @click="clearLeftFilter"
                                            >清空</el-button
                                        >
                                        <el-button
                                            size="small"
                                            type="primary"
                                            @click="applyFilter"
                                            >确定</el-button
                                        >
                                    </div>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>

                    <!-- Node列 -->
                    <el-table-column prop="node" label="词" :width="200">
                        <!-- 自定义表头内容 -->
                    </el-table-column>

                    <el-table-column prop="right" label="Right Context">
                        <!-- 自定义表头内容 -->
                        <template #header>
                            <div
                                style="
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                "
                            >
                                <!-- 标题 -->
                                <span>右边内容</span>

                                <!-- 筛选按钮 -->
                                <el-popover
                                    placement="bottom"
                                    trigger="click"
                                    width="200"
                                    v-model:visible="isRightPopoverVisible"
                                >
                                    <template #reference>
                                        <el-button
                                            size="default"
                                            type="info"
                                            plain
                                            :icon="Filter"
                                            circle
                                        ></el-button>
                                    </template>

                                    <!-- 筛选内容：复选框组 -->
                                    <el-checkbox-group
                                        v-model="selectedRightFilters"
                                    >
                                        <el-checkbox
                                            v-for="item in Filters"
                                            :key="item.value"
                                            :label="item.value"
                                        >
                                            {{ item.text }}
                                        </el-checkbox>
                                    </el-checkbox-group>

                                    <!-- 筛选操作按钮：两端分布 -->
                                    <div
                                        style="display: flex; margin-top: 10px"
                                    >
                                        <el-button
                                            size="small"
                                            @click="clearRightFilter"
                                            >清空</el-button
                                        >
                                        <el-button
                                            size="small"
                                            type="primary"
                                            @click="applyFilter"
                                            >确定</el-button
                                        >
                                    </div>
                                </el-popover>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                        v-model:current-page="currentPage"
                        :page-size="pageSize"
                        :total="total"
                        @current-change="handlePageChange"
                    />
                </div>
            </div>
        </el-card>
    </div>
</template>
  

<style scoped>
    .kwic-analysis {
        background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
        min-height: calc(100vh - 48px);
    }

    /* 搜索区域 */
    .search-card {
        border-radius: 12px;
        margin-bottom: 24px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .search-area {
        padding: 32px;
        text-align: center;
    }

    .search-area h2 {
        font-size: 28px;
        margin-bottom: 24px;
        letter-spacing: 1px;
    }

    .search-input {
        max-width: 600px;
        margin: 0 auto;
    }

    /* 分析卡片区域 */
    .analysis-cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        margin-bottom: 24px;
    }

    .semantic-card {
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: rgba(255, 255, 255, 0.9);
    }

    .semantic-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .card-header {
        padding: 16px 20px;
        border-bottom: 1px solid #ebeef5;
        background: #fafbfc;
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .fullscreen-btn {
        transition: all 0.3s;
    }

    .fullscreen-btn:hover {
        transform: scale(1.1);
    }

    .card-header h3 {
        font-size: 18px;
        color: #303133;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .begin-btn {
        display: flex;
        margin-left: 40%;
        margin-top: 10%;
    }
    /* 分析卡片区域 */

    /* 表格区域 */
    .kwic-table-card {
        border-radius: 12px;
        overflow: hidden;
    }

    :deep(.el-table) {
        --el-table-header-bg-color: #fafbfc;
        --el-table-border-color: #ebeef5;
    }

    :deep(.el-table th) {
        background: var(--el-table-header-bg-color);
        font-weight: 600;
        color: #303133;
    }

    /* 响应式布局 */
    @media screen and (max-width: 1400px) {
        .analysis-cards {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media screen and (max-width: 768px) {
        .analysis-cards {
            grid-template-columns: 1fr;
        }

        .search-area h2 {
            font-size: 24px;
        }
    }

    /* 句法分析卡片样式 */
    .syntax-card {
        height: 100%;
    }
    .syntax-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .syntax-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .syntax-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    /* 句法分析卡片样式 */

    /* 词义分析 */
    .meaning-contain {
        height: 300px;
    }
    .meaning-item {
        padding: 12px 16px;
        border-bottom: 1px solid #ebeef5;
    }

    .meaning-item:hover,
    .syntax-item:hover {
        background: #f5f7fa;
    }

    .meaning-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
    }

    .meaning-definition {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
    }

    .pattern-structure {
        font-size: 14px;
        color: #303133;
        font-weight: 500;
    }

    :deep(.el-progress-bar__outer) {
        border-radius: 4px;
        background: #ebeef5;
    }

    :deep(.el-progress-bar__inner) {
        border-radius: 4px;
        transition: width 0.6s ease;
    }
    /* 词义分析 */

    /* 词汇用法总结卡片样式 */
    .vocab-usage-card {
        height: 100%;
    }
    .vocab-usage-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    :deep(.vocab-usage-table th) {
        background: var(--el-table-header-bg-color);
        color: #303133;
        font-weight: 600;
        padding: 8px 0; /* 减小内边距 */
        font-size: 13px;
    }

    :deep(.vocab-usage-table td) {
        padding: 8px; /* 减小内边距 */
        color: #606266;
        font-size: 12px; /* 设置单元格字体大小 */
        line-height: 1.4; /* 调整行高 */
    }
    .fullScreenTable th {
        color: #606266;
        font-size: 30px; /* 设置单元格字体大小 */
        line-height: 2; /* 调整行高 */
    }
    .fullScreenTable {
        font-size: 15px; /* 设置单元格字体大小 */
    }

    .card-header-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }

    .scrollable {
        overflow-y: auto;
        max-height: 300px;
    }

    .dialog-pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }

    :deep(.el-dialog__body) {
        padding: 20px;
        height: calc(100vh - 120px);
        display: flex;
        flex-direction: column;
    }

    :deep(.el-table) {
        flex: 1;
    }
    /* 词汇用法总结卡片样式 */

    /* 句法分析列表样式 */
    .syntax-list {
        height: 300px;
    }

    .syntax-item {
        padding: 12px 16px;
        margin-bottom: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        transition: all 0.3s;
    }

    .syntax-item:hover {
        background: #eef2f6;
        transform: translateX(4px);
    }

    .pattern-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .pattern-structure {
        font-size: 14px;
        color: #303133;
    }
    /* 句法分析列表样式 */

    .card-empty {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        padding: 20px;
    }

    .el-skeleton {
        padding: 16px;
    }

    :deep(.el-skeleton__item) {
        margin-bottom: 12px;
    }
</style>
