import { getScript, toGameId } from "@/app/lib/trails-db";
import { notFound } from "next/navigation";
import { Sidebar } from "./sidebar";
import { getProgress } from "@/app/lib/progress";

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

  const progress = await getProgress({
    gameId: toGameId(realParams.game),
    scriptId: realParams.scriptId,
  });
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
        <div className="grid grid-cols-[300px_1fr] grow bg-white border border-neutral-500 relative divide-x divide-neutral-500">
          <Sidebar script={script} progress={progress} />
          {children}
        </div>
      </div>
    </div>
  );
}
