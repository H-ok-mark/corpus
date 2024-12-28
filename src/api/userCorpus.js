import request from "@/utils/request"

//用户语料库查询---未实现
export const userCorpusService = (userCorpusData) => {
    return request.post("/corpus/user", {
        page: userCorpusData.page,
        size: userCorpusData.size
    })
}
//搜索用户语料库
export const userCorpusSearchService = (userCorpusSearchData) => {
    return request.post('/corpus/select',
        userCorpusSearchData
    )
}

// 导入用户语料库服务
export const userCorpusImportService = (corpusForm) => {
    return request.post('/corpus/import', corpusForm, {
        headers: {
            'Content-Type': 'multipart/form-data', // 自动处理文件上传
        }
    });
};