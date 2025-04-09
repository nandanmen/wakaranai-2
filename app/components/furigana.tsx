"use client";

import { motion } from "motion/react";
import { clsx } from "clsx";
import { isKana } from "wanakana";
import type { Word } from "../lib/trails-db";
import { Tooltip } from "./tooltip";

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
            <motion.span className="inline-block" layout="position" key={i}>
              {slice.value}
            </motion.span>
          );
        }
        const { word, reading } = slice.value;
        const kanaOnly = isKana(word) || reading === word;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <motion.span layout="position" className="flex flex-col" key={i}>
            {open && !kanaOnly && (
              <motion.span
                animate={{ opacity: 1 }}
                className="text-sand-11 text-xs text-center"
              >
                {reading}
              </motion.span>
            )}
            <Tooltip
              content={
                <span className="flex flex-col items-center gap-1">
                  {slice.value.reading && (
                    <span className="font-jp font-medium">
                      {slice.value.reading}
                    </span>
                  )}
                  <span>{slice.value.meaning}</span>
                </span>
              }
            >
              <motion.span
                className="inline-block hover:bg-green-4 rounded-md"
                layout="position"
              >
                {word}
              </motion.span>
            </Tooltip>
          </motion.span>
        );
      })}
    </p>
  );
}
