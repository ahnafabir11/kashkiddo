import Link from "next/link";
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1">
            <Link href="/" className="flex items-center gap-2 ">
              <span className="sr-only">Home</span>
              <Wallet className="w-6 h-6" />
              <span className="text-xl font-semibold">KashKiddo</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session && session.user ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>

                <Button asChild variant="outline" className="hidden sm:block">
                  <Link href="/signup">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
