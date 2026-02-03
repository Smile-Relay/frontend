import { useVocabularies } from "~/composables/useVocabularies";

export const usePhrase = () => {
  const { adjectives, nouns } = useVocabularies();

  return (id: string) => {
    if (!id) throw new Error("id is required");
    if (id.length !== 2) throw new Error("id is required");
    if (!id[0]) throw new Error("id is required");
    if (!id[1]) throw new Error("id is required");

    const first = parseInt(id[0], 16);
    const last = parseInt(id[1], 16);

    const adj = adjectives.value[first];
    const noun = nouns.value[last];
    if (!adj || !noun) return id;

    return `${adj}${noun}`;
  };
}
