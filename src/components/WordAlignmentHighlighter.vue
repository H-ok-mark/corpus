<script setup>
    import { ref, computed } from 'vue';

    const props = defineProps({
        // 当前句子数据
        sentenceData: {
            type: Object,
            required: true,
        },
        // 全部词组对齐数据
        wordAlignments: {
            type: Array,
            default: () => [],
        },
    });

    // 当前选中的词组对ID
    const selectedPairId = ref(null);

    // 过滤出当前句子的词组对齐数据
    const currentSentenceWordAlignments = computed(() => {
        if (!props.sentenceData || !props.sentenceData.id) return [];
        return props.wordAlignments.filter(
            item => item.alignSentenceId === props.sentenceData.id
        );
    });

    // 转义正则表达式中的特殊字符
    const escapeRegExp = string => {
        if (!string) return '';
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // 处理原文中的词组高亮
    const highlightedSourceText = computed(() => {
        if (!props.sentenceData || !props.sentenceData.sourceText) return '';

        let text = props.sentenceData.sourceText;

        // 按词组长度降序排序，避免较短词组替换较长词组的一部分
        const sortedAlignments = [...currentSentenceWordAlignments.value].sort(
            (a, b) => b.sourceWord.length - a.sourceWord.length
        );

        sortedAlignments.forEach((alignment, index) => {
            const uniqueId = `${props.sentenceData.id}-${index}`;
            const regex = new RegExp(
                `(${escapeRegExp(alignment.sourceWord)})`,
                'gi'
            );

            const highlightClass =
                selectedPairId.value === uniqueId
                    ? 'highlighted-word selected-word'
                    : 'highlighted-word';

            text = text.replace(
                regex,
                `<span class="${highlightClass}" 
                    data-pair-id="${uniqueId}"
                    data-sentence-id="${props.sentenceData.id}"
                    data-index="${index}">$1</span>`
            );
        });

        return text;
    });

    // 处理译文中的词组高亮
    const highlightedTargetText = computed(() => {
        if (!props.sentenceData || !props.sentenceData.targetText) return '';

        // 如果没有选中词组，直接返回原文
        if (selectedPairId.value === null) {
            return props.sentenceData.targetText;
        }

        // 获取当前选中词组的索引
        const [sentenceId, selectedIndex] = selectedPairId.value
            .split('-')
            .map(Number);

        // 确保是当前句子
        if (sentenceId !== props.sentenceData.id) {
            return props.sentenceData.targetText;
        }

        // 获取选中的词组映射
        const selectedAlignment =
            currentSentenceWordAlignments.value[selectedIndex];
        if (!selectedAlignment) return props.sentenceData.targetText;

        // 高亮译文中对应的词组
        let text = props.sentenceData.targetText;
        const regex = new RegExp(
            `(${escapeRegExp(selectedAlignment.targetWord)})`,
            'gi'
        );

        return text.replace(
            regex,
            `<span class="highlighted-target selected-word">$1</span>`
        );
    });

    // 处理词组点击
    const handleWordClick = event => {
        // 只处理高亮词组的点击
        if (event.target.classList.contains('highlighted-word')) {
            const pairId = event.target.dataset.pairId;

            // 切换选中状态
            if (selectedPairId.value === pairId) {
                selectedPairId.value = null;
            } else {
                selectedPairId.value = pairId;
            }
        } else {
            // 点击非词组区域，取消选中
            selectedPairId.value = null;
        }
    };

    // 清除选中状态
    const clearSelection = () => {
        selectedPairId.value = null;
    };
</script>

<template>
    <div class="word-alignment-container">
        <!-- 原文 -->
        <div
            class="source-text"
            v-html="highlightedSourceText"
            @click="handleWordClick"
        ></div>

        <!-- 译文 -->
        <div
            class="target-text"
            v-html="highlightedTargetText"
            @click="clearSelection"
        ></div>
    </div>
</template>

<style scoped>
    .word-alignment-container {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .source-text,
    .target-text {
        line-height: 1.6;
        padding: 8px 0;
    }

    :deep(.highlighted-word) {
        cursor: pointer;
        color: #409eff;
        background-color: #ecf5ff;
        padding: 2px 4px;
        border-radius: 3px;
        transition: all 0.3s;
    }

    :deep(.highlighted-word:hover) {
        background-color: #409eff;
        color: white;
    }

    :deep(.highlighted-target) {
        color: #67c23a;
        background-color: #f0f9eb;
        padding: 2px 4px;
        border-radius: 3px;
    }

    :deep(.selected-word) {
        font-weight: bold;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.5);
        position: relative;
        z-index: 1;
    }

    :deep(.highlighted-target.selected-word) {
        box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.5);
    }
</style>