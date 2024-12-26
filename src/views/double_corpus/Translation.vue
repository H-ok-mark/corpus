<script setup lang="ts">
    import { ref } from 'vue';
    import { Search } from '@element-plus/icons-vue';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import type { UploadProps, UploadUserFile } from 'element-plus';
    const words = ref('');

    // 点击搜索按钮触发的方法
    const onSearch = () => {
        console.log('搜索内容:', words.value);
    };
    // 表格数据
    const tableData = ref([
        {
            english: 'hello',
            chinese: '你好',
        },
        {
            english: 'world',
            chinese: '世界',
        },
        {
            english: 'good',
            chinese: '好',
        },
        {
            english: 'bad',
            chinese: '坏',
        },
        {
            english: 'apple',
            chinese: '苹果',
        },
        {
            english: 'banana',
            chinese: '香蕉',
        },
        {
            english: 'orange',
            chinese: '橙子',
        },
        {
            english: 'watermelon',
            chinese: '西瓜',
        },
        {
            english: 'grape',
            chinese: '葡萄',
        },
    ]);

    //分页条数据模型
    const pageNum = ref(1); //当前页
    const total = ref(20); //总条数

    //当前页码发生变化，调用此函数
    const onCurrentChange = num => {
        pageNum.value = num;
    };

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
        } catch (error) {
            ElMessage.error('对齐失败');
        }
    };

    //单/双文档选择
    const simple = ref(true);
    //单/双文档选项
    const fileRadio = ref('单文档对齐');
</script>

<template>
    <el-card class="translation-container">
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
                    <div class="upload-tip">支持 Word、Excel、PDF 格式</div>
                </template>
            </el-upload>
            <el-button type="success" @click="handleStartAlignment('single')"
                >开始对齐</el-button
            >
        </div>

        <!-- 双文档对齐 -->
        <div class="double-file" v-else>
            <div class="upload-group">
                <h4>英文文档</h4>
                <el-upload
                    v-model:file-list="doubleDocFileList.english"
                    v-bind="uploadConfig"
                    class="upload-btn"
                    @success="() => handleDoubleUploadSuccess('english')"
                >
                    <el-button type="primary">上传文档</el-button>
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
                    v-model:file-list="doubleDocFileList.chinese"
                    v-bind="uploadConfig"
                    class="upload-btn"
                    @success="() => handleDoubleUploadSuccess('chinese')"
                >
                    <el-button type="primary">上传文档</el-button>
                </el-upload>
            </div>
        </div>

        <!-- 结果表格 -->
        <div class="result">
            <el-table
                :data="tableData"
                stripe
                style="width: 100%"
                :border="true"
            >
                <el-table-column prop="english" label="English" />
                <el-table-column prop="chinese" label="Chinese" />
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
    .translation-container {
        min-height: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .simple-file {
        display: flex;
        justify-content: center;
        margin-top: 10px;
        text-align: center;
        height: 150px;
    }
    .double-file {
        display: flex;
        justify-content: center;
        margin-top: 10px;
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
</style>
