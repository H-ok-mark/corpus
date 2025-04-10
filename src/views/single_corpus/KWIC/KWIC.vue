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
    import { ElMessage } from 'element-plus';
    import { useCorpusStore } from '@/stores/corpusStore';
    import {
        kwicService,
        vocabUsageService,
        syntaxPatternsService,
        semanticAnalysisService,
    } from '@/api/KWIC';
    import { el } from 'element-plus/dist/locale/zh-cn';
    import { RefSymbol } from '@vue/reactivity';

    const corpusStore = useCorpusStore();

    // 搜索词
    const searchWord = ref('');
    const hasSearchResult = ref(false);

    const semanticResults = ref([]);
    const meaning = ref('');
    const structure = ref('');

    // 句法结构数据
    const syntaxPatternsData = ref([]);

    // 添加词汇用法数据
    const vocabUsageData = ref([
        {
            subject: 'Patient',
            adverbOrModal: 'currently',
            adjective: 'medical',
            none: 'treatment', // 注意：这里将'treatment'放在'none'字段，因为它不是adverb、modal或adjective
        },
        {
            subject: 'Candidate',
            adverbOrModal: 'must',
            adjective: 'extensive',
            none: 'training',
        },
        {
            subject: 'Individual',
            adverbOrModal: 'often',
            adjective: 'significant',
            none: 'changes',
        },
        {
            subject: 'System',
            adverbOrModal: 'may',
            adjective: 'major',
            none: 'transformation',
        },
        {
            subject: 'Building',
            adverbOrModal: 'recently',
            adjective: 'complete',
            none: 'refurbishment', // 注意拼写，原文中是'refurbishment'，可能是'refurbishment'的误写，通常应为'refurbishment'（如果是指翻新的话，正确拼写应为'refurbishment'的变体如'refurbishing'的名词形式可能是'refurbishment'，但此处我们保持原文）
        },
        {
            subject: 'Organization',
            adverbOrModal: 'sometimes',
            adjective: 'radical',
            none: 'restructuring',
        },
    ]);
    const vocabUsageDescriptionData = ref(
        '“chair” 作为名词时，常用于指代一种供人坐的家具，通常有靠背和四条腿，可用于家庭、办公室、教室等场景。在会议或委员会环境中，“chair” 还可以指会议主席或主持人，负责组织和引导会议流程。作为动词时，“chair” 表示主持会议或担任主席，强调领导和协调的职责。'
    );

    const vocabUsageDescription = async wordValue => {
        try {
            // 确保返回 Promise 以便调用方可以等待
            console.log('词汇用法分析请求:wordValue:', wordValue);
            const result = await vocabUsageService({
                word: wordValue,
            });
            // 更新数据
            vocabUsageDescriptionData.value = result.data;
        } catch (error) {
            // 你的 request.js 已经处理了错误提示，这里不需要重复显示错误消息
            console.error('词汇用法分析请求失败:', error);
            throw error; // 重新抛出错误，让调用方知道出现了问题
        }
    };

    // 存储选中的复选框内容
    //----选择第几个词
    const selectedLeftFilters = ref([1, 2, 3, 4, 5]);
    const selectedRightFilters = ref([1, 2, 3, 4, 5]);
    //KWIC分页
    const pageNum = ref(1);
    const total = ref();
    const pageSize = ref(10); // 每页显示的数据条数

    // KWIC传输数据
    const kwicData = ref({
        file: `${corpusStore.appliedCorpusName}`,
        word: searchWord.value,
        leftPart: [1, 1, 1, 1, 1],
        rightPart: [1, 1, 1, 1, 1],
        pageNum: pageNum.value,
        pageSize: pageSize.value,
    });
    // 表格数据
    //修改表格排序
    const tableData = ref([
        {
            file: kwicData.value.file,
            leftContext: null,
            node: null,
            rightContext: null,
        },
    ]);
    //记录当前的状态为 'normal' | 'meaning' | 'syntax'
    const currentMode = ref('normal');
    // 初始化长度为 10 的数组，默认全为 0
    const kwicSearch = async () => {
        // 每次搜索前重置数组
        let leftPart = new Array(10).fill(0);
        let rightPart = new Array(10).fill(0);

        // 遍历用户选择的左边复选框数组，将对应索引设置为 1
        selectedLeftFilters.value.forEach(item => {
            const index = parseInt(item.toString()) - 1;
            if (index >= 0 && index < 10) {
                leftPart[index] = 1;
            }
        });

        // 遍历用户选择的右边复选框数组，将对应索引设置为 1
        selectedRightFilters.value.forEach(item => {
            let index = parseInt(item.toString()) - 1;
            if (index >= 0 && index < 10) {
                rightPart[index] = 1;
            }
        });
        kwicData.value = {
            file: `${corpusStore.appliedCorpusName}`,
            word: searchWord.value,
            leftPart: leftPart,
            rightPart: rightPart,
            pageNum: pageNum.value,
            pageSize: pageSize.value,
        };

        if (currentMode.value === 'normal') {
            const result = await kwicService(kwicData.value);
            tableData.value = result.data.map(item => {
                return {
                    file: `${corpusStore.appliedCorpusName}`,
                    leftContext: item.leftContext,
                    node: item.keyword,
                    rightContext: item.rightContext,
                };
            });
            total.value = result.total;
        }
        if (currentMode.value === 'semantic') {
            const result = await semanticAnalysisService(
                kwicData.value,
                meaning.value
            );
            if (result.data && result.data.results) {
                // 使用results数组填充表格
                tableData.value = result.data.results.map(item => {
                    return {
                        file: `${corpusStore.appliedCorpusName}`,
                        leftContext: item.leftContext,
                        node: item.keyword,
                        rightContext: item.rightContext,
                    };
                });

                // 将字符串数组转换为对象数组
                semanticResults.value = (result.data.meaning || []).map(text => ({
                    definition: text,
                }));
                console.log('semanticResults', semanticResults.value);
                console.log('tableData', tableData.value);

                total.value = result.total || result.data.results.length;
            }
        }
        if (currentMode.value === 'syntax') {
            // 将字符串数组转换为对象数组

            const result = await syntaxPatternsService(
                kwicData.value,
                structure.value
            );
            if (result.data && result.data.results) {
                // 使用results数组填充表格
                tableData.value = result.data.results.map(item => {
                    return {
                        file: `${corpusStore.appliedCorpusName}`,
                        leftContext: item.leftContext,
                        node: item.keyword,
                        rightContext: item.rightContext,
                    };
                });

                // 将字符串数组转换为对象数组
                syntaxPatternsData.value = (result.data.structure || []).map(
                    text => ({
                        structure: text,
                    })
                );

                console.log('syntaxPatternsData', syntaxPatternsData.value);
                console.log('tableData', tableData.value);
                // console.log('pattern.structure', pattern.structure);

                total.value = result.total || result.data.results.length;
            }
        }
    };

    // 处理搜索
    const handleSearch = () => {
        if (!searchWord.value || searchWord.value.trim() === '') {
            ElMessage.warning('请输入搜索词');
            return;
        }

        // 重置所有分析状态
        resetAllStates();

        // 设置搜索结果可见
        hasSearchResult.value = true;
        currentMode.value = 'normal';

        // 执行搜索逻辑
        kwicSearch();
    };

    // 添加重置所有状态的函数
    const resetAllStates = () => {
        // 重置内容显示状态
        showSemanticContent.value = false;
        showVocabContent.value = false;
        showSyntaxContent.value = false;

        // 清空结果数据
        semanticResults.value = [];
        vocabUsageDescriptionData.value = '';
        syntaxPatternsData.value = [];

        // 重置加载状态
        semanticLoading.value = false;
        vocabLoading.value = false;
        syntaxLoading.value = false;

        // 重置意义和结构选择
        meaning.value = '';
        structure.value = '';
    };
    // 筛选框的复选内容数组
    const leftFilters = [
        { text: 'L1', value: 1 },
        { text: 'L2', value: 2 },
        { text: 'L3', value: 3 },
        { text: 'L4', value: 4 },
        { text: 'L5', value: 5 },
        { text: 'L6', value: 6 },
        { text: 'L7', value: 7 },
        { text: 'L8', value: 8 },
        { text: 'L9', value: 9 },
        { text: 'L10', value: 10 },
    ];
    const rightFilters = [
        { text: 'R1', value: 1 },
        { text: 'R2', value: 2 },
        { text: 'R3', value: 3 },
        { text: 'R4', value: 4 },
        { text: 'R5', value: 5 },
        { text: 'R6', value: 6 },
        { text: 'R7', value: 7 },
        { text: 'R8', value: 8 },
        { text: 'R9', value: 9 },
        { text: 'R10', value: 10 },
    ];

    // 控制 Popover 显示状态
    const isLeftPopoverVisible = ref(false);
    const isRightPopoverVisible = ref(false);

    // 清空筛选
    // ----选择第几个词
    const clearLeftFilter = () => {
        selectedLeftFilters.value = [1, 2, 3, 4, 5];
        kwicSearch();
    };
    const clearRightFilter = () => {
        selectedRightFilters.value = [1, 2, 3, 4, 5];
        kwicSearch();
    };

    // 应用筛选：关闭 Popover 并打印选中的值
    const applyFilter = () => {
        isLeftPopoverVisible.value = false;
        isRightPopoverVisible.value = false; // 关闭弹出框
        kwicSearch(); // 重新发起查询
    };
    // 控制 Popover 显示状态
    const isNodePopoverVisible = ref(false);

    // 控制弹窗显示
    const dialogVisible = ref(false);

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
        try {
            switch (type) {
                case 'semantic':
                    currentMode.value = 'semantic';
                    semanticLoading.value = true;
                    await kwicSearch();
                    showSemanticContent.value = true;
                    break;

                case 'vocab':
                    vocabLoading.value = true;
                    await vocabUsageDescription(searchWord.value);
                    showVocabContent.value = true;
                    break;

                case 'syntax':
                    currentMode.value = 'syntax';
                    syntaxLoading.value = true;
                    await kwicSearch();
                    showSyntaxContent.value = true;
                    break;
            }
        } catch (error) {
            console.error(`${type} 分析请求失败:`, error);
            ElMessage.error(`${type} 分析失败，请稍后再试`);
        } finally {
            // 确保无论成功失败，都关闭对应的加载状态
            if (type === 'semantic') semanticLoading.value = false;
            if (type === 'vocab') vocabLoading.value = false;
            if (type === 'syntax') syntaxLoading.value = false;
        }
    };

    // 词汇用法总结全屏分页参数
    const dialogCurrentPage = ref(1);
    const dialogPageSize = ref(10);
    // 词汇用法总结计算分页后的数据
    const paginatedData = computed(() => {
        const start = (dialogCurrentPage.value - 1) * dialogPageSize.value;
        const end = start + dialogPageSize.value;
        return vocabUsageData.value.slice(start, end);
    });

    // 处理分页变化
    const handleDialogPageChange = (val: number) => {
        dialogCurrentPage.value = val;
    };

    //KWIC分页

    //函数调用
    // 处理分页变化
    const handlePageChange = newPage => {
        pageNum.value = newPage;
        kwicSearch(); // 当前页码变化时重新发起查询
    };
    const handleSizeChange = (val: number) => {
        pageSize.value = val;
        kwicSearch(); // 当前页码变化时重新发起查询
    };
    const handleMeaningSelect = definition => {
        // 先赋值
        meaning.value = definition;
        console.log('选择的词义:', meaning.value);
        // 然后进行分析
        handleStartAnalysis('semantic');
    };
    const handleStructureSelect = structureText => {
        // 先赋值
        structure.value = structureText;
        console.log('选择的句法结构:', structure.value);
        // 然后进行分析
        handleStartAnalysis('syntax');
    };
