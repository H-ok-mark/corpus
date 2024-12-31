import request from "@/utils/request"

//语料库列表查询
export const corpusListService = (corpsListData) => {
    //若搜索词为空，则默认显示所有语料库
    if (corpsListData.keyword === null || corpsListData.keyword === "") {
        return request.get("/corpus/list", {
            params: {
                pageNum: corpsListData.pageNum,
                pageSize: corpsListData.pageSize,
                keyword: corpsListData.keyword,
                isUser: corpsListData.isUser,
            },

        })
    } else {
        //搜索词不为空，根据搜索词查询语料库
        return request.get("/corpus/select", {
            params: { keyword: corpsListData.keyword }
        })
    }

}

// 导入用户语料库服务
export const userCorpusImportService = (formData, params) => {
    return request.post('/corpus/usercopus', formData, {
        params: params, // 查询参数
        headers: {
            'Content-Type': 'multipart/form-data', // 自动处理文件上传
        },
    });
};