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


//语料库下载
export const corpusDownloadService = (corpusDownloadId) => {
    return request.get("/corpus/download", corpusDownloadId
    )
}