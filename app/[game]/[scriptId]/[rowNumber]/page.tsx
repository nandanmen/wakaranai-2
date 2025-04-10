import { Furigana } from "@/app/components/furigana";
import { type Game, getRow } from "@/app/lib/trails-db";
import { notFound } from "next/navigation";

export default async function ScriptPage({
  params,
}: {
  params: Promise<{ game: string; scriptId: string; rowNumber: string }>;
}) {
  const realParams = await params;
  const row = await getRow({
    game: realParams.game as Game,
    scriptId: realParams.scriptId,
    rowNumber: Number.parseInt(realParams.rowNumber),
  });
  if (!row) notFound();
  return (
    <>
      <main className="grid grid-rows-[2fr_1fr] divide-y divide-neutral-500 max-h-[calc(100vh-theme(spacing.12)-theme(spacing.2)-44px)]">
        <div className="text-2xl flex text-center justify-center items-center relative p-6">
          <h3 className="absolute top-2.5 left-2.5 text-xs uppercase">Text</h3>
          <Furigana open text={row.jp.text} translation={row.translation} />
          <p className="text-sm text-neutral-500 bottom-2.5 left-6 right-6 text-center absolute">
            {row.en.text}
          </p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-neutral-500">
          <div className="p-2.5 flex flex-col">
            <header>
              <h3 className="text-xs uppercase">Vocabulary</h3>
            </header>
            <ul className="divide-y divide-neutral-500 overflow-y-auto">
              {row.translation.map((translation) => (
                <li
                  className="flex items-baseline justify-between py-1 gap-x-2"
                  key={translation.id}
                >
                  <div className="flex gap-2">
                    <p className="font-jp shrink-0">{translation.word}</p>
                    <p className="font-jp text-neutral-500 shrink-0">
                      {translation.reading}
                    </p>
                  </div>
                  <p className="text-sm text-right">{translation.meaning}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-2.5">
            <header>
              <h3 className="text-xs uppercase">Notes</h3>
            </header>
          </div>
          <div className="p-2.5">
            <header>
              <h3 className="text-xs uppercase">Ask</h3>
            </header>
          </div>
        </div>
      </main>
    </>
  );
}
