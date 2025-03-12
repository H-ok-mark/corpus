import { createRouter, createWebHistory } from 'vue-router';

import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
import UserCorpusVue from "@/views/corpus/UserCorpus.vue";
import CorpusListVue from "@/views/corpus/CorpusList.vue";
import TranslationVue from "@/views/double_corpus/Translation.vue";
import KwicVue from "@/views/single_corpus/KWIC/KWIC.vue";
import WordsVue from "@/views/single_corpus/Words/Words.vue";
import Welcomevue from "@/views/Welcome.vue";
import TestVue from "@/views/double_corpus/Test.vue";




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
            { path: "/double-corpus/test", component: TestVue },
        ]

    },

]

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;