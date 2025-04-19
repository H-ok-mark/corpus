<script setup lang="ts">
    import { ref } from 'vue';
    import { Document, Connection, Cpu, DataLine } from '@element-plus/icons-vue';

    // 核心功能模块
    const coreFeatures = ref([
        {
            title: '语料库管理',
            description: '支持多种格式导入导出，便捷管理个人语料库',
            icon: Document,
        },
        {
            title: '智能KWIC分析',
            description: '基于AI的词义分析、句法结构分析、词汇用法总结',
            icon: Cpu,
        },
        {
            title: '双语对齐分析',
            description: '智能识别源语和译入语对应关系，分析翻译策略',
            icon: Connection,
        },
        {
            title: '数据可视化',
            description: '词频统计、搭配分析、词汇用法总结等多维度展示',
            icon: DataLine,
        },
    ]);

    // AI特色功能
    const aiFeatures = ref([
        {
            title: '词义智能识别',
            desc: '自动识别检索词的多重词义，展示不同语境用法',
        },
        {
            title: '词汇用法总结',
            desc: '智能总结词汇用法，概述基本框架和常见情境',
        },
        {
            title: '句法结构分析',
            desc: '智能分析句法结构，展示词汇搭配规律',
        },
    ]);

    // 平台统计数据
    const statistics = ref([
        { value: '10000000+', title: '语料总量(词)' },
        { value: '中外文学著作、双语篇章+', title: '专业领域覆盖' },
        { value: 99, title: '分析准确率', suffix: '%' },
    ]);
</script>

<template>
    <div class="welcome-container">
        <!-- Banner区域 -->
        <el-card class="banner-section">
            <div class="banner-content">
                <h1>语料库智能应用平台</h1>
                <p>基于AI技术的新一代语料库分析工具</p>
                <div class="banner-buttons">
                    <el-button
                        type="primary"
                        size="large"
                        @click="$router.push('/corpus/users')"
                    >
                        开始使用
                    </el-button>
                    <el-button size="large">了解更多</el-button>
                </div>
            </div>
        </el-card>

        <!-- 统计数据区 -->
        <el-card class="statistics-section">
            <el-row :gutter="20">
                <el-col :span="8" v-for="stat in statistics" :key="stat.title">
                    <el-statistic
                        :value="stat.value"
                        :title="stat.title"
                        :suffix="stat.suffix"
                    />
                </el-col>
            </el-row>
        </el-card>

        <!-- 快速入门指南 -->
        <el-card class="guide-section">
            <template #header>
                <h2>快速入门</h2>
            </template>
            <el-steps :active="1" finish-status="success">
                <el-step title="创建账号" description="注册您的专属账号" />
                <el-step title="导入语料" description="支持多种格式文件上传" />
                <el-step title="开始分析" description="使用AI助手进行分析" />
            </el-steps>
        </el-card>

        <!-- 核心功能区 -->
        <el-row :gutter="20" class="feature-section">
            <el-col
                :span="6"
                v-for="feature in coreFeatures"
                :key="feature.title"
            >
                <el-card class="feature-card" shadow="hover">
                    <el-icon class="feature-icon" :size="40">
                        <component :is="feature.icon" />
                    </el-icon>
                    <h3>{{ feature.title }}</h3>
                    <p>{{ feature.description }}</p>
                </el-card>
            </el-col>
        </el-row>

        <!-- AI特色功能区 -->
        <el-card class="ai-section">
            <template #header>
                <h2>AI智能分析能力</h2>
            </template>
            <el-row :gutter="20">
                <el-col
                    :span="8"
                    v-for="feature in aiFeatures"
                    :key="feature.title"
                >
                    <div class="ai-feature-item">
                        <h3>{{ feature.title }}</h3>
                        <p>{{ feature.desc }}</p>
                    </div>
                </el-col>
            </el-row>
        </el-card>

        <el-footer>©Corpus+ 语料库智能应用平台</el-footer>
    </div>
</template>

<style scoped>
    .welcome-container {
        padding: 20px;
        background-color: #f5f7fa;
        min-height: 100vh;
    }

    .banner-section {
        margin-bottom: 30px;
        background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
        color: white;
    }

    .banner-content {
        padding: 60px 20px;
        text-align: center;
    }

    .banner-content h1 {
        font-size: 2.5em;
        margin-bottom: 20px;
    }

    .banner-buttons {
        margin-top: 30px;
    }

    .feature-section {
        margin-bottom: 30px;
    }

    .feature-card {
        height: 230px;
        text-align: center;
        transition: all 0.3s;
    }

    .feature-card:hover {
        transform: translateY(-5px);
    }

    .feature-icon {
        color: #409eff;
        margin: 20px 0;
    }

    .ai-section {
        margin-bottom: 30px;
    }

    .ai-feature-item {
        padding: 20px;
        text-align: center;
    }

    .statistics-section {
        /* text-align: center; */
        margin-bottom: 30px;
    }

    .guide-section {
        margin-bottom: 30px;
    }

    :deep(.el-statistic__content) {
        font-size: 24px;
        color: #409eff;
    }

    :deep(.el-step__title) {
        font-size: 16px;
    }

    :deep(.el-step__description) {
        font-size: 14px;
    }
    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
</style>