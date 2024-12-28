import request from "@/utils/request"

//语料库列表查询
export const corpusListService = (corpsListData) => {
    return request.get("/corpus/list", {
        params: {
            pageNum: corpsListData.pageNum,
            pageSize: corpsListData.pageSize,
            searchCorpus: corpsListData.searchCorpus,
        },

    })
}
//语料库下载
export const corpusDownloadService = (corpusDownloadId) => {
    return request.get("/corpus/download", corpusDownloadId
    )
}