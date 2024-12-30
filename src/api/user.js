import request from "@/utils/request.js"
//登录
export const userLoginService = (registerData) => {
    return request.post('/users/login', null, {
        params: {
            username: registerData.username,
            password: registerData.password,
        },
    });
};
//注册
export const userRegisterService = (registerData) => {

    return request.post('/users', {
        id: registerData.id,
        username: registerData.username,
        password: registerData.password,
        role: registerData.role,
        createdAt: registerData.createdAt,
        updatedAt: registerData.updatedAt,
    })
}
