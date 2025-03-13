import request from '@/utils/request'
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
// 单文档对齐 - 参数作为URL查询参数发送
export const singleAlignmentService = (corpusId) => {
    // 处理可能存在的值引用
    const corpusIdValue = corpusId?.value !== undefined ? corpusId.value : corpusId;

    // 使用 params 对象将参数作为URL查询参数发送
    return request.post("/corpus/bilingual/align/single", null, {
        params: {
            srcId: corpusIdValue
        }
    });
}

// 双文档对齐 - 参数作为URL查询参数发送
export const doubleAlignmentService = (srcId, tgtId) => {
    // 处理可能存在的值引用
    const srcIdValue = srcId?.value !== undefined ? srcId.value : srcId;
    const tgtIdValue = tgtId?.value !== undefined ? tgtId.value : tgtId;

    // 使用 params 对象将参数作为URL查询参数发送
    return request.post("/corpus/bilingual/align/double", null, {
        params: {
            srcId: srcIdValue,
            tgtId: tgtIdValue
        }
    });
}
// 段落对齐结果查询 - 修改为使用URL参数
export const alignParagraphService = (srcId, tgtId) => {
    // 处理可能存在的值引用
    const srcIdValue = srcId?.value !== undefined ? srcId.value : srcId;
    const tgtIdValue = tgtId?.value !== undefined ? tgtId.value : tgtId;

    // 使用 params 对象将参数作为URL查询参数发送
    return request.post("/corpus/bilingual/paragraph", null, {
        params: {
            srcId: srcIdValue,
            tgtId: tgtIdValue,
        }
    });
}

// 句对齐结果查询 - 同样修改
export const alignSentenceService = (srcId, tgtId) => {
    // 处理可能存在的值引用
    const srcIdValue = srcId?.value !== undefined ? srcId.value : srcId;
    const tgtIdValue = tgtId?.value !== undefined ? tgtId.value : tgtId;

    return request.post("/corpus/bilingual/sentence", null, {
        params: {
            srcId: srcIdValue,
            tgtId: tgtIdValue,

        }
    });
}

// 多译本策略对齐
export const getContextAnalysisService = (contextAnalysisData) => {
    // 处理数组参数 - 将数组转换为逗号分隔的字符串
    const tgtCorpusIdString = Array.isArray(contextAnalysisData.tgtCorpusId)
        ? contextAnalysisData.tgtCorpusId.join(',')
        : contextAnalysisData.tgtCorpusId;

    return request.post("/corpus/analysis/context", null, {
        params: {
            srcSentence: contextAnalysisData.srcSentence,
            srcCorpusId: contextAnalysisData.srcCorpusId,
            tgtCorpusId: tgtCorpusIdString,  // 使用逗号分隔的字符串
            pageNum: contextAnalysisData.pageNum,
            pageSize: contextAnalysisData.pageSize
        }
    });
}


