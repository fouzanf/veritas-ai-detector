"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldCheck, LogOut, History, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="border-b border-white/10 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            Veritas <span className="text-primary font-light">AI</span>
          </span>
        </Link>

        {session ? (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/history")} className="hidden sm:flex text-muted-foreground hover:text-foreground">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full hidden md:flex">
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="w-5 h-5 rounded-full" />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
              <span className="text-xs font-medium text-foreground">{session.user?.name}</span>
            </div>

            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })} className="border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        ) : (
          <Button variant="default" size="sm" onClick={() => router.push("/login")} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
}
