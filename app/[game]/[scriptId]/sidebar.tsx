"use client";

import type { RawRow } from "@/app/lib/trails-db";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";

export function Sidebar({ script }: { script: RawRow[] }) {
  const realParams = useParams();
  return (
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
  );
}
