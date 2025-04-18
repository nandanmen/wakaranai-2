import type { Vocabulary } from "../lib/jpdb/types";
import { sql } from "../lib/sql";
import clsx from "clsx";
import { profile } from "../lib/utils";
import { WordItem } from "./word-item";

export default async function WordsPage() {
  const words = await profile(
    "get saved words",
    () => sql<
      {
        id: string;
        proficiency: string;
        word: string;
        metadata: Vocabulary;
      }[]
    >`
  select * from saved
  inner join dictionary on saved.word_id = dictionary.id
  where user_id = 'nanda.s@hey.com'
`,
  );
  return (
    <div className="bg-white border border-neutral-500 relative">
      <ul className="grid grid-cols-3">
        {words.map((word, i) => {
          const isMultipleOfThree = (i + 1) % 3 === 0;
          const isLastThree = i >= words.length - 3;
          return (
            <li
              className={clsx(
                !isMultipleOfThree && "border-r",
                !isLastThree && "border-b",
              )}
              key={word.id}
            >
              <WordItem word={word} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
