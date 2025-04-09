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
    <main className="grid grid-rows-2 divide-y divide-neutral-500">
      <div className="text-2xl h-full flex text-center justify-center items-center relative p-6">
        <h3 className="absolute top-2.5 left-2.5 text-xs uppercase">Text</h3>
        <Furigana open text={row.jp.text} translation={row.translation} />
      </div>
      <div className="grid grid-cols-2 divide-x divide-neutral-500">
        <div className="p-2.5">
          <header>
            <h3 className="text-xs uppercase">Translation</h3>
          </header>
        </div>
        <div className="p-2 relative">
          <h3 className="absolute top-2.5 left-2.5 text-xs uppercase">
            Translation
          </h3>
        </div>
      </div>
    </main>
  );
}
