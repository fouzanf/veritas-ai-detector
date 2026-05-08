"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Loader2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  PlaySquare as Youtube,
  Newspaper,
  Info,
  Radio,
  ShieldAlert,
  LogOut,
  User as UserIcon
} from "lucide-react";

// Types for structured AI results
type AIAnalysis = {
  verdict: "Real" | "Fake" | "Misleading";
  confidence: number;
  reasoning: string[];
  bias: "Neutral" | "Extreme";
};

type MediaEvidence = {
  youtube: Array<{ id: string; title: string; thumbnail: string; channel: string }>;
  news: Array<{ title: string; source: string; url: string; date: string }>;
};

// NOTE: If you update .env.local, you MUST restart your dev server (npm run dev) for changes to take effect.
const AI_KEY = process.env.NEXT_PUBLIC_AI_API_KEY;
const genAI = new GoogleGenerativeAI(AI_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

export default function DashboardClient({ session }: { session: any }) {
  const [newsText, setNewsText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [evidence, setEvidence] = useState<MediaEvidence | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verifyNews = async () => {
    if (!newsText.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    setEvidence(null);

    try {
      if (!AI_KEY) {
        throw new Error("Authentication Error: Please ensure your AI API key is valid.");
      }

      const prompt = `
        Act as a professional fact-checker. Analyze the following news content or claim.
        You must return a strict JSON object with exactly these keys:
        - "verdict": "Real" | "Fake" | "Misleading"
        - "confidence": 0-100 (percentage)
        - "reasoning": array of 3-4 clear strings explaining your verdict
        - "bias": "Neutral" | "Extreme"

        Content to analyze: "${newsText}"
      `;

      const aiResult = await model.generateContent(prompt);
      const response = await aiResult.response;
      let text = response.text();
      text = text.replace(/```(?:json)?\n?([\s\S]*?)```/g, "$1").trim();

      let aiData: AIAnalysis;
      try {
        aiData = JSON.parse(text);
      } catch (jsonErr) {
        throw new Error("The AI returned an invalid response format.");
      }
      setAnalysis(aiData);

      // YouTube Integration
      const ytKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      const ytResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(newsText)}&type=video&maxResults=3&key=${ytKey || ""}`
      );

      let ytVideos = [];
      if (ytResponse.ok) {
        const data = await ytResponse.json();
        if (data.items) {
          ytVideos = data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url,
            channel: item.snippet.channelTitle
          }));
        }
      }

      // NewsAPI Integration
      const newsKey = process.env.NEXT_PUBLIC_NEWS_API_KEY || "";
      const query = newsText.substring(0, 100);
      const newsResponse = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=3&apiKey=${newsKey}`
      );

      let newsArticles = [];
      if (newsResponse.ok) {
        const data = await newsResponse.json();
        if (data.articles) {
          newsArticles = data.articles.map((art: any) => ({
            title: art.title,
            source: art.source.name,
            url: art.url,
            date: new Date(art.publishedAt).toLocaleDateString()
          }));
        }
      }

      setEvidence({ youtube: ytVideos, news: newsArticles });

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during verification.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative bg-background overflow-x-hidden perspective-1000">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-0 left-1/4 w-1/2 h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="w-full max-w-5xl z-10 space-y-12">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-[10px] font-mono tracking-widest uppercase mb-2 shadow-[0_0_15px_rgba(108,99,255,0.2)]">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Engine Active
            </div>
            <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight text-foreground font-heading">Command Center</h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl">
              Cross-reference claims in real-time.
            </p>
          </div>

          {/* User Profile Glass Pill */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-2 py-2 pr-6 rounded-full backdrop-blur-xl shadow-lg">
            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-white/10 overflow-hidden">
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground leading-tight">{session.user?.name}</p>
              <p className="text-[10px] text-muted-foreground font-mono">{session.user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="ml-2 w-8 h-8 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Input Card with 3D Hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group perspective-1000"
        >
          <div className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden transition-transform duration-500 preserve-3d group-hover:rotate-x-1 group-hover:-rotate-y-1">
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ top: "-100%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-20"
                  style={{ boxShadow: "0 0 20px var(--primary)" }}
                />
              )}
            </AnimatePresence>

            <div className="p-6 border-b border-white/5 flex items-center justify-between translate-z-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Newspaper className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Content Analysis</h2>
              </div>
            </div>

            <div className="p-6 translate-z-10 relative">
              <Textarea
                placeholder="Paste an article excerpt, claim, or URL..."
                className="min-h-[160px] bg-transparent border-0 text-foreground text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/30 transition-all resize-none shadow-none"
                value={newsText}
                onChange={(e) => setNewsText(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>

            <div className="p-4 bg-white/5 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between translate-z-20">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Info className="h-3 w-3" /> Ready for verification
              </div>
              <Button
                onClick={verifyNews}
                disabled={!newsText.trim() || isAnalyzing}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12 rounded-xl transition-all active:scale-95 w-full md:w-auto shadow-[0_0_20px_rgba(108,99,255,0.3)] hover:shadow-[0_0_30px_rgba(108,99,255,0.5)]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Verify Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 25 }}
              className="space-y-8 pb-20"
            >
              {/* Verdict Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 perspective-1000">
                {/* Confidence Card */}
                <div className="lg:col-span-1 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col items-center justify-center relative overflow-hidden group preserve-3d transition-transform duration-500 hover:rotate-y-2 hover:rotate-x-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-48 h-48 flex items-center justify-center translate-z-20">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(108,99,255,0.3)]">
                      <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                      <motion.circle
                        cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="6" fill="transparent"
                        strokeDasharray={528}
                        initial={{ strokeDashoffset: 528 }}
                        animate={{ strokeDashoffset: 528 - (528 * analysis.confidence) / 100 }}
                        className={analysis.confidence > 70 ? "text-emerald-400" : analysis.confidence > 40 ? "text-amber-400" : "text-destructive"}
                        strokeLinecap="round"
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className={`${analysis.confidence === 100 ? 'text-3xl' : 'text-4xl'} font-black text-foreground font-heading tracking-tight transition-all duration-300`}>
                        {analysis.confidence}%
                      </span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Confidence</span>
                    </div>
                  </div>
                </div>

                {/* Details Card */}
                <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 flex flex-col justify-between group preserve-3d transition-transform duration-500 hover:-rotate-y-2 hover:-rotate-x-2">
                  <div className="space-y-8 translate-z-20">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-2xl font-bold text-foreground font-heading">Engine Verdict</h3>
                      <div className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${analysis.verdict === 'Real' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' :
                        analysis.verdict === 'Fake' ? 'bg-destructive/20 text-destructive border border-destructive/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        }`}>
                        {analysis.verdict}
                      </div>
                    </div>
                    <ul className="space-y-4">
                      {analysis.reasoning.map((r, i) => (
                        <motion.li
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                          key={i} className="flex items-start gap-4 text-muted-foreground text-sm leading-relaxed"
                        >
                          <div className="mt-1 shrink-0 p-1 rounded-full bg-white/5">
                            <CheckCircle2 className="h-3 w-3 text-primary" />
                          </div>
                          <span>{r}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-3 translate-z-20">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Detected Bias:</span>
                    <Badge variant="outline" className={`font-mono uppercase text-[10px] tracking-widest px-2 py-0.5 ${analysis.bias === 'Extreme' ? 'text-destructive border-destructive/30 bg-destructive/10' : 'text-primary border-primary/30 bg-primary/10'
                      }`}>
                      {analysis.bias}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Evidence Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-sm font-bold text-muted-foreground font-mono uppercase tracking-widest flex items-center gap-2">
                    <Radio className="h-4 w-4 text-primary animate-pulse" /> External Evidence
                  </h2>
                  <div className="h-px bg-gradient-to-r from-white/10 to-transparent flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-1000">
                  <div className="space-y-4 preserve-3d">
                    {evidence?.youtube.map((v, i) => (
                      <motion.a
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={i} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer"
                        className="group block rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/10 transition-all duration-300 overflow-hidden shadow-lg hover:-translate-y-1 hover:rotate-x-2 preserve-3d"
                      >
                        <div className="flex flex-col sm:flex-row gap-4 p-2 translate-z-10">
                          <div className="w-full sm:w-32 h-40 sm:h-24 rounded-xl overflow-hidden bg-black shrink-0 relative">
                            <img src={v.thumbnail} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                              <Youtube className="h-8 w-8 text-white drop-shadow-md opacity-80 group-hover:text-red-500 group-hover:opacity-100 transition-all" />
                            </div>
                          </div>
                          <div className="flex flex-col justify-center pr-4 py-2">
                            <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-red-400 transition-colors leading-snug">
                              <span dangerouslySetInnerHTML={{ __html: v.title }} />
                            </h4>
                            <p className="text-[10px] text-muted-foreground mt-2 font-mono">{v.channel}</p>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>

                  <div className="space-y-4 preserve-3d">
                    {evidence?.news.map((art, i) => (
                      <motion.a
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        key={i} href={art.url} target="_blank" rel="noreferrer"
                        className="group block p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 flex justify-between items-center shadow-lg hover:-translate-y-1 hover:-rotate-x-2 preserve-3d"
                      >
                        <div className="overflow-hidden space-y-3 translate-z-10">
                          <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-blue-400 transition-colors leading-relaxed">{art.title}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-sm uppercase font-black tracking-wider">{art.source}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{art.date}</span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 ml-6 group-hover:text-blue-400 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 translate-z-10" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex flex-col items-center gap-4 text-center backdrop-blur-xl">
            <ShieldAlert className="h-8 w-8 text-destructive animate-pulse" />
            <div className="space-y-1">
              <p className="font-bold font-heading">System Notice</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setError(null)} className="border-destructive/20 text-destructive hover:bg-destructive/20 mt-2">Dismiss</Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
