import request from "@/utils/request.js"

export const kwicService = (kwicData) => {
    console.log({
        file: kwicData.file,
        word: kwicData.word,
        leftpart: kwicData.leftpart,
        rightpart: kwicData.rightpart,
        pageNum: kwicData.pageNum,
        pageSize: kwicData.pageSize
    });

    return request.post('/corpus/mono/kwic', {
        file: kwicData.file,
        word: kwicData.word,
        leftpart: kwicData.leftpart,
        rightpart: kwicData.rightpart,
        pageNum: kwicData.pageNum,
        pageSize: kwicData.pageSize
    })
}