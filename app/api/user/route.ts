import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  if (user) {
    return new Response(JSON.stringify(user), { status: 200 });
  } else {
    return new Response("User not found", { status: 404 });
  }
}
