<script setup lang="ts">
    import { ref } from 'vue';
    import { ElMessage } from 'element-plus';
    import type { UploadUserFile } from 'element-plus';
    import { Search } from '@element-plus/icons-vue'; // 在导入区添加

    import { Loading } from 'element-plus/es/components/loading/src/service';

    // 表格数据
    const paragraphData = ref([
        {
            id: 22,
            sourceParagraph:
                '"\'Black Myth: Wukong\' ... was being played on Wednesday by 2.2 million concurrent players on Steam, a major online gaming platform, a day after its release," Reuters reported on Wednesday.',
            targetParagraph:
                '路透社21日报道称：“《黑神话：悟空》……在发布一天后，在Steam游戏平台上的同时在线玩家数已突破220万。”',
            bicorpus: 3,
        },
    ]);
    // 转圈加载状态
    const loading = ref(false);
    // 分页条数据模型
    const pageNum = ref(1); // 当前页
    const total = ref(20); // 总条数
    const pageSize = ref(10); // 每页显示的数据条数
    // 分页条数据模型
    // 语料库列表
    const corpusPageNum = ref(1); // 当前页
    const corpusTotal = ref(20); // 总条数
    const corpusPageSize = ref(4); // 每页显示的数据条数
    const handleCorpusPageChange = newPage => {
        corpusPageNum.value = newPage;
        corpusList(); // 当前页码变化时重新发起查询
    };
    //段落对齐分析
    const paragraphPageNum = ref(1); // 当前页
    const paragraphTotal = ref(20); // 总条数
    const paragraphPageSize = ref(10); // 每页显示的数据条数
    const handleParagraphPageChange = newPage => {
        paragraphPageNum.value = newPage;
        // paragraphList(); // 当前页码变化时重新发起查询
    };
    // 句子对齐分析，
    const sentencePageNum = ref(1); // 当前页
    const sentenceTotal = ref(20); // 总条数
    const sentencePageSize = ref(10); // 每页显示的数据条数
    const handleSentencePageChange = newPage => {
        sentencePageNum.value = newPage;
        // sentenceList(); // 当前页码变化时重新发起查询
    };
    // 多译本文段对比分析
    // 添加多选时的ID数组
    const versionsPageNum = ref(1); // 当前页
    const versionsTotal = ref(20); // 总条数
    const versionsPageSize = ref(10); // 每页显示的数据条数
    const handleVersionsPageChange = newPage => {
        versionsPageNum.value = newPage;
        // versionsList(); // 当前页码变化时重新发起查询
    };

    // 单/双文档选择状态
    const simple = ref(true);
    const fileRadio = ref('单文档对齐');

    // 当前选项卡
    const activeTab = ref('import');

    // 对齐分析的结果数据（添加初始数据）
    const sentenceAlignment = ref<any[]>([
        {
            id: 12,
            sourceText:
                'An interest in the ancient Chinese literature "Journey to the West" has been aroused among netizens and players.',
            targetText:
                '网民和该游戏玩家对中国古代文学《西游记》产生了浓厚的兴趣。',
            strategyId: 1,
            bidirectCorpusId: 5,
        },
    ]);
    const phraseAlignment = ref<any[]>([
        {
            align_phrase_id: 150,
            source_word: 'examination',
            target_word: '考察',
            strategy: '直译',
        },
        {
            align_phrase_id: 151,
            source_word: 'Boxer Incident',
            target_word: '义和团事件',
            strategy: '直译',
        },
    ]);
    const contextAnalysis = ref<any[]>([
        { target_word: 'grass', context: '绿草如茵的草坪', strategy: '直译' },
        { target_word: 'thatch', context: '茅草屋顶的建筑', strategy: '意译' },
    ]);
    const versionsAnalysis = ref<any[]>([
        {
            original: '示例原本',
            source: 'Greeting text',
            translation: '你好世界',
            strategy: '直译',
            version: '译本v1',
        },
        {
            original: '示例原本',
            source: 'Greeting text',
            translation: '世界，你好！',
            strategy: '语气强化',
            version: '译本v2',
        },
    ]);

    // 多译本部分

    // 语料选择相关的变量和方法
    const corpusDialogVisible = ref(false);
    const selectedCorpusId = ref<number | null>(null);
    const selectedCorpus = ref<{
        id: number;
        name: string;
        description: string;
    } | null>(null);
    const selectedDoublkeCorpusCN = ref<{
        id: number;
        name: string;
        description: string;
    } | null>(null);
    const selectedDoublkeCorpusEN = ref<{
        id: number;
        name: string;
        description: string;
    } | null>(null);
    const selectedCorpusSrc = ref<{
        id: number;
        name: string;
        description: string;
    } | null>(null);
    // 存储多译本选择结果
    const multipleTranslations = ref<
        Array<{
            id: number;
            name: string;
            description: string;
        }>
    >([]);
    const selectedCorpusIds = ref<number[]>([]);
    // 多译本分析请求参数
    const contextAnalysisData = ref({
        pageNum: 1,
        pageSize: 10,
        // srcCorpusId: selectedCorpusSrc.value.id,
        // srcSentence: searchSentence.value,
        // tgtCorpusId: multipleTranslations.value.map(item => item.id),
    });
    // 添加取消选择方法
    const clearSelectedCorpus = () => {
        selectedCorpusIds.value = [];
    };
    // 语料库列表数据
    import { corpusListService } from '@/api/corpusList.js';
    // 示例语料列表 - 在实际应用中应从API获取
    const corpusListData = ref([{ id: null, name: null, description: null }]);
    //获取语料库列表
    const corpusList = async () => {
        let result = await corpusListService({
            pageNum: corpusPageNum.value,
            pageSize: corpusPageSize.value,
            keyword: null,
            isUser: true,
        });

        // 将筛选后的数据存入 corpusListData
        corpusListData.value = result.data.map(item => {
            return {
                id: item.id,
                name: item.name,
                description: item.description,
            };
        });
        corpusTotal.value = result.total;
        console.log('语料库个数：' + corpusTotal.value);
    };
    corpusList();

    // 添加当前正在选择的语料库类型标识
    const currentCorpusType = ref('single'); // 'single', 'en', 'cn'
    // 显示语料选择对话框
    const showCorpusDialog = type => {
        currentCorpusType.value = type; // 设置当前正在选择的语料库类型
        corpusDialogVisible.value = true;

        if (type === 'multiple') {
            // 多选情况下，初始化已选择的ID列表
            selectedCorpusIds.value =
                multipleTranslations.value.map(item => item.id) || [];
        } else {
            // 单选情况下的逻辑
            if (type === 'single' && selectedCorpus.value) {
                selectedCorpusId.value = selectedCorpus.value.id;
            } else if (type === 'en' && selectedDoublkeCorpusEN.value) {
                selectedCorpusId.value = selectedDoublkeCorpusEN.value.id;
            } else if (type === 'cn' && selectedDoublkeCorpusCN.value) {
                selectedCorpusId.value = selectedDoublkeCorpusCN.value.id;
            } else if (type === 'src' && selectedCorpusSrc.value) {
                selectedCorpusId.value = selectedCorpusSrc.value.id;
            } else {
                selectedCorpusId.value = null; // 重置选择状态
            }
        }
    };

    // 确认语料选择
    const confirmCorpusSelection = () => {
        if (currentCorpusType.value === 'multiple') {
            // 多选情况
            if (selectedCorpusIds.value.length === 0) {
                ElMessage.warning('请至少选择一个译本');
                return;
            }

            // 获取选中的所有译本信息
            const selectedItems = corpusListData.value.filter(item =>
                selectedCorpusIds.value.includes(item.id)
            );

            // 更新多译本结果
            multipleTranslations.value = selectedItems;

            ElMessage.success(`已选择 ${selectedItems.length} 个译本`);
        } else {
            // 单选情况
            if (!selectedCorpusId.value) {
                ElMessage.warning('请先选择语料库');
                return;
            }

            const selected = corpusListData.value.find(
                item => item.id === selectedCorpusId.value
            );

            if (selected) {
                if (currentCorpusType.value === 'single') {
                    selectedCorpus.value = selected;
                    ElMessage.success(`已选择语料库: ${selected.name}`);
                } else if (currentCorpusType.value === 'en') {
                    selectedDoublkeCorpusEN.value = selected;
                    ElMessage.success(`已选择英文语料库: ${selected.name}`);
                } else if (currentCorpusType.value === 'cn') {
                    selectedDoublkeCorpusCN.value = selected;
                    ElMessage.success(`已选择中文语料库: ${selected.name}`);
                } else if (currentCorpusType.value === 'src') {
                    // 处理源语料选择
                    selectedCorpusSrc.value = selected;
                    ElMessage.success(`已选择源语料库: ${selected.name}`);
                }
            }
        }

        corpusDialogVisible.value = false;
    };
    //对齐分析结果
    const isAlignment = ref(false);

    const setIsAlignment = (value: boolean) => {
        isAlignment.value = value;
        sessionStorage.setItem('isAlignment', String(value));
    };
    // 从 sessionStorage 中读取 isAlignment 值

    const storedAlignment = sessionStorage.getItem('isAlignment');
    if (storedAlignment === 'true') {
        isAlignment.value = true;
    }

    import {
        singleAlignmentService,
        doubleAlignmentService,
        alignParagraphService,
        alignSentenceService,
        getContextAnalysisService,
    } from '@/api/translation.js';

    //对齐请求
    const singleAlignment = async () => {
        //发送对齐请求
        console.log('singleAlignment', selectedCorpus.value.id);

        singleAlignmentService(selectedCorpus.value.id);
        ElMessage.success('对齐请求已发送');
    };
    const doubleAlignment = async () => {
        //发送对齐请求
        console.log(
            'doubleAlignment',
            selectedDoublkeCorpusEN.value.id,
            selectedDoublkeCorpusCN.value.id
        );
        doubleAlignmentService(
            selectedDoublkeCorpusEN.value.id,
            selectedDoublkeCorpusCN.value.id
        );
    };

    // 段落对齐分析
    const singleAlignParagraph = async () => {
        // 发送对齐请求
        console.log('singleAlignParagraph', selectedCorpus.value.id);
        let result = await alignParagraphService(
            selectedCorpus.value.id,
            selectedCorpus.value.id
        );
        // 更新段落对齐分析结果
        paragraphData.value = result.data;
    };
    const doubleAlignParagraph = async () => {
        // 发送对齐请求
        console.log(
            'doubleAlignParagraph',
            selectedDoublkeCorpusEN.value.id,
            selectedDoublkeCorpusCN.value.id
        );
        let result = await alignParagraphService(
            selectedDoublkeCorpusEN.value.id,
            selectedDoublkeCorpusCN.value.id
        );
        // 更新段落对齐分析结果
        paragraphData.value = result.data;
    };

    //句子对齐
    const alignSentence = async () => {
        console.log('此时的simple:', simple.value);
        console.log('en:', selectedDoublkeCorpusEN.value.id);
        console.log('cn:', selectedDoublkeCorpusCN.value.id);
        // 发送对齐请求
        if (simple) {
            let result = await alignSentenceService(
                selectedCorpus.value.id,
                selectedCorpus.value.id
            );
            console.log('simple:', selectedCorpus.value.id);
            sentenceAlignment.value = result.data;
        } else {
            console.log('en:', selectedDoublkeCorpusEN.value.id);
            console.log('cn:', selectedDoublkeCorpusCN.value.id);
            let result = await alignSentenceService(
                selectedDoublkeCorpusEN.value.id,
                selectedDoublkeCorpusCN.value.id
            );

            sentenceAlignment.value = result.data;
        }
        // 更新句子对齐分析结果
    };

    // // 多译本对比分析
    // const getContextAnalysis = async () => {
    //     // 发送对齐请求
    //     console.log(
    //         'getContextAnalysis',
    //         selectedCorpusSrc.value.id,
    //         multipleTranslations.value.map(item => item.id)
    //     );
    //     let result = await getContextAnalysisService(contextAnalysisData.value);
    //     // 更新多译本对比分析结果
    //     versionsAnalysis.value = result.data;
    // };
    // 添加搜索词变量
    const searchSentence = ref('');

    // 添加处理搜索的函数
    const handleVersionSearch = () => {
        if (!searchSentence.value) {
            ElMessage.warning('请输入搜索内容');
            return;
        }
        // getContextAnalysis();
    };
    const handleStartAlignment = async (mode: 'single' | 'double' | 'sentence') => {
        try {
            //single
            if (mode === 'single') {
                if (!selectedCorpus.value) {
                    ElMessage.warning('请先选择语料库');
                    return;
                }
                loading.value = true;
                //发送对齐请求
                await singleAlignment();
                await singleAlignParagraph();
                isAlignment.value = true; // 设置为 true 显示结果表格
            } else if (mode === 'double') {
                if (
                    !selectedDoublkeCorpusEN.value ||
                    !selectedDoublkeCorpusCN.value
                ) {
                    ElMessage.warning('请先选择语料库');
                    return;
                }
                loading.value = true;
                //发送对齐请求
                await doubleAlignment();
                await doubleAlignParagraph();
                isAlignment.value = true; // 设置为 true 显示结果表格
            } else if (mode === 'sentence') {
                console.log('sentence');
                if (simple.value) {
                    console.log('simple');
                    if (!selectedCorpus.value) {
                        ElMessage.warning('请先选择语料库');
                        return;
                    }
                } else {
                    console.log('double');
                    if (
                        !selectedDoublkeCorpusEN.value ||
                        !selectedDoublkeCorpusCN.value
                    ) {
                        ElMessage.warning('请先选择语料库');
                        return;
                    }
                }
                loading.value = true;
                //发送对齐请求
                await alignSentence();
                isAlignment.value = true; // 设置为 true 显示结果表格
            }
        } catch (error) {
            console.error('对齐处理失败:', error);
            ElMessage.error('对齐失败，请稍后再试');
        } finally {
            loading.value = false; // 无论成功或失败，都关闭加载状态
        }
    };
