//定制请求的实例

//导入axios  npm install axios
import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus';
const baseURL = '/api';

const instance = axios.create({ baseURL })

// import { useTokenStore } from '@/stores/token';
// //添加请求拦截器
// instance.interceptors.request.use(
//     (config) => {
//         //请求前的回调
//         //添加token
//         const tokenStore = useTokenStore();
//         //判断有没有token
//         if (tokenStore.token) {
//             config.headers.Authorization = tokenStore.token
//         }
//         return config;
//     },
//     (err) => {
//         //请求错误的回调
//         Promise.reject(err)
//     }
// )

//添加响应拦截器
instance.interceptors.response.use(
    result => {
        //判断业务状态码
        if (result.data.code === 0) {
            return result.data;
        }
        //操作失败
        ElMessage.error(result.data.msg ? result.data.message : "服务异常")
        //异步操作的状态转换为失败
        return Promise.reject(result.data)
    },
    err => {
        //如果响应状态码为401，代表未登录，给出对应提示，并跳转到登录页面
        if (err.response.status === 401) {
            ElMessage.error("请先登录!")
            router.push("/login")
        }
        ElMessage.error(result.data.msg ? result.data.message : "服务异常")
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;