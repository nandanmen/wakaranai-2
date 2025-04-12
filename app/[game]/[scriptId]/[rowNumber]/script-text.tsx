"use client";

import { Furigana } from "@/app/components/furigana";
import type { Row } from "@/app/lib/trails-db";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export function ScriptText({
  row,
}: {
  row: Row;
}) {
  const params = useParams();
  const basePath = `/${params.game}/${params.scriptId}`;
  const currentRow = Number.parseInt(params.rowNumber as string);

  const [showTranslation, setShowTranslation] = useState(false);
  const [showFurigana, setShowFurigana] = useState(false);

  return (
    <div className="flex flex-col">
      <header className="text-sm items-center px-2 border-b border-neutral-500 flex h-9 gap-4">
        <h3>text</h3>
        <div className="flex gap-1 items-center ml-auto">
          <button
            type="button"
            className="flex gap-1 items-center"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            <span className="w-[14px] aspect-square border border-neutral-500 p-[2px]">
              {showTranslation ? (
                <span className="w-full h-full block bg-neutral-900" />
              ) : null}
            </span>
            <span>translation</span>
          </button>
          <button
            type="button"
            className="flex gap-1 items-center"
            onClick={() => setShowFurigana(!showFurigana)}
          >
            <span className="w-[14px] aspect-square border border-neutral-500 p-[2px]">
              {showFurigana ? (
                <span className="w-full h-full block bg-neutral-900" />
              ) : null}
            </span>
            <span>furigana</span>
          </button>
        </div>
        <div className="flex gap-1 items-center">
          <button
            className="text-sm px-1 bg-neutral-900 text-white border border-neutral-900"
            type="button"
          >
            complete
          </button>
          <Link
            className="text-sm px-1 border border-neutral-500"
            href={`${basePath}/${currentRow - 1}`}
          >
            ←
          </Link>
          <Link
            className="text-sm px-1 border border-neutral-500"
            href={`${basePath}/${currentRow + 1}`}
          >
            →
          </Link>
        </div>
      </header>
      <div className="text-2xl flex justify-center items-center relative grow">
        <div>
          <p className="text-base">{row.jp.name}</p>
          <Furigana
            className="max-w-[600px]"
            open={showFurigana}
            text={row.jp.text}
            translation={row.translation}
          />
        </div>
        {showTranslation && (
          <div className="text-sm text-left text-neutral-500 bottom-4 left-6 right-6 absolute max-w-[600px] w-max mx-auto space-y-1">
            <p className="text-xs">{row.en.name}</p>
            <p>{row.en.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
