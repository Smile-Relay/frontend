import { computed } from "vue";

export const useVocabularies = () => {
  const { tm, rt } = useI18n();
  const tmAny = tm as (key: string) => unknown;

  const adjectives = computed<string[]>(() => {
    const list = tmAny("search.adjectives");
    return Array.isArray(list) ? list.map((item) => rt(item)) : [];
  });

  const nouns = computed<string[]>(() => {
    const list = tmAny("search.nouns");
    return Array.isArray(list) ? list.map((item) => rt(item)) : [];
  });

  return {
    adjectives,
    nouns,
  };
};
