import { useVocabularies } from "~/composables/useVocabularies";
const vocabularies = await useVocabularies();
export const usePhrase = (id: string) => {
    if (!id) throw new Error("id is required");
    if (id.length !== 2) throw new Error("id is required");
    if (!id[0]) throw new Error("id is required");
    if (!id[1]) throw new Error("id is required");
    const first = parseInt(id[0], 16);
    const last = parseInt(id[1], 16);
    return `${vocabularies.adjectives[first]}${vocabularies.nouns[last]}`;
}