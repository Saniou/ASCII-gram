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

export const db = new Low<Schema>(adapter, {
  users:    [],
  posts:    [],
  usernames: {},
});

export async function initDB() {
  await db.read();
  db.data ||= { users: [], posts: [], usernames: {} };
  await db.write();
}
