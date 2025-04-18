"use client";

import { createPortal } from "react-dom";
import type { Vocabulary } from "../lib/jpdb/types";
import { motion } from "motion/react";
import { isKanji } from "wanakana";
import { useState } from "react";
import { getExamples } from "./actions";
import Link from "next/link";

type Example = {
  en: {
    character: string;
    text: string;
  };
  href: string;
  id: string;
  jp: {
    character: string;
    text: string;
  };
  literal: string;
  offset: number;
  parts: {
    type: "text" | "word";
    text: string;
  }[];
};

export function WordItem({
  word,
}: {
  word: {
    id: string;
    proficiency: string;
    word: string;
    metadata: Vocabulary;
  };
}) {
  const [open, setOpen] = useState(false);
  const [examples, setExamples] = useState<Example[]>([]);

  return (
    <>
      <button
        className="flex justify-between items-center p-2 border-neutral-500 w-full hover:bg-neutral-100"
        type="button"
        onClick={() => {
          setOpen(true);
          getExamples(word.id).then(setExamples);
        }}
      >
        <span className="flex gap-1.5 font-jp">
          <span>{word.word}</span>
          {[...word.word].some((c) => isKanji(c)) && (
            <span className="text-neutral-500 shrink-0">
              {word.metadata.reading.map((r) => r.reading ?? r.text).join("")}
            </span>
          )}
        </span>
        <span className="text-sm text-right">
          {word.metadata.meanings.at(0)?.split(";").at(0)} ↗
        </span>
      </button>
      {open &&
        createPortal(
          <motion.div
            drag
            dragMomentum={false}
            className="fixed top-1/2 left-1/2"
          >
            <div
              className="bg-white border border-neutral-500 text-sm text-left w-[350px] z-30 divide-y divide-neutral-500"
              style={{
                boxShadow: "5px 5px 0 rgba(0,0,0,.15)",
              }}
            >
              <header className="py-0.5 pr-2 pl-1.5 flex justify-between items-center">
                <h4 className="text-xs lowercase">word</h4>
                <button type="button" onClick={() => setOpen(false)}>
                  <span className="-translate-y-px block">✕</span>
                </button>
              </header>
              <div className="text-center p-2">
                <p className="font-jp flex justify-center items-end">
                  {word.metadata.reading.map((r) => {
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
                <p>{word.metadata.meanings.join(", ")}</p>
              </div>
              {examples.length > 0 && (
                <ul className="divide-y divide-neutral-500">
                  {examples.map((e) => {
                    return (
                      <li key={e.id + e.offset}>
                        <Link
                          href={e.href}
                          className="p-2 flex flex-col hover:bg-neutral-100"
                        >
                          {e.jp.character && (
                            <span className="text-neutral-500 text-sm flex items-end gap-1">
                              <span className="font-jp">{e.jp.character}</span>
                              <span>•</span>
                              <span>{e.en.character}</span>
                              <span className="ml-auto text-black">→</span>
                            </span>
                          )}
                          <span className="font-jp text-base">
                            {e.parts.map((p, i) => {
                              return (
                                <span
                                  className={
                                    p.type === "word"
                                      ? "text-blue-600 font-medium"
                                      : undefined
                                  }
                                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                  key={i}
                                >
                                  {p.text}
                                </span>
                              );
                            })}
                          </span>
                          <span className="mt-2">{e.en.text}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>,
          document.body,
          `tooltip-${word.word}`,
        )}
    </>
  );
}
