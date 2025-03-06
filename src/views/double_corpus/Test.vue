<script setup>
    // 1. 先导入所需的内容
    import { ref } from 'vue';
    import { ElMessage } from 'element-plus';
    import { useCorpusStore } from '@/stores/corpusStore';

    // 2. 然后初始化 store
    const corpusStore = useCorpusStore();
    const currentAppliedCorpusId = ref(null);

    // 3. 处理取消应用（清除单个 store 数据）
    const handleCancel = () => {
        if (currentAppliedCorpusId.value) {
            const corpus = corpusStore.corpusMap.get(currentAppliedCorpusId.value);
            currentAppliedCorpusId.value = null;
            corpusStore.clearCurrentCorpus();
            ElMessage.warning(`已取消应用语料库：${corpus?.name || '未知语料库'}`);
        } else {
            ElMessage.info('当前没有应用的语料库');
        }
        console.log('currentAppliedCorpusId', currentAppliedCorpusId.value);
    };

    // 4. 清除所有 Pinia 存储数据
    const clearAllStores = () => {
        // 重置 corpusStore 到其初始状态
        corpusStore.$reset();

        // 如果有其他 store 也需要清除
        // otherStore.$reset();

        ElMessage.success('已清除所有 Pinia 存储数据');
    };
</script>

<template>
    <div>测试界面</div>
    <div>
        <el-button type="primary" @click="handleCancel">取消应用</el-button>
        <el-button type="danger" @click="clearAllStores"
            >清除所有存储</el-button
        >
    </div>
</template>