import { createRouter, createWebHistory } from 'vue-router';

import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
import UserCorpusVue from "@/views/corpus/UserCorpus.vue";
import CorpusListVue from "@/views/corpus/CorpusList.vue";
import TranslationVue from "@/views/double_corpus/Translation.vue";
import KwicVue from "@/views/single_corpus/KWIC/KWIC.vue";
import WordsVue from "@/views/single_corpus/Words/Words.vue";
import Welcomevue from "@/views/Welcome.vue"
//测试界面
import elPagination from '@/views/test_demo/el-pagination.vue';
import searchPag from '@/views/test_demo/search-pag.vue';




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
            //测试界面
            { path: "/el-pagination", component: elPagination },
            { path: "/search-page", component: searchPag },



        ]

    },

]

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;