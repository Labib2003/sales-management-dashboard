import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const posts = await db.query.posts.findMany();

  return <div>{JSON.stringify(posts)}</div>;
}
