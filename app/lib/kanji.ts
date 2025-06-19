import jisho from "./jisho";
import type { KanjiParseResult } from "./jisho.types";
import { profile } from "./utils";

export interface KanjiEntry {
  text: string;
  meanings: string[];
  kunyomi: string[];
  onyomi: string[];
  frequencyRank: number;
  jlptLevel: "N5" | "N4" | "N3" | "N2" | "N1";
}

export const searchForKanji = async (
  text: string,
): Promise<KanjiEntry | null> => {
  const result = (await profile("get jisho", () =>
    jisho.searchForKanji(text),
  )) as KanjiParseResult;
  if (!result.found) return null;
  const parsed = {
    text,
    meanings: result.meaning.split(", "),
    kunyomi: result.kunyomi,
    onyomi: result.onyomi,
    frequencyRank: Number(result.newspaperFrequencyRank),
    jlptLevel: result.jlptLevel as KanjiEntry["jlptLevel"],
  };
  return parsed;
};
