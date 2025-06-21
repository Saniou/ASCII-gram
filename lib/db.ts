// lib/db.ts
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";

type UserRecord    = { id: string; username: string; email: string; password: string };
type CommentRecord = { id: string; userId: string; username: string; content: string; created_at: string };
type PostRecord    = { id: string; userId: string; username: string; content: string; created_at: string; likes: string[]; comments: CommentRecord[] };

export type Schema = {
  users:    UserRecord[];
  posts:    PostRecord[];
  usernames: Record<string, string>;
};

const file    = join(process.cwd(), "db.json");
const adapter = new JSONFile<Schema>(file);

// **Here** we give Low the default shape of our database
export const db = new Low<Schema>(adapter, {
  users:    [],
  posts:    [],
  usernames: {},
});

export async function initDB() {
  // This read will create `db.data` with the defaults above if the file is missing/empty
  await db.read();
  // Just to be safe, re-apply defaults if needed
  db.data ||= { users: [], posts: [], usernames: {} };
  // And write it back out so that db.json now exists
  await db.write();
}
