<script setup lang="ts">
    import { ref } from 'vue';
    import { ElMessage } from 'element-plus';
    import type { UploadUserFile } from 'element-plus';
    import { Search } from '@element-plus/icons-vue'; // 在导入区添加

    import { Loading } from 'element-plus/es/components/loading/src/service';

    // 表格数据
    const tableData = ref([
        {
            english:
                "The Industrial Revolution, which took place from the 18th to 19th centuries, was a period during which predominantly agrarian, rural societies in Europe and America became industrial and urban. Before the Industrial Revolution, manufacturing was often done in people's homes, using hand tools or basic machines.",
            chinese:
                '工业革命发生在18世纪至19世纪，在此期间，欧洲和美洲以农业为主的乡村社会转变为工业化和城市化社会。在工业革命之前，制造业通常在人们的家中进行，使用手工工具或基本机器。',
        },
        {
            english:
                'Climate change is one of the greatest challenges facing humanity today. It affects every country and can have devastating effects on communities, economies and ecosystems. Rising global temperatures have been accompanied by changes in weather and climate, with many places experiencing altered rainfall patterns, more extreme weather events, and rising sea levels.',
            chinese:
                '气候变化是当今人类面临的最大挑战之一。它影响着每个国家，可能对社区、经济和生态系统产生毁灭性影响。全球气温上升伴随着天气和气候的变化，许多地方经历着降雨模式的改变、更极端的天气事件和海平面上升。',
        },
        {
            english:
                'The development of artificial intelligence (AI) represents one of the most significant technological advancements in human history. AI systems can now perform tasks that once required human intelligence, such as visual perception, speech recognition, decision-making, and language translation. This technology has the potential to revolutionize virtually every field and industry.',
            chinese:
                '人工智能(AI)的发展代表着人类历史上最重要的技术进步之一。人工智能系统现在可以执行曾经需要人类智能的任务，如视觉感知、语音识别、决策制定和语言翻译。这项技术有可能彻底改变几乎每个领域和行业。',
        },
        {
            english:
                'Traditional Chinese medicine (TCM) has evolved over thousands of years. TCM practitioners use various mind and body practices as well as herbal medicines to treat or prevent health problems. Although some scientific evidence supports the use of some TCM practices and medicines for certain conditions, many practices remain scientifically unproven.',
            chinese:
                '中医药已经发展了数千年。中医practitioners使用各种身心疗法和草药来治疗或预防健康问题。虽然一些科学证据支持在某些情况下使用某些中医实践和药物，但许多实践仍然缺乏科学证明。',
        },
        {
            english:
                'The Silk Road was an ancient network of trade routes that connected the East and West, and was central to cultural interaction between the regions for many centuries. The Silk Road not only served as a major transportation route but also facilitated the exchange of art, religion, philosophy, technology, language, science, architecture, and every other element of civilization.',
            chinese:
                '丝绸之路是一个古老的贸易路线网络，连接着东西方，数世纪以来一直是各地区文化交流的中心。丝绸之路不仅是主要的运输路线，还促进了艺术、宗教、哲学、技术、语言、科学、建筑以及文明的其他各个要素的交流。',
        },
        {
            english:
                'Quantum computing represents a fundamentally new approach to computation. While traditional computers operate on bits that are either 0 or 1, quantum computers use quantum bits or qubits, which can exist in multiple states simultaneously. This property, known as superposition, along with other quantum phenomena, could allow quantum computers to solve certain problems exponentially faster than classical computers.',
            chinese:
                '量子计算代表着一种根本性的新计算方法。传统计算机使用非0即1的比特运算，而量子计算机使用量子比特，可以同时存在于多个状态。这种被称为叠加态的特性，以及其他量子现象，可能使量子计算机以指数级的速度解决某些问题，远快于经典计算机。',
        },
    ]);
    // 转圈加载状态
    const loading = ref(false);
    // 分页条数据模型
    const pageNum = ref(1); // 当前页
    const total = ref(20); // 总条数
    const pageSize = ref(10); // 每页显示的数据条数

    // 文件列表状态
    const singleDocFileList = ref<UploadUserFile[]>([]);
    const doubleDocFileList = {
        english: ref<UploadUserFile[]>([]),
        chinese: ref<UploadUserFile[]>([]),
    };

    // 上传配置
    const uploadConfig = {
        action: 'https://api.example.com/upload',
        accept: '.doc,.docx,.pdf,.xlsx,.xls',
        limit: 1,
    };

    // 文件上传处理函数
    const handleSingleUploadSuccess = () => {
        ElMessage.success('单文档上传成功');
    };

    const handleDoubleUploadSuccess = (type: 'english' | 'chinese') => {
        ElMessage.success(`${type === 'english' ? '英文' : '中文'}文档上传成功`);
    };

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

    // 开始对齐处理
    const handleStartAlignment = async (mode: 'single' | 'double') => {
        if (mode === 'single' && !singleDocFileList.value.length) {
            ElMessage.warning('请先上传文件');
            return;
        }
        if (
            mode === 'double' &&
            (!doubleDocFileList.english.value.length ||
                !doubleDocFileList.chinese.value.length)
        ) {
            ElMessage.warning('请上传英文和中文文档');
            return;
        }

        try {
            // TODO: 调用对齐API
            await new Promise(resolve => setTimeout(resolve, 1000));
            ElMessage.success('对齐完成');
            setIsAlignment(true);
        } catch (error) {
            ElMessage.error('对齐失败');
        }
    };

    // 单/双文档选择状态
    const simple = ref(true);
    const fileRadio = ref('单文档对齐');

    // 当前选项卡
    const activeTab = ref('import');

    // 对齐分析的结果数据（添加初始数据）
    const sentenceAlignment = ref<any[]>([
        {
            align_sentence_id: 1,
            source_text: 'This is the first source sentence.',
            target_text: '这是第一条目标句子。',
        },
        {
            align_sentence_id: 305,
            source_text: 'This chapter is an examination of the Boxer Incident',
            target_text: '本文试将义和团事件置于历史转变进程中考察',
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

    // 添加搜索词变量
    const searchVersion = ref('');

    // 添加处理搜索的函数
    const handleVersionSearch = () => {
        if (!searchVersion.value) {
            ElMessage.warning('请输入搜索内容');
            return;
        }

        // 这里可以调用相应的API进行搜索
        // 示例实现：
        loading.value = true;
        setTimeout(() => {
            // 模拟搜索结果
            versionsAnalysis.value = versionsAnalysis.value.filter(item =>
                item.target_text.includes(searchVersion.value)
            );
            loading.value = false;
        }, 500);
    };
</script>

<template>
    <div class="bilingual-corpus">
        <el-card class="translation-container">
            <!-- 选项卡 -->
            <div>
                <el-tabs v-model="activeTab" type="card">
                    <el-tab-pane label="导入平行语料" name="import">
                        <!-- 单双文档选择器 -->
                        <div class="simple-file-radio">
                            <el-radio-group v-model="fileRadio" size="large">
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
                            <el-upload
                                v-model:file-list="singleDocFileList"
                                v-bind="uploadConfig"
                                class="upload-btn"
                                @success="handleSingleUploadSuccess"
                            >
                                <el-button type="primary">上传文档</el-button>
                                <template #tip>
                                    <div class="upload-tip">
                                        支持 Word、Excel、PDF 格式
                                    </div>
                                </template>
                            </el-upload>
                            <el-button
                                type="success"
                                @click="handleStartAlignment('single')"
                                >开始对齐</el-button
                            >
                        </div>

                        <!-- 双文档对齐 -->
                        <div class="double-file" v-else>
                            <div class="upload-group">
                                <h4>英文文档</h4>
                                <el-upload
                                    v-model:file-list="
                                        doubleDocFileList.english
                                    "
                                    v-bind="uploadConfig"
                                    class="upload-btn"
                                    @success="
                                        () =>
                                            handleDoubleUploadSuccess('english')
                                    "
                                >
                                    <el-button type="primary"
                                        >上传文档</el-button
                                    >
                                </el-upload>
                            </div>
                            <el-button
                                class="upload-group"
                                type="success"
                                @click="handleStartAlignment('double')"
                                >开始对齐</el-button
                            >
                            <div class="upload-group">
                                <h4>中文文档</h4>
                                <el-upload
                                    v-model:file-list="
                                        doubleDocFileList.chinese
                                    "
                                    v-bind="uploadConfig"
                                    class="upload-btn"
                                    @success="
                                        () =>
                                            handleDoubleUploadSuccess('chinese')
                                    "
                                >
                                    <el-button type="primary"
                                        >上传文档</el-button
                                    >
                                </el-upload>
                            </div>
                        </div>
                        <!-- 结果表格 -->
                        <div v-if="isAlignment" class="result">
                            <el-table
                                :data="tableData"
                                stripe
                                style="width: 100%"
                                :border="true"
                            >
                                <el-table-column
                                    prop="english"
                                    label="English"
                                />
                                <el-table-column
                                    prop="chinese"
                                    label="Chinese"
                                />
                            </el-table>
                        </div>
                        <!-- 分页器 -->
                        <div class="pagination-wrapper">
                            <el-pagination
                                v-model:current-page="pageNum"
                                v-model:page-size="pageSize"
                                :page-sizes="[10, 15, 20]"
                                layout="sizes, jumper, total, prev, pager, next"
                                :total="total"
                                background
                            />
                        </div>
                    </el-tab-pane>

                    <!-- 句子对齐分析 -->
                    <el-tab-pane label="句子对齐分析" name="sentence">
                        <div v-if="isAlignment" class="result-area">
                            <el-table
                                v-loading="loading"
                                :data="sentenceAlignment"
                                border
                                stripe
                            >
                                <el-table-column
                                    prop="align_sentence_id"
                                    label="记录ID"
                                    width="100"
                                />
                                <el-table-column
                                    prop="source_text"
                                    label="原文"
                                    show-overflow-tooltip
                                />
                                <el-table-column
                                    prop="target_text"
                                    label="译文"
                                    show-overflow-tooltip
                                />
                            </el-table>
                        </div>
                        <!-- 分页器 -->
                        <div class="pagination-wrapper">
                            <el-pagination
                                v-if="sentenceAlignment.length > 0"
                                v-model:current-page="pageNum"
                                v-model:page-size="pageSize"
                                :page-sizes="[10, 15, 20]"
                                layout="sizes, jumper, total, prev, pager, next"
                                :total="total"
                                background
                            />
                        </div>
                    </el-tab-pane>

                    <!-- 词汇对齐分析 -->
                    <el-tab-pane label="词汇对齐分析" name="phrase">
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
                        </div>
                        <!-- 分页器 -->
                        <div class="pagination-wrapper">
                            <el-pagination
                                v-model:current-page="pageNum"
                                v-model:page-size="pageSize"
                                :page-sizes="[10, 15, 20]"
                                layout="sizes, jumper, total, prev, pager, next"
                                :total="total"
                                background
                            />
                        </div>
                    </el-tab-pane>

                    <!-- 多语境翻译分析 -->
                    <el-tab-pane label="多语境翻译分析" name="context">
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
                        </div>
                        <!-- 分页器 -->
                        <div class="pagination-wrapper">
                            <el-pagination
                                v-model:current-page="pageNum"
                                v-model:page-size="pageSize"
                                :page-sizes="[10, 15, 20]"
                                layout="sizes, jumper, total, prev, pager, next"
                                :total="total"
                                background
                            />
                        </div>
                    </el-tab-pane>

                    <!-- 多译本对比分析 -->
                    <el-tab-pane label="多译本文段对比分析" name="versions">
                        <!-- 搜索框 -->
                        <div class="search-area">
                            <el-input
                                placeholder="请输入原句"
                                size="large"
                                v-model="searchVersion"
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
                        <!--多译本对比分析 -->
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
                                <el-table-column prop="source" label="源语句" />
                                <el-table-column
                                    prop="translation"
                                    label="翻译语句"
                                />
                                <el-table-column
                                    prop="strategy"
                                    label="翻译策略"
                                />
                                <el-table-column prop="version" label="译本" />
                            </el-table>
                        </div>
                        <!-- 分页器 -->
                        <div class="pagination-wrapper">
                            <el-pagination
                                v-if="versionsAnalysis.length > 0"
                                v-model:current-page="pageNum"
                                v-model:page-size="pageSize"
                                :page-sizes="[10, 15, 20]"
                                layout="sizes, jumper, total, prev, pager, next"
                                :total="total"
                                background
                            />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </div>
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
        height: 150px;
    }
    .simple-file {
        display: flex;
        justify-content: center;
        text-align: center;
        height: 150px;
    }
    .double-file {
        display: flex;
        justify-content: center;
        text-align: center;
        height: 150px;
    }
    .upload-btn {
        margin-left: 50px;
        margin-right: 50px;
    }
    .result {
        margin-top: 1px;
        display: flex;
        justify-content: center;
    }
    .upload-group {
        text-align: center;
    }
    .upload-group h4 {
        margin-bottom: 16px;
        color: #606266;
    }
    .upload-tip {
        font-size: 14px;
        color: #909399;
        margin-top: 8px;
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
        padding: 12px 24px;
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
        margin: 30px;
        display: flex;
    }
    .search-button {
        border-radius: 4px;
        font-weight: bold;
        padding: 6px 16px;
        transition: background-color 0.3s ease, color 0.3s ease, transform 0.1s ease;
    }
</style>