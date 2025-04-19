import Link from "next/link";
import { getScriptsForGame, toGameId } from "../lib/trails-db";

export default async function GamePage({
  params,
}: {
  params: Promise<{ game: string }>;
}) {
  const realParams = await params;
  const scripts = await getScriptsForGame(toGameId(realParams.game));
  return (
    <div className="bg-white border border-neutral-500 relative px-12 py-10">
      <ul className="divide-y divide-neutral-500">
        {scripts?.map((s) => (
          <li key={s.fname}>
            <Link
              className="flex items-center py-2 gap-4 hover:bg-neutral-100"
              href={`/${realParams.game}/${s.fname}/1`}
            >
              <span className="w-[100px]">{s.fname}</span>
              <span className="w-[100px]">{s.rows} rows</span>
              <span>{s.engPlaceNames.join(", ")}</span>
              <span className="ml-auto">
                {s.engChrNames
                  .filter((c) => c.length > 0)
                  .slice(0, 4)
                  .join(", ")}
              </span>
              <span>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
