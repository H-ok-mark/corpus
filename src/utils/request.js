//定制请求的实例

//导入axios  npm install axios
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
const baseURL = '/api';

const instance = axios.create({ baseURL })

import { useTokenStore } from '@/stores/token.js';
// 添加请求拦截器
instance.interceptors.request.use((config) => {
    let tokenStore = useTokenStore();
    if (tokenStore.token) {
        config.headers.Authorization = tokenStore.token;
    }
    return config
},
    (error) => {
        //请求失败的处理
        Promise.reject(error)
    }
)

//添加响应拦截器
instance.interceptors.response.use(
    result => {
        //判断业务状态码
        if (result.data.code === 0) {
            return result.data;
        }
        //操作失败
        ElMessage.error(result.data.message ? result.data.message : "服务异常")
        //异步操作的状态转换为失败
        return Promise.reject(result.data)
    },
    err => {
        //如果响应状态码为401，代表未登录，给出对应提示，并跳转到登录页面
        if (err.response.status === 401) {
            ElMessage.error("请先登录!")
            router.push("/login")
        }
        ElMessage.error(result.data.message ? result.data.message : "服务异常")
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;


// /**
//  *  @function 根据任务的提示词taskPromt,及对应需要注入的参数params，来调用LLMs推理服务。
//  *  @taskPrompt 任务对应的提示工程
//  *  @params  提示工程中的参数
//  *  @LLMResponse 返回的结果对象
//  **/
 
// public LLMResponse<T> llmCall(String taskPrompt, Map<String, Object> params) {   
//     var outputParser = new BeanOutputParser<>(LLMResponse.class);
//     PromptTemplate promptTemplate = new PromptTemplate(taskPrompt, params);
//     Prompt prompt = promptTemplate.create();
//     Generation generation = chatClient.call(prompt).getResult();
//     return outputParser.parse(generation.getOutput().getContent());
// }
// // 输入参数：  
// // ```java
// String keyword = "get"; // 要分析的关键词
// List<String> paragraphs = List.of(
//     "That is for your impudence in answering mama awhile since...",
//     "Neither Bessie nor any one else will go into it at night...",
//     "In the interview which followed between him and Mrs. Reed...",
//     "I was making my bed, having received strict orders from Bessie...",
//     "I covered my head and arms with the skirt of my frock...",
//     "At last the guard returned; once more I was stowed away in the coach...",
//     "The indefatigable bell now sounded for the fourth time...",
//     "I rang the bell, for I wanted a candle...",
//     "Besides, since happiness is irrevocably denied me, I have a right to get pleasure out of life...",
//     "Next day commenced as before, getting up and dressing by rushlight...",
//     "I have just opened the window, to let in a little air and sunshine...",
//     "How long shall we be before we get there?",
//     "'Try to get hold of my horse's bridle and lead him to me: you are not afraid?'",
//     "I knew you would be: you will get on whether your relations notice you or not.",
//     "Indeed: but I have long wanted to see you, and when I heard..."
// );

// // 设置任务提示词模板和参数
// String taskPrompt = "现在需要对英语中给定单词(<keyword>)在不同场景中的词性和语义进行分类归纳。给定的输入为如下格式：...";
// Map<String, Object> params = Map.of(
//     "keyword", keyword,
//     "paragraphs", paragraphs
// );

// // 调用AI分析
// LLMResponse<SemanticAnalysisResult> response = llmCall(taskPrompt, params);

// // 输出结果
// response.getResults().forEach(System.out::println);

