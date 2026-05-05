"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, GlobeLock } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[150px] pointer-events-none" />

      <main className="container max-w-5xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-4 py-1.5 text-sm text-primary mb-8"
        >
          <Zap className="h-4 w-4 mr-2" />
          <span className="font-medium tracking-wide">Veritas AI Engine v2.0</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
        >
          Discover the Truth with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            Absolute Clarity
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
        >
          Veritas AI uses advanced fact-checking algorithms and real-time video evidence to help you separate fact from fiction in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button size="lg" onClick={() => router.push("/login")} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-14 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all">
            Enter Dashboard
          </Button>
          <Button size="lg" variant="outline" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="font-semibold px-8 h-14 rounded-full border-white/10 bg-black/20 backdrop-blur-md hover:bg-white/5 text-foreground transition-all">
            View Features
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left"
          id="features"
        >
          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Live API Verification</h3>
            <p className="text-muted-foreground">Instantly scan articles against Google Fact Check Tools for authoritative results.</p>
          </div>
          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Video Evidence</h3>
            <p className="text-muted-foreground">Automatically fetch the most relevant YouTube videos providing crucial context.</p>
          </div>
          <div className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <GlobeLock className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Global Reach</h3>
            <p className="text-muted-foreground">Verify claims across international sources and languages in real-time.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
