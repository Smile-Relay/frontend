export const useVocabularies = async () => {
    return await $fetch<never>('http://localhost:5001/vocabularies') as Vocabularies
}
export type Vocabularies = {
    adjectives: string[],
    nouns: string[]
}