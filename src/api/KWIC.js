import request from "@/utils/request.js"

export const kwicService = (kwicData) => {
    console.log({
        file: kwicData.file,
        word: kwicData.word,
        leftpart: kwicData.leftPart,
        rightpart: kwicData.rightPart,
        pageNum: kwicData.pageNum,
        pageSize: kwicData.pageSize,
    });

    return request.post('/corpus/mono/kwic', {
        file: kwicData.file,
        word: kwicData.word,
        leftpart: kwicData.leftPart,
        rightpart: kwicData.rightPart,
        pageNum: kwicData.pageNum,
        pageSize: kwicData.pageSize,
    })
}
// 词汇用法总结
export const vocabUsageService = (wordParam) => {
    const keyword = typeof wordParam === 'object' && wordParam !== null
        ? (wordParam.value || wordParam.word || '')
        : wordParam;

    console.log('发送的搜索词:', keyword);

    // 创建URLSearchParams对象，用于构建请求参数
    const params = new URLSearchParams();
    params.append('keyword', keyword);

    // 发送post请求
    return request.post('/corpus/mono/usage', params);
}

// 句法结构分析
export const syntaxPatternsService = (kwicData, structure) => {
    console.log({
        file: kwicData.file,
        word: kwicData.word,
        leftpart: kwicData.leftPart,
        rightpart: kwicData.rightPart,
        pageNum: kwicData.pageNum,
        pageSize: kwicData.pageSize,
        structure: structure
    });

    return request.post('/corpus/mono/syntax', {
        file: kwicData.file,
        word: kwicData.word,
        leftpart: kwicData.leftPart,
        rightpart: kwicData.rightPart,
        pageNum: kwicData.pageNum,
        pageSize: kwicData.pageSize,
        structure: structure
    })
}

//词义分析
export const semanticAnalysisService = (kwicData, meaning) => {
    console.log({
        file: kwicData.file,
        word: kwicData.word,
        leftpart: kwicData.leftPart,
        rightpart: kwicData.rightPart,
        pageNum: kwicData.pageNum,
        pageSize: kwicData.pageSize,
        meaning: meaning
    });

    return request.post('/corpus/mono/meaning', {
        file: kwicData.file,
        word: kwicData.word,
        leftpart: kwicData.leftPart,
        rightpart: kwicData.rightPart,
        pageNum: kwicData.pageNum,
        pageSize: kwicData.pageSize,
        meaning: meaning
    })
}

