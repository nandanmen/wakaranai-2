import { createClient } from "@supabase/supabase-js";

const assertEnv = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const sb = createClient(
  assertEnv("SUPABASE_URL"),
  assertEnv("SUPABASE_ANON_KEY"),
);