</script>

<template>
    <div class="bilingual-corpus">
        <el-card class="translation-container">
            <!-- 选项卡 -->
            <div>
                <el-tabs v-model="activeTab" type="card">
                    <div>
                        <el-tab-pane label="导入平行语料" name="import">
                            <!-- 单双文档选择器 -->
                            <div class="simple-file-radio">
                                <el-radio-group
                                    v-model="fileRadio"
                                    size="large"
                                >
                                    <el-radio-button
                                        label="单文档对齐"
                                        value="单文档对齐"
                                        @click="simple = true"
                                    />
                                    <el-radio-button
                                        label="双文档对齐"
                                        value="双文档对齐"
                                        @click="simple = false"
                                    />
                                </el-radio-group>
                            </div>

                            <!-- 单文档对齐 -->
                            <div class="simple-file" v-if="simple">
                                <!-- 选择语料 -->
                                <div class="corpus-selector">
                                    <el-button
                                        type="primary"
                                        @click="showCorpusDialog('single')"
                                        >选择语料</el-button
                                    >
                                </div>
                                <div>
                                    <!-- 对话框 -->
                                    <el-button
                                        type="success"
                                        @click="handleStartAlignment('single')"
                                        >开始对齐</el-button
                                    >
                                </div>
                            </div>

                            <!-- 双文档对齐 -->
                            <div class="double-file" v-else>
                                <!-- 双文档对齐 -->
                                <!-- 选择语料 -->
                                <div class="corpus-selector">
                                    <el-button
                                        type="primary"
                                        @click="showCorpusDialog('en')"
                                        >英文语料</el-button
                                    >
                                </div>

                                <!-- 选择语料 -->
                                <div class="corpus-selector">
                                    <el-button
                                        type="primary"
                                        @click="showCorpusDialog('cn')"
                                        >中文语料</el-button
                                    >
                                </div>
                                <!-- 开始对齐按钮 -->
                                <el-button
                                    type="success"
                                    @click="handleStartAlignment('double')"
                                    >开始对齐</el-button
                                >
                            </div>
                            <!-- 语料库列表 -->
                            <div class="selected-word">
                                当前选择的语料库：
                                <span v-if="simple" class="selected-corpus">
                                    {{
                                        selectedCorpus
                                            ? selectedCorpus.name +
                                              selectedCorpus.id
                                            : '无'
                                    }}
                                </span>
                                <span v-else class="selected-corpus">
                                    {{
                                        selectedDoublkeCorpusEN
                                            ? selectedDoublkeCorpusEN.name
                                            : '无'
                                    }}
                                    &nbsp;&nbsp;
                                    {{
                                        selectedDoublkeCorpusCN
                                            ? selectedDoublkeCorpusCN.name
                                            : ''
                                    }}
                                </span>
                            </div>
                            <!-- 段落结果 -->
                            <div>
                                <!-- 结果表格 -->
                                <div v-if="isAlignment" class="result">
                                    <el-table
                                        :data="paragraphData"
                                        stripe
                                        style="width: 100%"
                                        :border="true"
                                    >
                                        <el-table-column
                                            prop="sourceParagraph"
                                            label="English"
                                        />
                                        <el-table-column
                                            prop="targetParagraph"
                                            label="Chinese"
                                        />
                                    </el-table>
                                </div>
                                <!-- 分页器 -->
                                <div class="pagination-wrapper">
                                    <el-pagination
                                        v-model:current-page="paragraphPageNum"
                                        v-model:page-size="paragraphPageSize"
                                        :page-sizes="[10, 15, 20]"
                                        layout="sizes, jumper, total, prev, pager, next"
                                        :total="total"
                                        background
                                        @current-page="
                                            handleParagraphPageChange
                                        "
                                    />
                                </div>
                            </div>
                        </el-tab-pane>

                        <!-- 句子对齐分析 -->
                        <el-tab-pane label="句子对齐分析" name="sentence">
                            <div class="sentence-header">
                                <div class="corpus-info">
                                    当前选择的语料库：
                                    <span v-if="simple" class="selected-corpus">
                                        {{
                                            selectedCorpus
                                                ? selectedCorpus.name +
                                                  selectedCorpus.id
                                                : '无'
                                        }}
                                    </span>
                                    <span v-else class="selected-corpus">
                                        {{
                                            selectedDoublkeCorpusEN
                                                ? selectedDoublkeCorpusEN.name
                                                : '无'
                                        }}
                                        {{
                                            selectedDoublkeCorpusCN
                                                ? selectedDoublkeCorpusCN.name
                                                : ''
                                        }}
                                    </span>
                                </div>
                                <el-button
                                    class="sentence-button"
                                    type="success"
                                    @click="handleStartAlignment('sentence')"
                                    >开始对齐</el-button
                                >
                            </div>
                            <div v-if="isAlignment" class="result-area">
                                <el-table
                                    v-loading="loading"
                                    :data="sentenceAlignment"
                                    width="100%"
                                    border
                                    stripe
                                >
                                    <el-table-column
                                        prop="id"
                                        label="记录ID"
                                        width="100"
                                    />
                                    <el-table-column
                                        prop="sourceText"
                                        label="原文"
                                        show-overflow-tooltip
                                    />
                                    <el-table-column
                                        prop="targetText"
                                        label="译文"
                                        show-overflow-tooltip
                                    />
                                </el-table>
                            </div>
                            <!-- 分页器 -->
                            <div class="pagination-wrapper">
                                <el-pagination
                                    v-if="sentenceAlignment.length > 0"
                                    v-model:current-page="sentencePageNum"
                                    v-model:page-size="sentencePageSize"
                                    :page-sizes="[10, 15, 20]"
                                    layout="sizes, jumper, total, prev, pager, next"
                                    :total="total"
                                    background
                                    @current-change="handleSentencePageChange"
                                />
                            </div>
                        </el-tab-pane>

                        <!-- 词汇对齐分析 -->
                        <!-- <el-tab-pane label="词汇对齐分析" name="phrase">
                        <div v-if="isAlignment" class="result-area">
                            <el-table :data="phraseAlignment" border stripe>
                                <el-table-column
                                    prop="align_phrase_id"
                                    label="记录ID"
                                    width="100"
                                />
                                <el-table-column
                                    prop="source_word"
                                    label="源词"
                                />
                                <el-table-column
                                    prop="target_word"
                                    label="目标词"
                                />
                                <el-table-column
                                    prop="strategy"
                                    label="翻译策略"
                                    width="120"
                                />
                            </el-table>
                        </div> -->
                        <!-- 分页器 -->
                        <!-- <div class="pagination-wrapper">
                            <el-pagination
                                v-model:current-page="pageNum"
                                v-model:page-size="pageSize"
                                :page-sizes="[10, 15, 20]"
                                layout="sizes, jumper, total, prev, pager, next"
                                :total="total"
                                background
                            />
                        </div>
                    </el-tab-pane> -->

                        <!-- 多语境翻译分析 -->
                        <!-- <el-tab-pane label="多语境翻译分析" name="context">
                        <div v-if="isAlignment" class="result-area">
                            <el-table :data="contextAnalysis" border stripe>
                                <el-table-column
                                    prop="target_word"
                                    label="翻译结果"
                                />
                                <el-table-column
                                    prop="context"
                                    label="上下文"
                                    show-overflow-tooltip
                                />
                                <el-table-column
                                    prop="strategy"
                                    label="翻译策略"
                                    width="120"
                                />
                            </el-table>
                        </div> -->
                        <!-- 分页器 -->
                        <!-- <div class="pagination-wrapper">
                            <el-pagination
                                v-model:current-page="pageNum"
                                v-model:page-size="pageSize"
                                :page-sizes="[10, 15, 20]"
                                layout="sizes, jumper, total, prev, pager, next"
                                :total="total"
                                background
                            />
                        </div>
                    </el-tab-pane> -->

                        <!-- 多译本对比分析 -->
                        <el-tab-pane label="多译本文段对比分析" name="versions">
                            <!-- 译本选择 -->
                            <div class="double-file">
                                <!-- 选择语料 -->
                                <div class="corpus-selectors">
                                    <el-button
                                        type="primary"
                                        @click="showCorpusDialog('src')"
                                        >源语料</el-button
                                    >
                                </div>

                                <!-- 选择语料 -->
                                <div class="corpus-selectors">
                                    <el-button
                                        type="primary"
                                        @click="showCorpusDialog('multiple')"
                                        >多译本</el-button
                                    >
                                </div>
                            </div>
                            <!-- 搜索框 -->
                            <div class="search-area">
                                <el-input
                                    placeholder="请输入原句"
                                    size="large"
                                    v-model="searchSentence"
                                >
                                    <template #append>
                                        <el-button
                                            class="search-button"
                                            type="primary"
                                            @click="handleVersionSearch"
                                            :icon="Search"
                                            >搜索</el-button
                                        >
                                    </template>
                                </el-input>
                            </div>

                            <!-- 语料库列表 -->
                            <div class="selected-word">
                                当前选择的源语料库：
                                <span class="selected-corpus">
                                    {{
                                        selectedCorpusSrc
                                            ? selectedCorpusSrc.name +
                                              selectedCorpusSrc.id
                                            : '无'
                                    }}
                                </span>
                            </div>
                            <div class="selected-word">
                                当前选择的译本语料库：
                                <span class="selected-corpus">
                                    {{
                                        multipleTranslations.length > 0
                                            ? multipleTranslations
                                                  .map(item => item.name)
                                                  .join('、')
                                            : '无'
                                    }}
                                </span>
                            </div>
                            <!--多译本对比分析结果表格 -->
                            <div v-if="isAlignment" class="result">
                                <el-table
                                    :data="versionsAnalysis"
                                    border
                                    style="width: 100%"
                                    :header-cell-style="{
                                        backgroundColor: '#ffffff',
                                        color: '#000000',
                                        borderColor: '#e0e0e0',
                                    }"
                                >
                                    <!-- 独立五列结构 -->
                                    <el-table-column
                                        prop="original"
                                        label="原文本"
                                    />
                                    <el-table-column
                                        prop="source"
                                        label="源语句"
                                    />
                                    <el-table-column
                                        prop="translation"
                                        label="翻译语句"
                                    />
                                    <el-table-column
                                        prop="strategy"
                                        label="翻译策略"
                                    />
                                    <el-table-column
                                        prop="version"
                                        label="译本"
                                    />
                                </el-table>
                            </div>
                            <!-- 分页器 -->
                            <div class="pagination-wrapper">
                                <el-pagination
                                    v-if="versionsAnalysis.length > 0"
                                    v-model:current-page="versionsPageNum"
                                    v-model:page-size="versionsPageSize"
                                    :page-sizes="[10, 15, 20]"
                                    layout="sizes, jumper, total, prev, pager, next"
                                    :total="total"
                                    background
                                />
                            </div>
                        </el-tab-pane>
                    </div>
                </el-tabs>
            </div>
        </el-card>
    </div>
    <!-- 统一的语料选择对话框 -->
    <el-dialog
        v-model="corpusDialogVisible"
        :title="
            currentCorpusType === 'single'
                ? '选择语料库'
                : currentCorpusType === 'en'
                ? '选择英文语料库'
                : currentCorpusType === 'cn'
                ? '选择中文语料库'
                : currentCorpusType === 'src'
                ? '选择源语料库'
                : currentCorpusType === 'multiple'
                ? '选择多译本语料库'
                : '选择语料库'
        "
        width="500px"
        destroy-on-close
    >
        <!-- 单选框 - 非多译本情况 -->
        <el-radio-group
            v-if="currentCorpusType !== 'multiple'"
            v-model="selectedCorpusId"
            class="corpus-radio-group"
        >
            <el-radio
                v-for="item in corpusListData"
                :key="item.id"
                :label="item.id"
                border
                class="corpus-radio-item"
            >
                <div class="corpus-info">
                    <div class="corpus-name">{{ item.name }}</div>
                </div>
            </el-radio>
        </el-radio-group>

        <!-- 复选框 - 多译本情况 -->
        <el-checkbox-group
            v-else
            v-model="selectedCorpusIds"
            class="corpus-radio-group"
        >
            <el-checkbox
                v-for="item in corpusListData"
                :key="item.id"
                :label="item.id"
                border
                class="corpus-radio-item"
            >
                <div class="corpus-info">
                    <div class="corpus-name">{{ item.name }}</div>
                </div>
            </el-checkbox>
        </el-checkbox-group>

        <!-- 分页条 -->
        <el-pagination
            v-model:current-page="corpusPageNum"
            v-model:page-size="corpusPageSize"
            :total="corpusTotal"
            layout="total,prev, pager, next"
            @current-change="handleCorpusPageChange"
        />

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="corpusDialogVisible = false">取消</el-button>
                <el-button
                    type="primary"
                    plain
                    @click="clearSelectedCorpus"
                    v-if="currentCorpusType === 'multiple'"
                >
                    清空选择
                </el-button>
                <el-button type="primary" @click="confirmCorpusSelection"
                    >确认选择</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>
  
