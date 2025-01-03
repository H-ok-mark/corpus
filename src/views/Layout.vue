<script setup>
    import {
        Management,
        Promotion,
        UserFilled,
        User,
        Crop,
        EditPen,
        SwitchButton,
        CaretBottom,
        House,
        Operation,
        ZoomOut,
        Search,
        Notebook,
        Compass,
    } from '@element-plus/icons-vue';
    import avatar from '@/assets/default.png';
    import { useRouter } from 'vue-router';
    // import { useTokenStore } from '@/stores/token';
    const router = useRouter();
    const handleCommand = command => {
        if (command === 'logout') {
            // TODO: 清除登录状态
            // useTokenStore.removeToken();
            router.push('/login');
        }
        if (command === 'user-corpus') {
            router.push('/corpus/users');
        }
    };
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu
                active-text-color="#ffd04b"
                background-color="#232323"
                text-color="#fff"
                router
            >
                <el-menu-item index="/welcome">
                    <el-icon>
                        <House />
                    </el-icon>
                    <span>首页</span>
                </el-menu-item>

                <el-menu-item index="/double-corpus/translation">
                    <el-icon>
                        <EditPen />
                    </el-icon>
                    <span>语料对齐</span>
                </el-menu-item>

                <el-menu-item index="/signal-corpus/words">
                    <el-icon>
                        <Search />
                    </el-icon>
                    <span>词频统计</span>
                </el-menu-item>

                <el-menu-item index="/signal-corpus/kwic">
                    <el-icon>
                        <Operation />
                    </el-icon>
                    <span>上下文关键字</span>
                </el-menu-item>

                <el-sub-menu>
                    <template #title>
                        <el-icon>
                            <Notebook />
                        </el-icon>
                        <span>语料库管理</span>
                    </template>

                    <el-menu-item index="/corpus/users">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>我的语料库</span>
                    </el-menu-item>

                    <el-menu-item index="/corpus/list" id="corpusList">
                        <el-icon>
                            <Compass />
                        </el-icon>
                        <span>获取语料库</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>
                    <strong> </strong>
                </div>
                <!-- 头像区域 -->
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item
                                command="user-corpus"
                                :icon="Notebook"
                                >语料库</el-dropdown-item
                            >
                            <el-dropdown-item
                                command="logout"
                                :icon="SwitchButton"
                                >退出登录</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <!-- <div
                    style="width: 1290px; height: 570px; border: 1px solid red"
                >
                    内容展示区
                </div> -->
                <router-view />
            </el-main>
            <!-- 底部区域 -->
            <el-footer>©Corpus+ 语料库智能应用平台</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
    .layout-container {
        height: 100vh;

        .el-aside {
            background-color: #232323;

            &__logo {
                height: 100px;
                background: url('@/assets/corpus+2.0.png') no-repeat center / 240px
                    auto;
            }

            .el-menu {
                border-right: none;
            }
        }

        .el-header {
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .el-dropdown__box {
                display: flex;
                align-items: center;

                .el-icon {
                    color: #999;
                    margin-left: 10px;
                }

                &:active,
                &:focus {
                    outline: none;
                }
            }
        }

        .el-footer {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666;
        }
    }
</style>