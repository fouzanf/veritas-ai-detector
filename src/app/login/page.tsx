"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogIn, Globe } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 relative bg-background overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Veritas AI</CardTitle>
            <CardDescription className="text-muted-foreground">
              Secure authentication for the verification dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              variant="outline"
              className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 text-foreground transition-all flex items-center justify-center gap-3 text-lg font-medium"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <LogIn className="h-5 w-5" />
              Continue with Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 text-center">
            <p className="text-xs text-muted-foreground px-8">
              By continuing, you agree to Veritas AI's Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
