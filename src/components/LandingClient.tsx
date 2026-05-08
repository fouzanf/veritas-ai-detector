"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Zap,
  GlobeLock,
  ArrowRight,
  ChevronRight,
  Search,
  Database,
  Cpu,
  ShieldAlert
} from "lucide-react";
import { HeroGlobe } from "@/components/HeroGlobe";
import { Terminal3D } from "@/components/Terminal3D";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const features = [
  {
    icon: ShieldCheck,
    title: "Neural Verification",
    desc: "Proprietary models trained on millions of fact-checked claims to instantly spot linguistic anomalies.",
    color: "text-primary",
    glow: "rgba(108, 99, 255, 0.4)"
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    desc: "Results delivered in under 2 seconds. Powered by edge computing and optimized inference.",
    color: "text-blue-400",
    glow: "rgba(59, 130, 246, 0.4)"
  },
  {
    icon: GlobeLock,
    title: "Global Cross-reference",
    desc: "Simultaneous scanning of thousands of reputable news sources and APIs worldwide.",
    color: "text-accent",
    glow: "rgba(0, 255, 204, 0.4)"
  }
];

const steps = [
  {
    number: "01",
    title: "Data Ingestion",
    desc: "Veritas pulls metadata, origin headers, and content from any URL or text block.",
    icon: Database
  },
  {
    number: "02",
    title: "Neural Analysis",
    desc: "Our Gemini-powered core evaluates linguistic bias, sentiment, and factual consistency.",
    icon: Cpu
  },
  {
    number: "03",
    title: "Evidence Mapping",
    desc: "Verification results are cross-referenced with live news feeds and YouTube database.",
    icon: Search
  },
  {
    number: "04",
    title: "Final Verdict",
    desc: "A comprehensive credibility report is generated with clear, actionable insights.",
    icon: ShieldAlert
  }
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const degX = (y - centerY) / 10;
    const degY = (centerX - x) / 10;
    setRotateX(degX);
    setRotateY(degY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LandingClient({ session }: { session: any }) {
  const router = useRouter();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const authAwareRoute = session ? "/dashboard" : "/login";

  return (
    <div className="flex-1 flex flex-col bg-background text-foreground selection:bg-primary/30">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(108,99,255,0.05),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent)]" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden px-4 md:px-6">
        <HeroGlobe />

        <motion.div style={{ y, opacity }} className="container max-w-6xl mx-auto flex flex-col items-center text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm font-medium mb-8 hover:bg-white/10 transition-colors cursor-pointer group shadow-lg"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-white/80">Veritas Engine v3.0 is live</span>
            <ChevronRight className="h-4 w-4 ml-1 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[clamp(2.5rem,8vw,6rem)] font-extrabold tracking-tight mb-8 font-heading leading-[1.1]"
          >
            Truth, verified at the <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent text-glow">
              speed of thought.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
          >
            Separate fact from fiction instantly. Veritas AI uses advanced models and real-time media cross-referencing to validate claims with absolute precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center"
          >
            <Button
              size="lg"
              onClick={() => router.push(authAwareRoute)}
              className="group relative bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-12 h-14 rounded-full shadow-[0_0_30px_rgba(108,99,255,0.4)] hover:shadow-[0_0_50px_rgba(108,99,255,0.6)] transition-all active:scale-95"
            >
              Start Analyzing <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="font-bold px-12 h-14 rounded-full border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 text-foreground transition-all"
            >
              Explore Tech
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full z-10"
        >
          <Terminal3D />
        </motion.div>
      </section>

      {/* Stats Section: Optimized for overflow and responsiveness */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02] backdrop-blur-md z-10 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4">
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
          >
            {[
              { label: "Analyses Done", value: 1250000, suffix: "+" },
              { label: "Sources Scanned", value: 48000, suffix: "" },
              { label: "Accuracy Rate", value: 99, suffix: "%" },
              { label: "Response Time", value: 1.8, suffix: "s" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative p-6 sm:p-8 rounded-3xl bg-black/40 border border-white/10 shadow-xl min-h-[180px] flex flex-col justify-center items-center group overflow-hidden"
              >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex flex-col items-center justify-center w-full text-center relative z-10">
                  <h4
                    className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight tabular-nums leading-none mb-2"
                  >
                    <AnimatedCounter value={stat.value} />{stat.suffix}
                  </h4>
                  <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold">
                    {stat.label}
                  </p>
                </div>

                {/* Animated Bottom Border Line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 z-10 relative overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[clamp(2rem,5vw,4rem)] font-bold font-heading mb-6"
            >
              Built for certainty.
            </motion.h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              Our infrastructure combines multiple AI models and live data streams to deliver verifications you can trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feat, i) => (
              <TiltCard key={i} className="group h-full">
                <div
                  className="h-full p-10 rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-colors hover:border-white/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div
                    className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3 translate-z-50"
                    style={{ boxShadow: `0 0 30px ${feat.glow}` }}
                  >
                    <feat.icon className={`h-8 w-8 ${feat.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-heading text-foreground translate-z-20">{feat.title}</h3>
                  <p className="text-muted-foreground leading-relaxed translate-z-20">{feat.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 z-10 relative bg-white/[0.01]">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold font-heading mb-6">How It Works</h2>
            <p className="text-muted-foreground text-lg">A 4-step process to reach the ground truth.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, rotateY: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="relative p-8 rounded-3xl bg-black/40 border border-white/10 hover:border-primary/50 transition-all group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 font-heading text-6xl font-black text-white/5 transition-colors group-hover:text-primary/10">
                  {step.number}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-heading">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 z-10 relative">
        <div className="container max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-primary/20 via-background to-accent/20 border border-white/10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />
            <h2 className="text-[clamp(2.25rem,6vw,5rem)] font-extrabold font-heading mb-8 relative z-10 leading-tight">
              Ready to verify?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto relative z-10">
              Join thousands of journalists, researchers, and truth-seekers who use Veritas AI daily.
            </p>
            <Button
              size="lg"
              onClick={() => router.push(authAwareRoute)}
              className="bg-white text-black hover:bg-white/90 font-bold px-12 h-16 rounded-full text-lg relative z-10 shadow-2xl transition-transform active:scale-95"
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
