"use server";

import { sql } from "../lib/sql";
import { fromGameId } from "../lib/trails-db";
import type { Example } from "./types";

export async function getExamples(id: string): Promise<Example[]> {
  const response =
    await sql`select * from examples inner join sentences on examples.sentence_id = sentences.id where word_id = ${id}`;
  return response.slice(0, 3).map((r) => {
    const parts = r.row_blob.jpnSearchText.split(r.literal);
    return {
      id: r.sentence_id,
      offset: Number(r.offset),
      literal: r.literal,
      href: `/${fromGameId(String(r.row_blob.gameId))}/${r.row_blob.fname}/${r.row_blob.row}`,
      en: {
        text: r.row_blob.engSearchText,
        character: r.row_blob.engChrName,
      },
      jp: {
        text: r.row_blob.jpnSearchText.replaceAll("<br/>", ""),
        character: r.row_blob.jpnChrName,
      },
      translation: r.translation_blob,
      parts: [
        parts[0]
          ? {
              type: "text",
              text: parts[0].replaceAll("<br/>", ""),
            }
          : undefined,
        {
          type: "word",
          text: r.literal,
        },
        parts[1]
          ? {
              type: "text",
              text: parts[1].replaceAll("<br/>", ""),
            }
          : undefined,
      ].filter(Boolean) as { type: "text" | "word"; text: string }[],
    };
  });
}
