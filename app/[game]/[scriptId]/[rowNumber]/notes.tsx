"use client";

import { useState } from "react";

export function Notes({
  text,
  saveNotes,
}: {
  text: string;
  saveNotes: (notes: string) => Promise<void>;
}) {
  const [currentText, setCurrentText] = useState(text);
  return (
    <div className="flex flex-col">
      <header className="p-2 border-b border-neutral-500 flex justify-between h-9">
        <h3 className="text-sm lowercase">notes</h3>
        <button
          type="button"
          disabled={currentText === text}
          className="text-sm px-1 border border-neutral-500 disabled:opacity-50 flex items-center"
          onClick={() => saveNotes(currentText)}
        >
          save
        </button>
      </header>
      <textarea
        className="p-2 text-sm w-full h-full focus-visible:outline-none"
        placeholder="your thoughts here..."
        value={currentText}
        onChange={(e) => setCurrentText(e.target.value)}
      />
    </div>
  );
}
