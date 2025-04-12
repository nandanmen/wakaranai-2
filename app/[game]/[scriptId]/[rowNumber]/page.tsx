import { type Game, getRow, toGameId } from "@/app/lib/trails-db";
import { notFound } from "next/navigation";
import { ScriptText } from "./script-text";
import { getProgress } from "@/app/lib/progress";

function unique<T>(arr: T[], key: keyof T): T[] {
  return arr.filter(
    (v, i, self) => self.findIndex((t) => t[key] === v[key]) === i,
  );
}

export default async function ScriptPage({
  params,
}: {
  params: Promise<{ game: string; scriptId: string; rowNumber: string }>;
}) {
  const realParams = await params;
  const currentRow = Number.parseInt(realParams.rowNumber);
  const row = await getRow({
    game: realParams.game as Game,
    scriptId: realParams.scriptId,
    rowNumber: currentRow,
  });
  if (!row) notFound();

  const progress = await getProgress({
    gameId: toGameId(realParams.game),
    scriptId: realParams.scriptId,
  });
  const isCompleted = progress.includes(currentRow);

  return (
    <>
      <main className="grid grid-rows-[2fr_1fr] divide-y divide-neutral-500 max-h-[calc(100vh-theme(spacing.12)-theme(spacing.2)-44px)]">
        <ScriptText row={row} isCompleted={isCompleted} />
        <div className="grid grid-cols-2 divide-x divide-neutral-500">
          <div className="flex flex-col">
            <header className="p-2 border-b border-neutral-500">
              <h3 className="text-sm lowercase">Vocabulary</h3>
            </header>
            <ul className="divide-y divide-neutral-500 overflow-y-auto max-h-[500px] px-2 py-1">
              {unique(row.translation, "id").map((translation) => (
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
                  <button
                    type="button"
                    className="text-sm px-1 border border-neutral-500"
                  >
                    save
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col">
            <header className="p-2 border-b border-neutral-500">
              <h3 className="text-sm lowercase">notes</h3>
            </header>
            <textarea
              className="p-2 text-sm w-full h-full"
              placeholder="your thoughts here..."
            />
          </div>
        </div>
      </main>
    </>
  );
}
