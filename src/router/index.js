import { createRouter, createWebHistory } from 'vue-router';

import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
import UserCorpusVue from "@/views/corpus/UserCorpus.vue";
import CorpusListVue from "@/views/corpus/CorpusList.vue";
import TranslationVue from "@/views/double_corpus/Translation.vue";
import KwicVue from "@/views/single_corpus/KWIC/KWIC.vue";
import WordsVue from "@/views/single_corpus/Words/Words.vue";
import Welcomevue from "@/views/Welcome.vue";




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

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;