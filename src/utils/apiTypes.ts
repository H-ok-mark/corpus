// apiTypes.ts

// 通用响应类型
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
    total: number;
}

// 词频统计接口的数据结构（返回数组）
export interface WordData {
    word: string;
    frequency: string;
    range: string;
}
export type WordDataArray = WordData[];

// KWIC接口的数据结构（返回数组）
export interface KWICData {
    context: string;
    leftContext: Array<string>;
    keyword: string;
    rightContext: Array<string>;
}