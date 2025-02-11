<script setup lang="ts">
    import { ref, computed } from 'vue';
    import { Search, Upload, UploadFilled } from '@element-plus/icons-vue';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { useCorpusStore } from '@/stores/corpusStore';

    // 数据定义
    const searchQuery = ref('');
    const importDialogVisible = ref(false);
    const applyStatus = ref({}); // 将apply改为对象，用于存储每个语料库的应用状态
    //分页查询
    const pageNum = ref(1);
    const total = ref(20);
    const pageSize = ref(10); // 每页显示的数据条数
    const corpusListData = ref([
        {
            id: 1,
            name: '示例语料库1',
            description: '这是一个示例语料库描述',
            createTime: '2024-03-20',
        },
    ]);

    import {
        corpusListService,
        userCorpusImportService,
        userCorpusDeleteService,
    } from '@/api/userCorpus';
    import { el } from 'element-plus/dist/locale/zh-cn';
    import { formatDate } from '@/utils/date';

    const isUser = ref(true);
    //获取语料库列表
    const curposList = async () => {
        let result = await corpusListService({
            pageNum: pageNum.value,
            pageSize: pageSize.value,
            keyword: searchQuery.value,
            isUser: isUser.value,
        });
        // 将筛选后的数据存入 DataData
        corpusListData.value = result.data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            createTime: formatDate(item.createdAt),
        }));
        // total.value = result.total;
        console.log(corpusListData.value);
    };
    curposList();

    // 处理分页变化
    const handlePageChange = newPage => {
        pageNum.value = newPage;
        curposList(); // 当前页码变化时重新发起查询
    };
    // 计算属性：过滤后的语料库列表
    const filteredData = computed(() => {
        return corpusListData.value.filter(
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
    const handleDelete = async corpusId => {
        await ElMessageBox.confirm('确定要删除这个语料库吗？', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });

        // 调用删除API
        await userCorpusDeleteService(corpusId);
        ElMessage.success('删除成功');
        // 删除成功后刷新列表
        await curposList();
    };

    // 表单数据
    const corpusFormRef = ref();
    const corpusForm = ref({
        name: '',
        description: '',
        files: [],
    });
    // 上传语料库的函数
    const uploadCorpus = async () => {
        if (!corpusFormRef.value) return;
        const valid = await corpusFormRef.value.validate();
        if (valid) {
            const formData = new FormData();
            // 传递的查询参数
            const params = {
                name: corpusForm.value.name,
                description: corpusForm.value.description,
            };
            // 添加文件数据（假设 files 是一个文件数组）
            corpusForm.value.files.forEach(file => {
                formData.append('file', file);
            });
            // 调用服务，传递 formData 和查询参数
            let result = await userCorpusImportService(formData, {
                name: corpusForm.value.name,
                description: corpusForm.value.description,
            });
            ElMessage.success('创建成功');
            importDialogVisible.value = false;
            resetForm();
            await curposList();
        }
    };

    // 表单校验规则
    const rules = {
        name: [
            { required: true, message: '请输入语料库名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
        ],
        description: [
            { required: true, message: '请输入语料库描述', trigger: 'blur' },
            { max: 200, message: '描述不能超过200个字符', trigger: 'blur' },
        ],
        files: [
            { required: true, message: '请上传至少一个文件', trigger: 'change' },
            {
                validator: (rule, value, callback) => {
                    if (corpusForm.value.files.length === 0) {
                        return callback(new Error('请上传至少一个文件'));
                    }
                    callback();
                },
                trigger: 'change',
            },
        ],
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
    // 上传文件变化时的回调
    const handleFileChange = (file: any, fileList: any) => {
        // 更新文件列表
        corpusForm.value.files = fileList.map(item => item.raw); // 保存原始文件对象
    };

    // 语料库 store
    const corpusStore = useCorpusStore();

    // 当前应用的语料库ID
    const currentAppliedCorpusId = ref(corpusStore.appliedCorpusId);

    // 处理应用语料库
    const handleApply = corpus => {
        // 如果已经应用了其他语料库，先取消之前的应用
        if (
            currentAppliedCorpusId.value &&
            currentAppliedCorpusId.value !== corpus.id
        ) {
            ElMessage.warning('只能同时应用一个语料库');
            return;
        }

        currentAppliedCorpusId.value = corpus.id;
        // 将当前选择的 corpus 存入 store
        corpusStore.setCurrentCorpus(corpus);
        // corpusStore.appliedCorpusId = corpus.id;
        // corpusStore.appliedCorpusName = corpus.name;
        ElMessage.success(`已应用语料库：${corpus.name}`);
    };

    // 处理取消应用
    const handleCancel = corpus => {
        currentAppliedCorpusId.value = null;
        corpusStore.clearCurrentCorpus();
        ElMessage.warning(`已取消应用语料库：${corpus.name}`);
    };
</script>

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
                    @clear="curposList()"
                    @input="curposList()"
                />
            </div>

            <!-- 语料库列表 -->
            <div class="list-section">
                <el-table :data="filteredData" stripe style="width: 100%">
                    <el-table-column prop="name" label="语料库名称" width="180">
                        <template #default="scope">
                            <span class="corpus-name">{{
                                scope.row.name
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="description" label="描述" />
                    <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="180"
                    />
                    <el-table-column fixed="right" label="操作" width="180">
                        <template #default="scope">
                            <el-button
                                v-if="currentAppliedCorpusId === scope.row.id"
                                type="success"
                                size="default"
                                @click="handleCancel(scope.row)"
                            >
                                取消应用
                            </el-button>
                            <el-button-group v-else>
                                <el-button
                                    type="primary"
                                    size="default"
                                    :disabled="currentAppliedCorpusId !== null"
                                    @click="handleApply(scope.row)"
                                >
                                    应用
                                </el-button>
                                <!-- 删除按钮 -->
                                <el-button
                                    type="danger"
                                    size="default"
                                    @click="handleDelete(scope.row.id)"
                                >
                                    删除
                                </el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页查询 -->
            <div class="pagination">
                <el-pagination
                    v-model:current-page="pageNum"
                    v-model:page-size="pageSize"
                    :total="total"
                    layout="jumper,total, prev, pager, next "
                    @current-change="handlePageChange"
                />
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
                <!-- 语料库名称 -->
                <el-form-item label="语料库名称" prop="name">
                    <el-input
                        v-model="corpusForm.name"
                        placeholder="请输入语料库名称"
                    />
                </el-form-item>

                <!-- 语料库描述 -->
                <el-form-item label="语料库描述" prop="description">
                    <el-input
                        v-model="corpusForm.description"
                        type="textarea"
                        rows="3"
                        placeholder="请输入语料库描述"
                    />
                </el-form-item>

                <!-- 文件上传 -->
                <el-form-item label="上传文件" prop="files">
                    <el-upload
                        class="upload-demo"
                        drag
                        :auto-upload="false"
                        :on-change="handleFileChange"
                        multiple
                    >
                        <el-icon class="el-icon--upload">
                            <upload-filled />
                        </el-icon>
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

            <!-- 弹窗底部 -->
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="importDialogVisible = false"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="uploadCorpus"
                        >确定</el-button
                    >
                </div>
            </template>
        </el-dialog>
    </div>
</template>



<style scoped>
    .corpus-container {
        background-color: #f5f7fa;
        min-height: 100vh;
    }

    .main-card {
        padding: 20px;
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
    .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
    .corpus-name {
        font-weight: bold;
        color: #303133;
        font-size: 14px;
    }
</style>