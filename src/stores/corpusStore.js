import { defineStore } from 'pinia';

export const useCorpusStore = defineStore('corpus', {
    state: () => ({
        appliedCorpusId: null,
        appliedCorpusName: '',
    }),
    actions: {
        setCurrentCorpus(corpus) {
            if (this.appliedCorpusId && this.appliedCorpusId !== corpus.id) {
                console.warn('已有其他语料库在应用，将替换为新的语料库');
            }
            this.appliedCorpusId = corpus.id;
            this.appliedCorpusName = corpus.name;

        },
        clearCurrentCorpus() {
            this.appliedCorpusId = null;
            this.appliedCorpusName = '';
        },
    },
});