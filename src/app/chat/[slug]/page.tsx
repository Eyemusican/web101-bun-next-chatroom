import { cookies } from "next/headers";
import ChatComponent from "@/components/chat";
import SignInComponent from "@/components/signIn";
import { auth } from "../../../../auth";

export default async function ChatRoom({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  if (!session?.user)
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SignInComponent />
      </main>
    );
  return (
    <>
      <div>ChatRoom: {params.slug}</div>
      <ChatComponent data={session?.user}/>
    </>
  );
}
