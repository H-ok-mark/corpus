import request from "@/utils/request.js"

export const kwicService = (kwicData) => {
    return request.post('/corpus/kwic', {
        word: kwicData.word,
        leftCount: kwicData.leftCount || 5,
        rightCount: kwicData.rightCount || 5
    })
}