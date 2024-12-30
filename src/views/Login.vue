<script setup>
    import { User, Lock } from '@element-plus/icons-vue';
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    const router = useRouter();
    //控制注册与登录表单的显示， 默认显示注册
    const isRegister = ref(false);
    //注册表单数据
    const loginData = ref({
        username: '',
        password: '',
        rePassword: '',
    });
    //清空表单信息函数
    const clearloginData = () => {
        loginData.value.username = '';
        loginData.value.password = '';
        loginData.value.rePassword = '';
    };
    const checkRePassword = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'));
        } else if (value !== loginData.value.password) {
            callback(new Error('两次输入的密码不一致'));
        } else {
            callback();
        }
    };
    //定义表单校验规则
    const rules = {
        username: [
            {
                required: true,
                message: '请输入用户名',
                trigger: 'blur',
            },
            { min: 5, max: 16, message: '5~16位非空字符', trigger: 'blur' },
        ],
        password: [
            {
                required: true,
                message: '请输入密码',
                trigger: 'blur',
            },
            { min: 5, max: 16, message: '5~16位非空字符', trigger: 'blur' },
        ],
        rePassword: [{ validator: checkRePassword, trigger: 'blur' }],
    };

    //注册
    // 调用接口
    import { userRegisterService, userLoginService } from '@/api/user.js';
    import { ElMessage } from 'element-plus';
    //定义注册数据
    const registerData = ref({
        id: null,
        username: null,
        password: null,
        role: null,
        createdAt: null,
        updatedAt: null,
    });
    //注册
    const register = async () => {
        registerData.value.username = loginData.value.username;
        registerData.value.password = loginData.value.password;
        let result = await userRegisterService(registerData.value);
        ElMessage.success('注册成功');
        // ElMessage.success(result.data.message ? result.data.message : '注册成功');
        clearloginData();
    };
    import { useTokenStore } from '@/stores/token.js';

    const tokenStore = useTokenStore();
    //登录
    const login = async () => {
        let result = await userLoginService({
            username: loginData.value.username,
            password: loginData.value.password,
        });
        ElMessage.success(result.data.message ? result.data.message : '登陆成功');

        // 使用 Pinia 存储 token
        tokenStore.setToken(result.data);
        // // 或者保存到 LocalStorage
        // console.log(token);
        // localStorage.setItem('token', token);

        router.push('/login/layout');
    };
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form
                ref="form"
                size="large"
                autocomplete="off"
                v-if="isRegister"
                :model="loginData"
                :rules="rules"
            >
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input
                        :prefix-icon="User"
                        placeholder="请输入用户名"
                        v-model="loginData.username"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="请输入密码"
                        v-model="loginData.password"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="请再次输入密码"
                        v-model="loginData.rePassword"
                    ></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button
                        class="button"
                        type="primary"
                        auto-insert-space
                        @click="register()"
                    >
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link
                        type="info"
                        :underline="false"
                        @click="
                            isRegister = false;
                            clearloginData();
                        "
                    >
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form
                ref="form"
                size="large"
                autocomplete="off"
                :model="loginData"
                :rules="rules"
                v-else
            >
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item>
                    <el-input
                        :prefix-icon="User"
                        name="username"
                        placeholder="请输入用户名"
                        v-model="loginData.username"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input
                        name="password"
                        :prefix-icon="Lock"
                        type="password"
                        placeholder="请输入密码"
                        v-model="loginData.password"
                        :model="isRegister"
                    ></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false"
                            >忘记密码？</el-link
                        >
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button
                        class="button"
                        type="primary"
                        auto-insert-space
                        @click="login()"
                        >登录</el-button
                    >
                </el-form-item>
                <el-form-item class="flex">
                    <el-link
                        type="info"
                        :underline="false"
                        @click="
                            isRegister = true;
                            clearloginData();
                        "
                    >
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
    /* 样式 */
    .login-page {
        height: 100vh;
        background-color: #fff;

        .bg {
            background: url('@/assets/english.jpg') no-repeat center / cover;
            border-radius: 0 20px 20px 0;
        }

        .form {
            display: flex;
            flex-direction: column;
            justify-content: center;
            user-select: none;

            .title {
                margin: 0 auto;
            }

            .button {
                width: 100%;
            }

            .flex {
                width: 100%;
                display: flex;
                justify-content: space-between;
            }
        }
    }
</style>