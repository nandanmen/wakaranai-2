"use client";

import { motion } from "motion/react";
import { clsx } from "clsx";
import { isKana } from "wanakana";
import type { Word } from "../lib/trails-db";
import { Tooltip } from "./tooltip";
import { useState } from "react";
import { createPortal } from "react-dom";

function getSlices(text: string, translation: Word[]) {
  const slices: Array<
    { type: "text"; value: string } | { type: "word"; value: Word }
  > = [];
  let start = 0;
  for (const word of translation) {
    const pos = text.indexOf(word.word, start);
    if (pos === -1) continue;
    const before = text.slice(start, pos);
    if (before.length) {
      slices.push({ type: "text", value: before });
    }
    slices.push({ type: "word", value: word });
    start = pos + word.word.length;
  }
  const remainder = text.slice(start);
  if (remainder.length) {
    slices.push({ type: "text", value: text.slice(start) });
  }
  return slices;
}

export function Furigana({
  className,
  text,
  translation,
  open = false,
}: {
  className?: string;
  text: string;
  translation: Word[];
  open?: boolean;
}) {
  if (!translation || !Array.isArray(translation)) return null;
  const slices = getSlices(text, translation);
  return (
    <p className={clsx("flex flex-wrap items-end font-jp", className)}>
      {slices.map((slice, i) => {
        if (slice.type === "text") {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <span className="inline-block" key={i}>
              {slice.value}
            </span>
          );
        }
        const { word, reading } = slice.value;
        const kanaOnly = isKana(word) || reading === word;
        return (
          <span
            className="flex -space-y-0.5 flex-col"
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={i}
          >
            {open && !kanaOnly && (
              <span className="text-neutral-500 text-xs text-center">
                {reading}
              </span>
            )}
            <Vocab word={slice.value} />
          </span>
        );
      })}
    </p>
  );
}

function Vocab({
  word,
  initialOpen = false,
}: { word: Word; initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <Tooltip
        content={
          <div className="text-center divide-y divide-neutral-500">
            {word.reading && (
              <p className="font-jp p-1 text-sm">{word.reading}</p>
            )}
            <p className="text-sm p-1">{word.meaning}</p>
          </div>
        }
      >
        <button
          className="inline-block underline decoration-dotted underline-offset-4 decoration-neutral-500 hover:bg-neutral-200"
          onClick={() => setOpen(true)}
          type="button"
        >
          {word.word}
        </button>
      </Tooltip>
      {open &&
        createPortal(
          <motion.div
            drag
            dragMomentum={false}
            className="fixed top-1/2 left-1/2"
          >
            <div
              className="bg-white border border-neutral-500 text-sm text-left w-[250px] z-30 divide-y divide-neutral-500"
              style={{
                boxShadow: "5px 5px 0 rgba(0,0,0,.15)",
              }}
            >
              <header className="py-0.5 pr-2 pl-1.5 flex justify-between items-center">
                <h4 className="text-xs uppercase">Word</h4>
                <button type="button" onClick={() => setOpen(false)}>
                  <span className="-translate-y-px block">✕</span>
                </button>
              </header>
              <div className="text-center p-2">
                <p className="font-jp flex justify-center items-end">
                  {word.data.reading.map((r) => {
                    return (
                      <span className="flex flex-col items-center" key={r.text}>
                        <span className="text-sm">{r.reading}</span>
                        <span className="text-2xl">{r.text}</span>
                      </span>
                    );
                  })}
                </p>
              </div>
              <div className="text-sm font-sans p-2">
                <p>{word.data.meanings.join(", ")}</p>
              </div>
            </div>
          </motion.div>,
          document.body,
          `tooltip-${word.word}`,
        )}
    </>
  );
}
