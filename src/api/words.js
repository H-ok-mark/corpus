import request from "@/utils/request"

export const wordsListService = (wordsSearchParams) => {
    // 若搜索词为空，则默认显示所有词
    if (!wordsSearchParams.word) {
        return request.get("/corpus/mono/sort", {
            params: {
                corpusId: 2,
                pageSize: wordsSearchParams.pageSize,
                pageNumber: wordsSearchParams.pageNum,
            },
        });
    } else {
        return request.get('/corpus/mono/frequency', {
            params: {
                keyword: wordsSearchParams.word,
                corpusId: 2,
            },
        });
    }
};
