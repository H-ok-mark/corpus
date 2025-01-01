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

// //添加响应拦截器
// instance.interceptors.response.use(
//     result => {
//         //判断业务状态码
//         if (result.data.code === 0) {
//             return result.data;
//         }
//         //操作失败
//         ElMessage.error(result.data.message ? result.data.message : "服务异常")
//         //异步操作的状态转换为失败
//         return Promise.reject(result.data)
//     },
//     err => {
//         //如果响应状态码为401，代表未登录，给出对应提示，并跳转到登录页面
//         if (err.response.status === 401) {
//             ElMessage.error("请先登录!")
//             router.push("/login")
//         }
//         ElMessage.error(result.data.message ? result.data.message : "服务异常")
//         return Promise.reject(err);//异步的状态转化成失败的状态
//     }
// )

instance.interceptors.response.use(
    response => {
        const data = response.data;

        if (data.code === 0) {
            return data.data;
        } else if (data.status === 200 && data.body) {
            return data.body;
        } else if (response.status === 200 && typeof data === "object") {
            return data;
        }

        ElMessage.error(data.message || "服务异常");
        return Promise.reject(data);
    },
    error => {
        if (error.response && error.response.status === 401) {
            const tokenStore = useTokenStore();

            if (tokenStore.token) {
                // Token 已过期
                ElMessage.error("登录已过期，请重新登录！");
                tokenStore.clearToken();
            } else {
                // 未登录
                ElMessage.error("请先登录！");
            }

            // 记录当前路径，跳转到登录页面
            const currentPath = router.currentRoute.value.fullPath;
            router.push({ path: "/login", query: { redirect: currentPath } });
        } else {
            ElMessage.error(error.response?.data?.message || "服务异常");
        }
        return Promise.reject(error);
    }
);


export default instance;


