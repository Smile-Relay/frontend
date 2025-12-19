export const useVocabularies = async () => {
    return await $fetch('http://localhost:5001/vocabularies')
}