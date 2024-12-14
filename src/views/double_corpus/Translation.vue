
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

    // 上传文件--单文档
    const fileList = ref<UploadUserFile[]>([
        {
            name: 'element-plus-logo.svg',
            url: 'https://element-plus.org/images/element-plus-logo.svg',
        },
        {
            name: 'element-plus-logo2.svg',
            url: 'https://element-plus.org/images/element-plus-logo.svg',
        },
    ]);

    const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
        console.log(file, uploadFiles);
    };

    const handlePreview: UploadProps['onPreview'] = uploadFile => {
        console.log(uploadFile);
    };

    const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
        ElMessage.warning(
            `The limit is 2, you selected ${
                files.length
            } files this time, add up to ${
                files.length + uploadFiles.length
            } totally`
        );
    };

    const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
        return ElMessageBox.confirm(
            `Cancel the transfer of ${uploadFile.name} ?`
        ).then(
            () => true,
            () => false
        );
    };
    //单/双文档选择
    const simple = true;
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
            <!-- 文件上传 -->
            <el-upload
                v-model:file-list="fileList"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                multiple
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :limit="2"
                :on-exceed="handleExceed"
            >
                <el-button type="primary" plain>Click to upload</el-button>
                <template #tip>
                    <div class="el-upload__tip" text-align:center>
                        Only excel, word, and pdf are supported
                    </div>
                </template>
            </el-upload>

            <!-- 开始按钮 -->
            <el-button type="success">begin</el-button>
        </div>
        <!-- 双文档对齐 -->
        <div class="double-file" v-else>
            <el-upload
                v-model:file-list="fileList"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                multiple
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :limit="2"
                :on-exceed="handleExceed"
            >
                <el-button type="primary" plain>Click to upload</el-button>
            </el-upload>
            <el-button type="success">begin</el-button>
            <el-upload
                v-model:file-list="fileList"
                class="upload-demo"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                multiple
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :limit="2"
                :on-exceed="handleExceed"
            >
                <el-button type="primary" plain>Click to upload</el-button>
            </el-upload>
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
    }
    .double-file {
        display: flex;
        justify-content: center;
        margin-top: 10px;
        text-align: center;
    }

    .result {
        margin-top: 1px;
        display: flex;
        justify-content: center;
    }
</style>
