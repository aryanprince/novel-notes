import clsx from "clsx";
import Link from "next/link";

import { CreatePost } from "~/app/components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { buttonVariants } from "./components/ui/button";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();
  let secretMessage = null;

  if (session) {
    secretMessage = await api.post.getSecretMessage.query();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>

        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="gap-2 md:flex">
              <p className="text-center">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <p>
                {secretMessage
                  ? `- ${secretMessage}`
                  : "Log in to see secret message ;)"}
              </p>
            </div>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className={clsx(
                buttonVariants({ variant: "default" }),
                "bg-white/10  hover:bg-white/20 hover:text-white",
              )}
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
