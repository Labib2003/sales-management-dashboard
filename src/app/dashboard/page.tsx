import { db } from "~/server/db";

export default async function Dashboard() {
  const posts = await db.query.posts.findMany();

  return <div>{JSON.stringify(posts)}</div>;
}
