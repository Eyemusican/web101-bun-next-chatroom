import { auth } from "../../auth";
import SignInComponent from "@/components/signIn";
import SignOutComponent from "@/components/signOut";
import JoinChatRoomComponent from "@/components/joinChatRoom";

export default async function Home() {
  const session = await auth();
  if (!session?.user)
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SignInComponent />
      </main>
    );
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignOutComponent />
      <JoinChatRoomComponent />
    </main>
  );
}
