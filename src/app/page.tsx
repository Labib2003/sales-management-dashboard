import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";

export default function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center">
      <div className="grid grid-cols-2 gap-5">
        <Link className={buttonVariants()} href={"/auth/login"}>
          Login
        </Link>
        <Link className={buttonVariants()} href={"/dashboard"}>
          Dashboard
        </Link>
      </div>
    </main>
  );
}
