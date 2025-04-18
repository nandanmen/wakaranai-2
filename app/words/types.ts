import type { Word } from "../lib/trails-db";

export type Example = {
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
  translation: Word[];
  literal: string;
  offset: number;
  parts: {
    type: "text" | "word";
    text: string;
  }[];
};
