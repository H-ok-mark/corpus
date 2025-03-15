<script setup>
    // 1. 先导入所需的内容
    import { ref } from 'vue';
    import { ElMessage } from 'element-plus';
    import { useCorpusStore } from '@/stores/corpusStore';

    // 测试句子数据
    const testSentence = ref({
        id: 300,
        sourceText: 'A Steadfast Constructive Force in a Changing World',
        targetText: '坚定做变革世界中的建设性力量',
    });

    // 测试词组对齐数据
    const testWordAlignments = ref([
        {
            id: null,
            sourceWord: 'steadfast constructive force',
            targetWord: '坚定的建设性力量',
            alignSentenceId: 300,
            strategy: null,
            bidirectCorpusId: 14,
        },
        {
            id: null,
            sourceWord: 'changing world',
            targetWord: '变革世界',
            alignSentenceId: 300,
            strategy: null,
            bidirectCorpusId: 14,
        },
        {
            id: null,
            sourceWord: 'in a',
            targetWord: '在...中',
            alignSentenceId: 300,
            strategy: null,
            bidirectCorpusId: 14,
        },
    ]);

    // 然后初始化 store
    const corpusStore = useCorpusStore();
    // 清除所有 Pinia 存储数据
    const clearAllStores = () => {
        // 重置 corpusStore 到其初始状态
        corpusStore.$reset();
        ElMessage.success('已清除所有 Pinia 存储数据');
    };
</script>

<template>
    <div>测试界面</div>
    <div>
        <el-button type="danger" @click="clearAllStores"
            >清除所有存储</el-button
        >
    </div>
</template>