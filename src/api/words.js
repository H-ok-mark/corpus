import request from "@/utils/request.js"

export const wordsListService = () => {
    return request.get("/corpus/sort")
}

export const wordsSearchService = (searchWord) => {
    return request.post('/corpus/frequency', searchWord)
}