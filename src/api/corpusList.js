import request from "@/utils/request"

//语料库列表查询
export const corpusListService = () => {
    return request.get("/corpus/list")
}