

<script setup lang="ts">
    import { ref } from 'vue';
    import {
        Search,
        Aim,
        PieChart,
        ArrowDown,
        Filter,
    } from '@element-plus/icons-vue';
    import { ElMessageBox } from 'element-plus';

    const words = ref('');

    // 点击搜索按钮触发的方法
    const onSearch = () => {
        console.log('搜索内容:', words.value);
    };
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
            left: '1',
            node: '10',
            right: '10',
        },
        {
            file: 'hello',
            left: '1',
            node: '10',
            right: '10',
        },
        {
            file: 'hello',
            left: '1',
            node: '10',
            right: '10',
        },
        {
            file: 'hello',
            left: '1',
            node: '10',
            right: '10',
        },
        {
            file: 'hello',
            left: '1',
            node: '10',
            right: '10',
        },
        {
            file: 'hello',
            left: '1',
            node: '10',
            right: '10',
        },
        {
            file: 'hello',
            left: '1',
            node: '10',
            right: '10',
        },
        {
            file: 'hello',
            left: '1',
            node: '10',
            right: '10',
        },
    ];
    //分页条数据模型
    const pageNum = ref(1); //当前页
    const total = ref(20); //总条数

    //当前页码发生变化，调用此函数
    const onCurrentChange = num => {
        pageNum.value = num;
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

    // 单选框的选项
    const nodeOptions = [
        { text: '无筛选', value: '无筛选' },
        { text: '词义搭配', value: '词义搭配' },
        { text: '句法结构', value: '句法结构' },
        { text: '语义倾向', value: '语义倾向' },
    ];

    // 存储选中的单选框值
    const selectedNode = ref('无筛选');
</script>

<template>
    <el-card class="KWIC-container">
        <template #header>
            <div class="header">
                <span>检索词在语料库中的上下文，默认显示Left5—Node—Right5</span>
            </div>
        </template>

        <!-- node搜索框 -->
        <div class="node-search">
            <el-input
                v-model="words"
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
        <!-- KWIC结果表格 -->
        <!-- 对于上下文的筛选条件，是否需要设置Ln为第几个词的意思？
        是否具有现实的研究意义？
        还是可以直接设置为前/后几个词？ -->
        <div class="search-result">
            <el-table
                :data="tableData"
                stripe
                style="width: 100%%"
                :border="true"
                margin-left="200px"
            >
                <el-table-column prop="file" label="File" :width="100" />
                <el-table-column prop="left" label="Left">
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
                            <span>Left</span>

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
                                <div style="display: flex; margin-top: 10px">
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
                <el-table-column prop="node" label="Node" :width="200">
                    <!-- 自定义表头内容 -->
                    <template #header>
                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            <span>Node</span>

                            <!-- 选择按钮 -->
                            <el-popover
                                placement="bottom"
                                trigger="click"
                                v-model:visible="isNodePopoverVisible"
                            >
                                <!-- 按钮触发器 -->
                                <template #reference>
                                    <el-button
                                        size="default"
                                        type="info"
                                        plain
                                        :icon="Aim"
                                        circle
                                    ></el-button>
                                </template>

                                <!-- 单选框内容 -->
                                <div>
                                    <el-radio-group
                                        v-model="selectedNode"
                                        size="default"
                                    >
                                        <el-radio
                                            v-for="item in nodeOptions"
                                            :key="item.value"
                                            :label="item.value"
                                        >
                                            {{ item.text }}
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                                <div
                                    style="
                                        display: flex;
                                        justify-content: center;
                                        margin-top: 10px;
                                    "
                                >
                                    <el-button
                                        size="small"
                                        type="primary"
                                        @click="isNodePopoverVisible = false"
                                    >
                                        确定
                                    </el-button>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="right" label="Right">
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
                            <span>Right</span>

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
                                <div style="display: flex; margin-top: 10px">
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
        </div>
        <!-- 分页条 -->
        <el-pagination
            v-model:current-page="pageNum"
            layout="jumper, total, prev, pager, next"
            background
            :total="total"
            @current-change="onCurrentChange"
            style="margin-top: 20px; justify-content: flex-end"
        />
    </el-card>
</template>

<style scoped>
    .node-search {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }
    /* 默认按钮样式 */
    .node-search .search-button {
        border-radius: 4px;
        font-weight: bold;
        padding: 6px 16px;
        transition: background-color 0.3s ease, color 0.3s ease, transform 0.1s ease;
    }

    /* 悬停时的样式 */
    .node-search .search-button:hover {
        background-color: #b4b8bb; /* 悬停时灰色变浅 */
        color: #fff;
    }

    /* 点击时的样式：按下按钮时缩小 */
    .node-search .search-button:active {
        transform: scale(0.95); /* 缩小按钮 5% */
        background-color: #63696b; /* 点击时按钮的灰色变深 */
    }
    .search-result {
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }
    .KWIC-container {
        min-height: 100%;
        box-sizing: border-box;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
