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
    <div className="grid grid-cols-[300px_1fr] grow bg-white border border-neutral-500 relative divide-x divide-neutral-500">
      <Sidebar script={script} progress={progress} />
      {children}
    </div>
  );
}
