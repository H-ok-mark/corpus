import request from "@/utils/request.js"

export const userRegisterService = (registerData) => {
    //借助UrlSearchParams
    const params = new URLSearchParams()
    for (let key in registerData) {
        params.append(key, registerData[key]);
    }
    return request.post('user/register', params)
}