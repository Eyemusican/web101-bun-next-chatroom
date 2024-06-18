import { signIn } from "../../auth";
import { Button } from "@/components/ui/button";

export default function SignInComponent() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <Button type="submit">Sign in</Button>
    </form>
  );
}