</script>

<template>
    <div class="kwic-analysis">
        <!-- 搜索区域 -->
        <el-card class="search-card" shadow="hover">
            <div class="search-area">
                <h2>KWIC智能分析</h2>
                <div class="corpus-name">
                    <p>当前语料库：</p>
                    <p v-if="corpusStore.appliedCorpusName">
                        《{{ corpusStore.appliedCorpusName }}》
                    </p>
                    <p v-else class="no-corpus-tip">暂无应用的语料库</p>
                </div>
                <el-input
                    v-model="searchWord"
                    placeholder="请输入检索词"
                    class="search-input"
                    size="large"
                >
                    <template #append>
                        <el-button
                            class="search-button"
                            :icon="Search"
                            @click="handleSearch"
                        >
                            搜索
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
                                            @click="
                                                handleMeaningSelect(
                                                    meaning.definition
                                                )
                                            "
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
                        <!-- <el-button
                            class="fullscreen-btn"
                            type="default"
                            :icon="FullScreen"
                            circle
                            size="large"
                            @click="dialogVisible = true"
                        /> -->
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
                        <div class="vocabUsageDescription">
                            {{ vocabUsageDescriptionData }}
                        </div>
                    </el-skeleton>
                </div>
            </el-card>

            <!-- 全屏弹窗 -->
            <!-- <el-dialog
                v-model="dialogVisible"
                title="chair词汇用法总结"
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
            </el-dialog> -->

            <!-- 句法结构分析卡片 -->
            <el-card class="syntax-card" shadow="hover">
                <template #header>
                    <div class="card-header">
                        <h3>
                            <el-icon><Operation /></el-icon> 句法结构分析
                        </h3>
                        <h4>
                            <el-tag type="info" size="large"
                                >共{{ syntaxPatternsData.length }}种结构</el-tag
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
                        >开始使用
                    </el-button>
                </div>
                <div v-else>
                    <el-skeleton :loading="syntaxLoading" animated :rows="3">
                        <template #default>
                            <div class="syntax-list">
                                <div
                                    v-for="(
                                        pattern, index
                                    ) in syntaxPatternsData"
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
                                            @click="
                                                handleStructureSelect(
                                                    pattern.structure
                                                )
                                            "
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
                    <el-table-column prop="leftContext" label="Left Context">
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
                                            v-for="item in leftFilters"
                                            :key="item.value"
                                            :label="item.value"
                                        >
                                            {{ item.text }}
                                        </el-checkbox>
                                    </el-checkbox-group>

                                    <div
                                        style="display: flex; margin-top: 10px"
                                    >
                                        <el-button
                                            size="small"
                                            @click="clearLeftFilter()"
                                            >重置</el-button
                                        >
                                        <el-button
                                            size="small"
                                            type="primary"
                                            @click="applyFilter()"
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

                    <el-table-column prop="rightContext" label="Right Context">
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
                                            v-for="item in rightFilters"
                                            :key="item.value"
                                            :label="item.value"
                                        >
                                            {{ item.text }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                    <div
                                        style="display: flex; margin-top: 10px"
                                    >
                                        <el-button
                                            size="small"
                                            @click="clearRightFilter"
                                            >重置</el-button
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

                <!-- 分页条 -->
                <div class="pagination">
                    <el-pagination
                        v-if="tableData.length > 0"
                        v-model:current-page="pageNum"
                        :page-sizes="[10, 15, 20]"
                        :page-size="pageSize"
                        :total="total"
                        layout="sizes, prev, pager, next,total"
                        @size-change="handleSizeChange"
                        @current-change="handlePageChange"
                    />
                </div>
            </div>
        </el-card>
    </div>
</template>
  

<style scoped>
    .corpus-name {
        margin-bottom: 16px;
        font-size: large;
    }

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
        height: 500px;
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
        height: 500px;
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
    .vocabUsageDescription {
        padding: 40px;
    }
    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
    .search-button {
        border-radius: 4px;
        font-weight: bold;
        padding: 6px 16px;
        transition: background-color 0.3s ease, color 0.3s ease, transform 0.1s ease;
    }
    .no-corpus-tip {
        color: #909399;
        font-style: italic;
    }
</style>
