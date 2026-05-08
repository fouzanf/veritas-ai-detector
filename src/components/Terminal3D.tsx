"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const terminalLines = [
  "> Initializing Veritas AI Engine...",
  "> Connection established with Global Node 08...",
  "> Scanning article: \"AI Deepfakes Flood Social Media...\"",
  "> Analyzing linguistic patterns...",
  "> Cross-referencing 847 historical sources...",
  "> Checking metadata and origin headers...",
  "> Bias score: 0.72 | Credibility: Low",
  "> Verdict: ⚠️ Likely Misinformation",
  "> Verification complete."
];

export function Terminal3D() {
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  useEffect(() => {
    if (currentLineIndex < terminalLines.length) {
      if (currentCharIndex < terminalLines[currentLineIndex].length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => {
            const next = [...prev];
            if (!next[currentLineIndex]) next[currentLineIndex] = "";
            next[currentLineIndex] += terminalLines[currentLineIndex][currentCharIndex];
            return next;
          });
          setCurrentCharIndex(prev => prev + 1);
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, 500);
        return () => clearTimeout(timeout);
      }
    } else {
      // Loop
      const timeout = setTimeout(() => {
        setDisplayText([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto mt-12 px-4">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative group bg-black/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl"
      >
        {/* Glow Header */}
        <div className="h-8 bg-white/5 border-b border-white/10 flex items-center gap-2 px-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
          <span className="text-[10px] font-mono text-muted-foreground ml-2">veritas-ai-v1.0.4 — bash</span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-6 font-mono text-[clamp(0.65rem,2vw,0.875rem)] min-h-[280px] sm:min-h-[320px] relative">
          {/* Scanline Overlay */}
          <div className="scanline pointer-events-none" />
          
          {/* Content */}
          <div className="space-y-1.5 relative z-10">
            {displayText.map((line, i) => (
              <p key={i} className={`${line.includes("Likely Misinformation") ? "text-amber-400 font-bold" : line.includes("Verdict") ? "text-emerald-400 font-bold" : "text-white/80"}`}>
                {line}
              </p>
            ))}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-primary ml-1"
            />
          </div>

          {/* Glowing Corners */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 blur-[60px] pointer-events-none" />
        </div>

        {/* 3D Depth Elements */}
        <div className="absolute inset-0 border border-white/5 pointer-events-none translate-z-20 rounded-xl" />
      </motion.div>
    </div>
  );
}
