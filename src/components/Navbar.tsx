"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, LogOut, History, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-colors shadow-[0_0_15px_rgba(108,99,255,0.2)]">
            <ShieldCheck className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground font-heading">
            Veritas<span className="text-primary font-light">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/history")} className="text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors">
                <History className="h-4 w-4 mr-2" />
                <span className="font-mono text-xs uppercase tracking-wider">History</span>
              </Button>
              <div className="h-8 w-px bg-white/10" />

              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full shadow-inner">
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
                <span className="text-xs font-semibold text-foreground tracking-wide">{session.user?.name}</span>
              </div>

              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/" })} className="border-white/10 bg-transparent hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30 rounded-lg transition-all">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="font-mono text-xs uppercase tracking-wider">Logout</span>
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" onClick={() => router.push("/login")} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-[0_0_15px_rgba(108,99,255,0.4)] hover:shadow-[0_0_25px_rgba(108,99,255,0.6)] transition-all rounded-lg">
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-foreground" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-white/5 bg-black/90 backdrop-blur-3xl overflow-hidden"
          >
            <div className="container px-4 py-6 flex flex-col gap-4">
              {session ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      {session.user?.image ? (
                        <img src={session.user.image} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="justify-start hover:bg-white/5 text-muted-foreground hover:text-foreground" onClick={() => { router.push("/history"); toggleMenu(); }}>
                    <History className="h-4 w-4 mr-3" />
                    History
                  </Button>
                  <Button variant="outline" className="justify-start border-white/10 hover:bg-destructive/20 hover:text-destructive" onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="default" className="w-full bg-primary hover:bg-primary/90" onClick={() => { router.push("/login"); toggleMenu(); }}>
                  Sign In
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
