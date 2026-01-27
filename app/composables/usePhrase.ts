import { vocabularies } from "~/composables/useVocabularies";

type Phrase = `${typeof vocabularies.adjectives[number]}${typeof vocabularies.nouns[number]}`;

type HexChar =
    | "0" | "1" | "2" | "3"
    | "4" | "5" | "6" | "7"
    | "8" | "9" | "a" | "b"
    | "c" | "d" | "e" | "f" ;

type ID = `${HexChar}${HexChar}`;


export const usePhrase = (id: ID) => {
    if (!id) throw new Error("id is required");
    if (id.length !== 2) throw new Error("id is required");
    if (!id[0]) throw new Error("id is required");
    if (!id[1]) throw new Error("id is required");
    const first = parseInt(id[0], 16);
    const last = parseInt(id[1], 16);
    return `${vocabularies.adjectives[first]}${vocabularies.nouns[last]}` as Phrase;
}