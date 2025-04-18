"use client";

import clsx from "clsx";
import type { Vocabulary } from "../lib/jpdb/types";
import { forwardRef, useEffect, useRef, useState } from "react";
import { isKanji, toHiragana } from "wanakana";
import { produce } from "immer";
import { getExamples } from "../words/actions";
import type { Example } from "../words/types";
import Link from "next/link";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Furigana } from "../components/furigana";

export type SavedWord = {
  user_id: string;
  word_id: string;
  proficiency: string;
  id: string;
  word: string;
  metadata: Vocabulary;
};

export function Quiz({ words }: { words: SavedWord[] }) {
  const [questions, setQuestions] = useState<
    { word: SavedWord; wasCorrect: boolean | null }[]
  >(words.map((word) => ({ word, wasCorrect: null })));
  const [index, setIndex] = useState(0);
  const currentWord = questions[index];
  return (
    <div className="border border-neutral-500 bg-white relative grow grid grid-cols-[200px_1fr_400px] divide-x divide-neutral-500">
      <aside className="divide-y divide-neutral-500">
        <header className="px-2 h-9 flex items-center text-sm">
          <h4>quiz</h4>
        </header>
        <ul>
          {questions.map(({ word, wasCorrect }, i) => (
            <li
              key={word.id + String(i)}
              className={clsx(
                i === index ? "bg-neutral-200" : "text-neutral-400",
                "px-2 flex items-center",
              )}
            >
              <span className="font-jp">{word.word}</span>
              {wasCorrect !== null ? (
                <span className="ml-auto">{wasCorrect ? "✓" : "✗"}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </aside>
      <Question
        word={currentWord.word}
        onNext={(wasCorrect) => {
          setQuestions((q) =>
            produce(q, (draft) => {
              draft[index] = {
                word: currentWord.word,
                wasCorrect,
              };
              if (!wasCorrect) {
                draft.push({ word: currentWord.word, wasCorrect: null });
              }
            }),
          );
          setIndex(index + 1);
        }}
      />
    </div>
  );
}

type State =
  | {
      type: "ready";
    }
  | {
      type: "partial";
      input: {
        type: "reading" | "meaning";
        value: string;
      };
    }
  | {
      type: "submitted";
      input: {
        reading: {
          value: string;
          isCorrect: boolean;
        };
        meaning: {
          value: string;
          isCorrect: boolean;
        };
      };
    };

function Question({
  word,
  onNext,
}: { word: SavedWord; onNext: (wasCorrect: boolean) => void }) {
  const [state, setState] = useState<State>({ type: "ready" });

  const meaningRef = useRef<HTMLInputElement>(null);
  const readingRef = useRef<HTMLInputElement>(null);

  const isMeaningCorrect =
    state.type === "submitted" && state.input.meaning.isCorrect;
  const isReadingCorrect =
    state.type === "submitted" && state.input.reading.isCorrect;
  const hasKanji = [...word.word].some(isKanji);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setState({ type: "ready" });

    if (meaningRef.current) {
      meaningRef.current.value = "";
    }

    meaningRef.current?.focus();
  }, [word]);

  return (
    <>
      <main className="flex flex-col divide-y divide-neutral-500">
        <div className="grow flex items-center justify-center">
          <p className="text-4xl font-jp flex items-end">
            {word.metadata.reading.map((r) => {
              return (
                <span
                  className="flex -space-y-0.5 flex-col items-center"
                  key={r.text}
                >
                  {state.type === "submitted" && r.reading && (
                    <span className="text-sm">{r.reading}</span>
                  )}
                  <span>{r.text}</span>
                </span>
              );
            })}
          </p>
        </div>
        <div className="py-10 flex items-center justify-center">
          <form
            className="flex flex-col w-full max-w-[500px] border border-neutral-500"
            onSubmit={(e) => {
              e.preventDefault();

              if (state.type === "submitted") {
                onNext(Boolean(isMeaningCorrect && isReadingCorrect));
              }

              const data = new FormData(e.target as HTMLFormElement);
              const meaning = data.get("meaning") as string;
              const reading = data.get("reading") as string;

              const isCorrect = checkCorrect(
                {
                  text: word.word,
                  readings: [
                    word.metadata.reading
                      .map((r) => r.reading ?? r.text)
                      .join(""),
                  ],
                  meanings: word.metadata.meanings.flatMap((m) => m.split(";")),
                },
                {
                  meaning,
                  reading,
                },
              );

              setState({
                type: "submitted",
                input: {
                  meaning: { value: meaning, isCorrect: isCorrect.meaning },
                  reading: { value: reading, isCorrect: isCorrect.reading },
                },
              });
            }}
          >
            <label className="flex text-sm border-b border-neutral-500">
              <p className="h-9 flex items-center px-2 w-20 justify-center shrink-0">
                meaning
              </p>
              <div className="w-full border-l border-neutral-500">
                <div className="w-full h-9 flex items-center">
                  <input
                    className="h-full flex items-center grow px-2"
                    name="meaning"
                    type="text"
                    ref={meaningRef}
                  />
                  {state.type === "submitted" &&
                    (isMeaningCorrect ? (
                      <span className="ml-auto pr-3">✓</span>
                    ) : (
                      <button
                        type="button"
                        className="ml-auto px-1 border border-neutral-500 mr-2"
                        onClick={() => {
                          setState((s) => {
                            if (s.type !== "submitted") return s;
                            return {
                              type: "submitted",
                              input: {
                                meaning: {
                                  value: s.input.meaning.value,
                                  isCorrect: true,
                                },
                                reading: s.input.reading,
                              },
                            };
                          });
                        }}
                      >
                        mark correct
                      </button>
                    ))}
                </div>
                {state.type === "submitted" && (
                  <p className="text-xs p-2 border-t border-neutral-500">
                    {word.metadata.meanings.at(0)}
                  </p>
                )}
              </div>
            </label>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="flex text-sm">
              <p className="h-9 flex items-center justify-center px-2 w-20 shrink-0">
                reading
              </p>
              <div className="w-full border-l border-neutral-500">
                <div className="w-full h-9 flex items-center">
                  {hasKanji ? (
                    <HiraganaInput
                      key={word.word}
                      className="h-full flex items-center grow px-2 font-jp"
                      name="reading"
                      ref={readingRef}
                    />
                  ) : (
                    <p className="h-full flex items-center px-2 text-neutral-500">
                      {word.metadata.reading.map((r) => r.text).join("")}
                    </p>
                  )}
                  {hasKanji &&
                    state.type === "submitted" &&
                    (isReadingCorrect ? (
                      <span className="ml-auto pr-3">✓</span>
                    ) : (
                      <button
                        type="button"
                        className="ml-auto px-1 border border-neutral-500 mr-2"
                        onClick={() => {
                          setState((s) => {
                            if (s.type !== "submitted") return s;
                            return {
                              type: "submitted",
                              input: {
                                meaning: s.input.meaning,
                                reading: {
                                  value: s.input.reading.value,
                                  isCorrect: true,
                                },
                              },
                            };
                          });
                        }}
                      >
                        mark correct
                      </button>
                    ))}
                </div>
                {state.type === "submitted" && (
                  <p className="text-xs font-jp p-2 border-t border-neutral-500">
                    {word.metadata.reading
                      .map((r) => r.reading ?? r.text)
                      .join("")}
                  </p>
                )}
              </div>
            </label>
            <button type="submit" className="hidden">
              submit
            </button>
          </form>
        </div>
      </main>
      <aside className="divide-y divide-neutral-500">
        <section className="divide-y divide-neutral-500">
          <h4 className="text-sm h-9 p-2">meanings</h4>
          {state.type === "submitted" && (
            <ul className="p-2 text-sm list-disc px-6">
              {word.metadata.meanings.map((m) => {
                return <li key={m}>{m}</li>;
              })}
            </ul>
          )}
        </section>
        <section>
          <h4 className="text-sm h-9 p-2 border-b border-neutral-500">
            examples
          </h4>
          {state.type === "submitted" && <ExampleSentences wordId={word.id} />}
        </section>
      </aside>
    </>
  );
}

function ExampleSentences({ wordId }: { wordId: string }) {
  const [examples, setExamples] = useState<Example[]>([]);

  useEffect(() => {
    getExamples(wordId).then(setExamples);
  }, [wordId]);

  return (
    <ul className="divide-y divide-neutral-500">
      {examples.map((e) => (
        <li key={e.id + e.offset}>
          <ExampleItem example={e} />
        </li>
      ))}
    </ul>
  );
}

function ExampleItem({ example }: { example: Example }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 flex flex-col hover:bg-neutral-100 text-left w-full"
      >
        {example.jp.character && (
          <span className="text-neutral-500 text-sm flex items-end gap-1">
            <span className="font-jp">{example.jp.character}</span>
            <span>•</span>
            <span>{example.en.character}</span>
            <span className="ml-auto text-black">→</span>
          </span>
        )}
        <span className="font-jp text-base leading-tight mt-1">
          {example.parts.map((p, i) => {
            return (
              <span
                className={p.type === "word" ? "bg-neutral-200" : undefined}
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
              >
                {p.text}
              </span>
            );
          })}
        </span>
        <span className="mt-2 text-sm">{example.en.text}</span>
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
                <h4 className="text-xs lowercase">sentence</h4>
                <button type="button" onClick={() => setOpen(false)}>
                  <span className="-translate-y-px block">✕</span>
                </button>
              </header>
              <div className="p-2">
                <Furigana
                  className="text-lg"
                  text={example.jp.text}
                  translation={example.translation}
                  open
                />
              </div>
              <footer className="p-2 flex items-center justify-between">
                <button
                  className="text-xs px-1 border border-neutral-500"
                  type="button"
                >
                  play
                </button>
                <Link className="text-xs" href={example.href}>
                  go to sentence →
                </Link>
              </footer>
            </div>
          </motion.div>,
          document.body,
          `tooltip-${example.id}`,
        )}
    </>
  );
}

const HiraganaInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function HiraganaInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
  ref,
) {
  const [value, setValue] = useState("");
  return (
    <input
      ref={ref}
      {...props}
      type="text"
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        if (next.endsWith("nn")) return setValue(`${value.slice(0, -1)}ん`);
        if (next.endsWith("y") && value.at(-1) === "n") {
          return setValue(next);
        }
        if (next.endsWith("n")) return setValue(next);
        setValue(toHiragana(next));
      }}
    />
  );
});

function checkCorrect(
  word: {
    text: string;
    readings: string[];
    meanings: string[];
  },
  response: {
    meaning: string;
    reading: string;
  },
): {
  reading: boolean;
  meaning: boolean;
} {
  const hasKanji = [...word.text].some(isKanji);
  const isMeaningCorrect = word.meanings.some((meaning) => {
    const regexForParenthesis = /\(([^)]+)\)/g;
    const withoutParens = meaning
      .replace(regexForParenthesis, "")
      .toLowerCase()
      .trim();
    const withoutParensIncluded = meaning
      .replaceAll("(", "")
      .replaceAll(")", "")
      .toLowerCase()
      .trim();
    const responseText = response.meaning.toLowerCase().trim();
    return [withoutParens, withoutParensIncluded].includes(responseText);
  });
  const isReadingCorrect = hasKanji
    ? word.readings.includes(response.reading)
    : true;
  return {
    reading: isReadingCorrect,
    meaning: isMeaningCorrect,
  };
}
