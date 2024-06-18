import { signOut } from "../../auth";
import { Button } from "@/components/ui/button";

export default function SignOutComponent() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit">Sign Out</Button>
    </form>
  );
}
