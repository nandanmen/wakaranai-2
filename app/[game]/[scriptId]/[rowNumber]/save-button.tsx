"use client";

import { useRouter } from "next/navigation";
import { saveWord } from "./actions";

export function SaveButton({
  wordId,
  ...props
}: { wordId: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-sm px-1 border border-neutral-500 disabled:opacity-50"
      onClick={() => saveWord(wordId).then(() => router.refresh())}
      {...props}
    />
  );
}
