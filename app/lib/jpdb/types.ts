import { z } from "zod";

export const responseSchema = z.object({
  tokens: z.array(
    z.tuple([
      z.number(),
      z.number(),
      z.number(),
      z
        .array(z.union([z.tuple([z.string(), z.string()]), z.string()]))
        .nullable(),
    ]),
  ),
  vocabulary: z.array(
    z.tuple([
      z.number(),
      z.number(),
      z.string(),
      z.string(),
      z.number(),
      z.array(z.string()),
      z.array(z.string()),
    ]),
  ),
});

export type JpdbResponse = z.infer<typeof responseSchema>;

export interface Vocabulary {
  jpdbId: [number, number];
  dictionary: string;
  reading: Array<{ text: string; reading: string | null }>;
  meanings: string[];
  ranking: number;
  partsOfSpeech: string[];
}

export interface VocabularyToken {
  type: "vocabulary";
  id: string;
  literal: string;
  dictionary: string;
  reading: Array<{ text: string; reading: string | null }>;
  offset: number;
}

export interface TextToken {
  type: "text";
  text: string;
}

export type Token = VocabularyToken | TextToken;