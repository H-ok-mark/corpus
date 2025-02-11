import request from "@/utils/request"
export const wordsListService = (wordsSearchParams) => {
    // 若搜索词为空，则默认显示所有词
    if (!wordsSearchParams.word) {
        return request.get("/corpus/mono/sort", {
            params: {
                corpusId: wordsSearchParams.corpusId,
                pageSize: wordsSearchParams.pageSize,
                pageNumber: wordsSearchParams.pageNum,
            },
        });
    } else {
        return request.get('/corpus/mono/frequency', {
            params: {
                keyword: wordsSearchParams.word,
                corpusId: wordsSearchParams.corpusId,
            },
        });
    }
};


// import request from "@/utils/request";
// import { ApiResponse, WordData, WordDataArray } from "@/utils/apiTypes";
// export const wordsListService = (wordsSearchParams) => {
//     // 若搜索词为空，则默认显示所有词
//     if (!wordsSearchParams.word) {
//         return request.get < ApiResponse < WordDataArray >> ("/corpus/mono/sort", {
//             params: {
//                 corpusId: wordsSearchParams.corpusId,
//                 pageSize: wordsSearchParams.pageSize,
//                 pageNumber: wordsSearchParams.pageNum,
//             },
//         });
//     } else {
//         return request.get < ApiResponse < WordData >> ('/corpus/mono/frequency', {
//             params: {
//                 keyword: wordsSearchParams.word,
//                 corpusId: wordsSearchParams.corpusId,
//             },
//         });
//     }
// };