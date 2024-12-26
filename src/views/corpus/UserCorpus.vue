<template>
    <div class="corpus-container">
        <el-card class="main-card">
            <!-- 语料库管理头部 -->
            <div class="header-content">
                <h2>个人语料库管理</h2>
                <el-button type="primary" @click="showImportDialog">
                    <el-icon><Upload /></el-icon>导入语料库
                </el-button>
            </div>

            <!-- 搜索区域 -->
            <div class="search-section">
                <el-input
                    v-model="searchQuery"
                    placeholder="搜索语料库..."
                    class="search-input"
                    :prefix-icon="Search"
                    clearable
                    @clear="handleSearch"
                    @input="handleSearch"
                />
            </div>

            <!-- 语料库列表 -->
            <div class="list-section">
                <el-table :data="filteredCorpusList" stripe style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="语料库名称"
                        width="180"
                    />
                    <el-table-column prop="description" label="描述" />
                    <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="180"
                    />
                    <el-table-column fixed="right" label="操作" width="180">
                        <template #default="scope">
                            <el-button-group>
                                <el-button
                                    type="primary"
                                    size="default"
                                    @click="handleEdit(scope.row)"
                                >
                                    编辑
                                </el-button>
                                <el-button
                                    type="danger"
                                    size="default"
                                    @click="handleDelete(scope.row)"
                                >
                                    删除
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <!-- 导入语料库对话框 -->
        <el-dialog
            v-model="importDialogVisible"
            title="导入语料库"
            width="500px"
            class="import-dialog"
        >
            <el-form
                :model="corpusForm"
                :rules="rules"
                ref="corpusFormRef"
                label-width="100px"
            >
                <el-form-item label="语料库名称" prop="name">
                    <el-input
                        v-model="corpusForm.name"
                        placeholder="请输入语料库名称"
                    />
                </el-form-item>

                <el-form-item label="语料库描述" prop="description">
                    <el-input
                        v-model="corpusForm.description"
                        type="textarea"
                        rows="3"
                        placeholder="请输入语料库描述"
                    />
                </el-form-item>

                <el-form-item label="上传文件">
                    <el-upload
                        class="upload-demo"
                        drag
                        action="/api/corpus/import"
                        multiple
                        :on-success="handleUploadSuccess"
                        :on-error="handleUploadError"
                    >
                        <el-icon class="el-icon--upload"
                            ><upload-filled
                        /></el-icon>
                        <div class="el-upload__text">
                            将文件拖到此处，或<em>点击上传</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">
                                支持的文件格式：.txt, .doc, .docx, .pdf
                                (单个文件不超过10MB)
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="importDialogVisible = false"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="submitForm"
                        >确定</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { Search, Upload, UploadFilled } from '@element-plus/icons-vue';
    import { ElMessage, ElMessageBox } from 'element-plus';

    // 数据定义
    const searchQuery = ref('');
    const importDialogVisible = ref(false);
    const corpusList = ref([
        {
            id: 1,
            name: '示例语料库1',
            description: '这是一个示例语料库描述',
            createTime: '2024-03-20 10:00:00',
        },
    ]);

    // 计算属性：过滤后的语料库列表
    const filteredCorpusList = computed(() => {
        return corpusList.value.filter(
            corpus =>
                corpus.name
                    .toLowerCase()
                    .includes(searchQuery.value.toLowerCase()) ||
                corpus.description
                    .toLowerCase()
                    .includes(searchQuery.value.toLowerCase())
        );
    });

    // 方法定义
    const showImportDialog = () => {
        importDialogVisible.value = true;
    };

    const handleSearch = () => {
        // 实现搜索逻辑
    };

    const handleEdit = (row: any) => {
        console.log('编辑:', row);
    };

    const handleDelete = (row: any) => {
        ElMessageBox.confirm('确定要删除这个语料库吗？', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        })
            .then(() => {
                // 实现删除逻辑
                ElMessage.success('删除成功');
            })
            .catch(() => {
                ElMessage.info('已取消删除');
            });
    };

    const handleUploadSuccess = (response: any, file: any) => {
        corpusForm.value.files.push(file);
        ElMessage.success('文件上传成功');
    };

    const handleUploadError = () => {
        ElMessage.error('上传失败');
    };

    // 表单数据
    const corpusFormRef = ref();
    const corpusForm = ref({
        name: '',
        description: '',
        files: [],
    });

    // 表单验证规则
    const rules = {
        name: [
            { required: true, message: '请输入语料库名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
        ],
        description: [
            { required: true, message: '请输入语料库描述', trigger: 'blur' },
            { max: 200, message: '描述不能超过200个字符', trigger: 'blur' },
        ],
    };

    // 提交表单
    const submitForm = () => {
        if (!corpusFormRef.value) return;

        corpusFormRef.value.validate((valid: boolean) => {
            if (valid) {
                // TODO: 实现提交逻辑
                ElMessage.success('创建成功');
                importDialogVisible.value = false;
                resetForm();
            }
        });
    };

    // 重置表单
    const resetForm = () => {
        corpusForm.value = {
            name: '',
            description: '',
            files: [],
        };
        corpusFormRef.value?.resetFields();
    };
</script>

<style scoped>
    .corpus-container {
        padding: 20px;
        background-color: #f5f7fa;
        min-height: 100vh;
    }

    .main-card {
        min-height: calc(100vh - 40px);
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #ebeef5;
    }

    .search-section {
        margin-bottom: 20px;
    }

    .search-input {
        width: 100%;
    }

    .list-section {
        margin-top: 20px;
    }

    .el-upload__tip {
        color: #909399;
        font-size: 12px;
        margin-top: 8px;
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }

    .el-form-item:last-child {
        margin-bottom: 0;
    }

    /* 对话框样式 */
    .import-dialog :deep(.el-dialog__header) {
        margin: 0;
        padding: 20px 24px;
        border-bottom: 1px solid var(--el-border-color-lighter);
        background: #f5f7fa;
    }

    .import-dialog :deep(.el-dialog__body) {
        padding: 24px;
    }

    .import-dialog :deep(.el-dialog__footer) {
        padding: 16px 24px;
        border-top: 1px solid var(--el-border-color-lighter);
    }

    /* 表单样式 */
    :deep(.el-form-item__label) {
        font-weight: 500;
    }

    :deep(.el-input__wrapper),
    :deep(.el-textarea__inner) {
        transition: all 0.3s;
    }

    :deep(.el-input__wrapper:hover),
    :deep(.el-textarea__inner:hover) {
        box-shadow: 0 0 0 1px var(--el-color-primary) inset;
    }

    /* 上传区域样式 */
    .upload-demo {
        width: 100%;
    }

    :deep(.el-upload-dragger) {
        width: 100%;
        height: 180px;
        padding: 20px;
        background: #fafafa;
        border: 2px dashed #e4e7ed;
        border-radius: 8px;
        transition: all 0.3s;
    }

    :deep(.el-upload-dragger:hover) {
        border-color: var(--el-color-primary);
        background: #f0f7ff;
    }

    .el-icon--upload {
        font-size: 48px;
        color: var(--el-color-primary);
        margin-bottom: 12px;
    }

    .el-upload__text {
        color: #606266;
        font-size: 14px;
        line-height: 1.6;
    }

    .el-upload__text em {
        color: var(--el-color-primary);
        font-style: normal;
        cursor: pointer;
    }

    .el-upload__tip {
        margin-top: 8px;
        font-size: 13px;
        color: #909399;
        line-height: 1.4;
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }

    :deep(.el-button) {
        padding: 8px 20px;
        transition: all 0.3s;
    }

    :deep(.el-button--primary) {
        font-weight: 500;
    }
</style>