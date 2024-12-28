import request from "@/utils/request.js"

export const wordsSearchService = (wordsSearchParams) => {
    //若搜索词为空，则默认显示所有词
    if (wordsSearchParams.word.value === null) {
        return request.get("/corpus/sort")
    } else {
        return request.post('/corpus/frequency', {
            word: wordsSearchParams.word.value,
            page: wordsSearchParams.pageNum.value,
            size: wordsSearchParams.size.value,
        },)
    }

}