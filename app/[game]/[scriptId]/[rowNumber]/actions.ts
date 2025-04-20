"use server";

import { sql } from "@/app/lib/sql";
import { profile } from "@/app/lib/utils";

export async function saveWord(wordId: string) {
  await profile(`save word: ${wordId}`, () => {
    return sql`
    insert into saved (word_id)
    values (${wordId})
  `;
  });
}
