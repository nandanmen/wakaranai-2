import { sql } from "./sql";

export async function getProgress({
  gameId,
  scriptId,
}: {
  gameId: string;
  scriptId: string;
}) {
  const response = await sql<
    { row_number: number }[]
  >`select row_number from progress where game_id = ${gameId} and script_id = ${scriptId} and completed = true`;
  return response.map((row) => Number(row.row_number));
}

export async function markComplete({
  gameId,
  scriptId,
  rowNumber,
}: {
  gameId: string;
  scriptId: string;
  rowNumber: number;
}) {
  await sql`insert into progress (game_id, script_id, row_number, completed) values (${gameId}, ${scriptId}, ${rowNumber}, true)`;
}
