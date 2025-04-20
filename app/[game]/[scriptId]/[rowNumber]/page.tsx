import { type Game, getRow, getScript, toGameId } from "@/app/lib/trails-db";
import { notFound, redirect } from "next/navigation";
import { ScriptText } from "./script-text";
import { getProgress } from "@/app/lib/progress";
import { sql } from "@/app/lib/sql";
import { SaveButton } from "./save-button";
import { sb } from "@/app/lib/supabase";
import { profile } from "@/app/lib/utils";

function unique<T>(arr: T[], key: keyof T): T[] {
  return arr.filter(
    (v, i, self) => self.findIndex((t) => t[key] === v[key]) === i,
  );
}

async function getSavedWords(ids: string[]) {
  const savedWords = await sql<{ word_id: string }[]>`
    select word_id
    from saved
    where word_id = any(${sql.array(ids)})
  `;
  return new Set(savedWords.map((w) => w.word_id));
}

export default async function ScriptPage({
  params,
}: {
  params: Promise<{ game: string; scriptId: string; rowNumber: string }>;
}) {
  const realParams = await params;
  const currentRow = Number.parseInt(realParams.rowNumber);

  const script = await getScript({
    gameId: toGameId(realParams.game),
    scriptId: realParams.scriptId,
  });
  if (!script) notFound();

  const row = await getRow({
    game: realParams.game as Game,
    scriptId: realParams.scriptId,
    rowNumber: currentRow,
  });
  if (!row) notFound();

  const [progress, savedWords] = await Promise.all([
    getProgress({
      gameId: toGameId(realParams.game),
      scriptId: realParams.scriptId,
    }),
    getSavedWords(row.translation.map((t) => t.id)),
  ]);
  const isCompleted = progress.includes(currentRow);

  return (
    <>
      <main className="grid grid-rows-[2fr_1fr] divide-y divide-neutral-500 max-h-[calc(100vh-theme(spacing.12)-theme(spacing.2)-44px)]">
        <ScriptText
          row={row}
          isCompleted={isCompleted}
          completeRow={async () => {
            "use server";
            await profile("complete row", () => {
              return sb.from("progress").insert({
                game_id: toGameId(realParams.game),
                script_id: realParams.scriptId,
                row_number: currentRow,
              });
            });
            const isLastRow = currentRow === script.length;
            if (isLastRow) {
              redirect(`/${realParams.game}`);
            } else {
              redirect(
                `/${realParams.game}/${realParams.scriptId}/${currentRow + 1}`,
              );
            }
          }}
        />
        <div className="grid grid-cols-2 divide-x divide-neutral-500">
          <div className="flex flex-col">
            <header className="p-2 border-b border-neutral-500">
              <h3 className="text-sm lowercase">Vocabulary</h3>
            </header>
            <ul className="divide-y divide-neutral-500 overflow-y-auto max-h-[500px] px-2 py-1">
              {unique(row.translation, "id").map((translation) => {
                const isSaved = savedWords.has(translation.id);
                return (
                  <li
                    className="flex items-baseline py-1 gap-x-2"
                    key={translation.id}
                  >
                    <div className="flex gap-2">
                      <p className="font-jp shrink-0">{translation.word}</p>
                      <p className="font-jp text-neutral-500 shrink-0">
                        {translation.reading}
                      </p>
                    </div>
                    <p className="text-sm ml-auto text-right min-w-0">
                      {translation.meaning}
                    </p>
                    <SaveButton wordId={translation.id} disabled={isSaved}>
                      {isSaved ? "saved" : "save"}
                    </SaveButton>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex flex-col">
            <header className="p-2 border-b border-neutral-500">
              <h3 className="text-sm lowercase">notes</h3>
            </header>
            <textarea
              className="p-2 text-sm w-full h-full focus-visible:outline-none"
              placeholder="your thoughts here..."
            />
          </div>
        </div>
      </main>
    </>
  );
}