<style scoped>
    .translation-container {
        min-height: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    .simple-file-radio {
        display: flex;
        justify-content: left;
        margin-left: 10px;
        text-align: center;
        height: 60px;
    }
    .simple-file {
        display: flex;
        justify-content: center;
        text-align: center;
        height: 70px;
    }
    .double-file {
        display: flex;
        justify-content: center;
        text-align: center;
        height: 80px;
    }

    .result {
        margin-top: 1px;
        display: flex;
        justify-content: center;
    }
    .page-header {
        text-align: center;
        margin-bottom: 40px;
    }
    .page-header h2 {
        font-size: 32px;
        color: #2c3e50;
        margin: 0;
        font-weight: 600;
    }

    .el-table {
        border-radius: 8px;
        overflow: hidden;
    }
    :deep(.el-table__header) {
        background-color: #f5f7fa;
    }
    :deep(.el-table__row) {
        transition: background-color 0.3s;
    }
    :deep(.el-table__row:hover) {
        background-color: #f5f7fa;
    }
    .pagination-wrapper {
        display: flex;
        justify-content: right;
        margin-top: 30px;
    }
    .el-form-item:last-child {
        margin-bottom: 0;
    }
    .el-button {
        padding: 1px 24px;
        font-size: 14px;
    }
    /* 响应式布局 */
    @media (max-width: 768px) {
        .bilingual-corpus {
            padding: 20px;
        }
        .analysis-section {
            padding: 15px;
        }
        .input-area,
        .result-area {
            padding: 15px;
        }
        .page-header h2 {
            font-size: 24px;
        }
    }
    .result-area {
        width: 100%;
        padding: 15px;
    }
    .search-area {
        margin-bottom: 30px;
        display: flex;
    }
    .search-button {
        border-radius: 4px;
        font-weight: bold;
        padding: 6px 16px;
        transition: background-color 0.3s ease, color 0.3s ease, transform 0.1s ease;
    }
    /* 多译本部分 */
    /* 语料选择器样式 */
    .corpus-selector {
        align-items: center;
        margin-right: 20px;
    }
    .corpus-selectors {
        align-items: left;
        margin-top: 20px;
        margin-right: 20px;
    }

    .selected-corpus {
        margin-left: 15px;
        font-size: 14px;
        color: #409eff;
        font-weight: bold;
    }
    .selected-word {
        margin-bottom: 15px;
        font-size: 14px;
        color: black;
    }

    .corpus-radio-group {
        width: 100%;
        max-width: aotu;
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow-y: auto;
    }

    .corpus-radio-item {
        margin: 0;
        padding: 12px 15px;
        width: 100%;
        display: flex;
        height: min-content;
    }

    .corpus-radio-item:hover {
        background-color: #f5f7fa;
    }

    .corpus-info {
        padding-left: 8px;
        display: flex;
    }

    .corpus-name {
        font-weight: bold;
        color: #303133;
        margin-bottom: 4px;
        justify-content: left;
    }

    .corpus-desc {
        font-size: 13px;
        color: #909399;
        justify-content: left;
    }
    /* 句子对齐 */
    .sentence-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
    }

    .corpus-info {
        flex: 1;
    }

    .sentence-button {
        margin-left: 20px; /* 与左侧内容保持一定距离 */
    }
</style>