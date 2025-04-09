import {
  type JpdbResponse,
  responseSchema,
  type Token,
  type Vocabulary,
} from "./types";
import { isKanji } from "wanakana";

const API_BASE_URL = "https://jpdb.io/api/v1";

interface ParseTextResponse {
  text: string;
  vocabulary: Record<string, Vocabulary>;
  tokens: Token[];
}

const cache = new Map<string, ParseTextResponse>();

export async function parseText(text: string): Promise<ParseTextResponse> {
  const cached = cache.get(text);
  if (cached) return cached;
  const response = await fetch(`${API_BASE_URL}/parse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.JPDB_API_TOKEN}`,
    },
    body: JSON.stringify({
      text,
      token_fields: ["vocabulary_index", "position", "length", "furigana"],
      position_length_encoding: "utf16",
      vocabulary_fields: [
        "vid",
        "sid",
        "spelling",
        "reading",
        "frequency_rank",
        "meanings",
        "part_of_speech",
      ],
    }),
  });
  const data = await response.json();
  const parsed = parseResponse(text, responseSchema.parse(data));
  cache.set(text, parsed);
  return parsed;
}

export function parseResponse(
  originalText: string,
  response: JpdbResponse,
): ParseTextResponse {
  const vocabulary: Record<string, Vocabulary> = {};
  const tokens: Token[] = [];

  function parseToken(token: JpdbResponse["tokens"][number]): {
    token: Token;
    vocabulary: Vocabulary | null;
  } {
    const [vocabIndex, position, length, furigana] = token;
    const literal = originalText.slice(position, position + length);
    const literalReading = furigana
      ? furigana.map((f) => {
          return typeof f === "string"
            ? {
                text: f,
                reading: null,
              }
            : {
                text: f[0],
                reading: f[1],
              };
        })
      : [
          {
            text: literal,
            reading: null,
          },
        ];

    const vocabulary = parseVocabulary(response.vocabulary[vocabIndex], {
      literalReading,
    });
    if (vocabulary.partsOfSpeech.includes("prt")) {
      return {
        token: {
          type: "text",
          text: literal,
        },
        vocabulary: null,
      };
    }
    const [id, sid] = vocabulary.jpdbId;
    const serializedId = `${id}:${sid}`;
    return {
      token: {
        type: "vocabulary",
        id: serializedId,
        literal,
        dictionary: vocabulary.dictionary,
        reading: literalReading,
        offset: position,
      },
      vocabulary,
    };
  }

  function parseVocabulary(
    vocabulary: JpdbResponse["vocabulary"][number],
    { literalReading }: { literalReading: Vocabulary["reading"] },
  ): Vocabulary {
    const [id, sid, spelling, _, frequencyRank, meanings, partsOfSpeech] =
      vocabulary;

    const readings = [];
    const word = [...spelling];
    let i = 0;
    while (i < word.length) {
      const char = word[i];
      if (isKanji(char)) {
        // look for the reading in `literalReading`
        const reading = literalReading.find((r) => r.text === char);
        if (reading) readings.push(reading);
        i++;
      } else {
        // collect all consecutive non-kanji characters
        const nonKanji = [];
        while (i < word.length && !isKanji(word[i])) {
          nonKanji.push(word[i]);
          i++;
        }
        if (nonKanji.length > 0) {
          readings.push({ text: nonKanji.join(""), reading: null });
        }
      }
    }

    return {
      jpdbId: [id, sid],
      dictionary: spelling,
      reading: readings,
      meanings,
      ranking: frequencyRank,
      partsOfSpeech,
    };
  }

  for (const token of response.tokens) {
    const parseResult = parseToken(token);
    tokens.push(parseResult.token);
    if (parseResult.token.type === "vocabulary" && parseResult.vocabulary) {
      vocabulary[parseResult.token.id] = parseResult.vocabulary;
    }
  }

  return {
    text: originalText,
    vocabulary,
    tokens,
  };
}
