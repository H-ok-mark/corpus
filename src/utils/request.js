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
        // 如果是 blob 类型的响应，则返回完整的 result 对象，否则处理业务状态码
        if (result.config.responseType === 'blob') {
            return result;
        }
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
        if (err.response && err.response.status === 401) {
            ElMessage.error("请先登录!")
            router.push("/login")
        }
        const errorMsg = err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "服务异常";
        ElMessage.error(errorMsg);
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;
