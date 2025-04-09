import { getScript, toGameId } from "@/app/lib/trails-db";
import clsx from "clsx";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ScriptLayout({
  params,
  children,
}: {
  params: Promise<{ game: string; scriptId: string; rowNumber: string }>;
  children: React.ReactNode;
}) {
  const realParams = await params;
  const script = await getScript({
    gameId: toGameId(realParams.game),
    scriptId: realParams.scriptId,
  });
  if (!script) notFound();
  return (
    <div className="p-6 grow flex flex-col">
      <div className="border-neutral-300 border-b left-0 right-0 top-6 fixed" />
      <div className="border-neutral-300 border-t left-0 right-0 bottom-6 fixed" />
      <div className="border-neutral-300 border-b top-[calc(41px+theme(spacing.6))] left-0 right-0 fixed" />
      <div className="border-neutral-300 border-b top-[calc(42px+theme(spacing.6)+theme(spacing.2))] left-0 right-0 fixed" />
      <div className="grow flex flex-col gap-2 relative max-w-[1400px] mx-auto w-full">
        <div className="border-neutral-300 border-r -top-6 -bottom-6 absolute" />
        <div className="border-neutral-300 border-l -top-6 -bottom-6 right-0 absolute" />
        <header className="relative bg-white border border-neutral-500 p-2 h-[42px] flex items-center gap-1.5">
          <span className="font-jp">分</span>
          <span>wakaranai</span>
        </header>
        <div className="relative grow flex flex-col">
          <div className="grid grid-cols-[300px_1fr] grow bg-white border border-neutral-500 relative">
            <aside className="border-r border-neutral-500 max-h-[calc(100vh-theme(spacing.12)-theme(spacing.2)-44px)] flex flex-col divide-y divide-neutral-500 text-sm">
              <header className="p-2 flex justify-between">
                <Link href="/">↖ back</Link>
                <p>
                  {realParams.rowNumber} / {script.length}
                </p>
              </header>
              <ul className="space-y-1.5 overflow-y-auto p-2 grow">
                {script.map((row) => (
                  <li key={row.row}>
                    <Link
                      href={`/${realParams.game}/${realParams.scriptId}/${row.row}`}
                      scroll={false}
                      className={clsx(
                        "flex gap-2",
                        realParams.rowNumber === row.row.toString()
                          ? "text-inherit"
                          : "text-neutral-400",
                      )}
                    >
                      <span className="font-jp">{row.jpnChrName}</span>
                      <span>{row.engChrName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
