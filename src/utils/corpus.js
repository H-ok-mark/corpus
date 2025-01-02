import { defineStore } from 'pinia'

export const useCorpusStore = defineStore('corpus', {
    state: () => ({
        appliedCorpusId: null,
        appliedCorpusName: ''
    }),

    actions: {
        setAppliedCorpus(id, name) {
            this.appliedCorpusId = id
            this.appliedCorpusName = name
        },
        clearAppliedCorpus() {
            this.appliedCorpusId = null
            this.appliedCorpusName = ''
        }
    },

    persist: true
})