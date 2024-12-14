import { createRouter, createWebHistory } from 'vue-router';

import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
// import ArticleCategoryVue from '@/views/article/ArticleCategory.vue';
// import ArticleManageVue from '@/views/article/ArticleManage.vue';
// import ArticleTestVue from '@/views/article/ArticleTest.vue';
// import UserAvatarVue from '@/views/user/UserAvatar.vue';
// import UserInfoVue from '@/views/user/UserInfo.vue';
// import UserResetPasswordVue from '@/views/user/UserResetPassword.vue';

import UserCorpusVue from "@/views/corpus/UserCorpus.vue";
import CorpusListVue from "@/views/corpus/CorpusList.vue";
import TranslationVue from "@/views/double_corpus/Translation.vue";
import KwicVue from "@/views/single_corpus/KWIC/Kwic.vue";
import WordsVue from "@/views/single_corpus/Words/Words.vue";
import Welcomevue from "@/views/welcome.vue"





// Define the routes for the application
const routes = [
    { path: "/", component: LoginVue },
    { path: "/login", component: LoginVue },
    {
        path: "/login/layout", component: LayoutVue,
        //重定向
        redirect: "/welcome",
        // 子路由
        //仅实现大模块
        children: [
            { path: "/welcome", component: Welcomevue },
            { path: "/signal-corpus/kwic", component: KwicVue },
            { path: "/signal-corpus/words", component: WordsVue },
            { path: "/double-corpus/translation", component: TranslationVue },
            { path: "/corpus/list", component: CorpusListVue },
            { path: "/corpus/users", component: UserCorpusVue },

        ]

    },

]

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;