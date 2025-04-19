"use client";

import type { RawRow } from "@/app/lib/trails-db";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";

export function Sidebar({
  script,
  progress,
}: {
  script: RawRow[];
  progress: number[];
}) {
  const realParams = useParams();
  return (
    <aside className="border-r border-neutral-500 max-h-[calc(100vh-theme(spacing.12)-theme(spacing.2)-44px)] flex flex-col divide-y divide-neutral-500 text-sm">
      <header className="px-2 items-center flex justify-between h-9 shrink-0">
        <Link href={`/${realParams.game}`}>↖ back</Link>
        <p>
          {realParams.rowNumber} / {script.length}
        </p>
      </header>
      <ul className="overflow-y-auto px-2 py-[5px] grow">
        {script.map((row) => (
          <li key={row.row}>
            <Link
              href={`/${realParams.game}/${realParams.scriptId}/${row.row}`}
              scroll={false}
              className={clsx(
                "flex gap-2 py-[3px]",
                realParams.rowNumber === row.row.toString()
                  ? "text-inherit bg-neutral-200 -mx-2 px-2"
                  : "text-neutral-400",
              )}
            >
              {row.jpnChrName && row.engChrName ? (
                <>
                  <span className="font-jp">{row.jpnChrName}</span>
                  <span>{row.engChrName}</span>
                </>
              ) : (
                // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
                <span>{`<blank>`}</span>
              )}
              {progress.includes(row.row) && <span className="ml-auto">✓</span>}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
