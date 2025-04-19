"use server";

import { isKanji } from "wanakana";
import { type KanjiEntry, searchForKanji } from "../lib/kanji";

export async function getKanji(word: string) {
  const chars = [...word].filter(isKanji);
  if (!chars.length) return [];
  const kanji = await Promise.all(chars.map(searchForKanji));
  return kanji.filter(Boolean) as KanjiEntry[];
}
