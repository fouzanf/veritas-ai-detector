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
  Zap,
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
    <div className="flex-1 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative bg-background overflow-x-hidden">
      <div className="absolute top-0 left-1/4 w-1/2 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="w-full max-w-5xl z-10 space-y-8">
        {/* User Profile / Logout Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              {session.user?.image ? (
                <img src={session.user.image} alt="" className="w-full h-full rounded-full" />
              ) : (
                <UserIcon className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{session.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session.user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all"
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>

        <div className="space-y-2 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2"
          >
            <Zap className="h-3 w-3" /> Veritas AI Pro
          </motion.div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground">Advanced News Verification</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Real-time fact-checking powered by Google Gemini 1.5 and media cross-referencing.
          </p>
        </div>

        {/* Input Card */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden">
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ top: "-100%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-20"
                style={{ boxShadow: "0 0 15px var(--primary)" }}
              />
            )}
          </AnimatePresence>

          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Newspaper className="h-5 w-5 text-primary" />
              Content Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste a news headline, URL, or claim here..."
              className="min-h-[180px] bg-white/5 border-white/10 text-foreground text-lg focus-visible:ring-primary focus-visible:ring-offset-0 placeholder:text-muted-foreground/30 transition-all resize-none"
              value={newsText}
              onChange={(e) => setNewsText(e.target.value)}
              disabled={isAnalyzing}
            />
          </CardContent>
          <CardFooter className="flex flex-col md:flex-row gap-4 items-center justify-between border-t border-white/5 pt-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Info className="h-3 w-3" />
              Veritas AI will evaluate linguistic patterns and external evidence.
            </div>
            <Button
              onClick={verifyNews}
              disabled={!newsText.trim() || isAnalyzing}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 h-12 rounded-lg transition-all active:scale-95 w-full md:w-auto shadow-lg shadow-primary/20"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Verify with Veritas
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 pb-20"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Confidence Gauge */}
                <Card className="md:col-span-1 bg-black/40 backdrop-blur-xl border-white/10 flex flex-col items-center justify-center p-8">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                      <motion.circle
                        cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent"
                        strokeDasharray={440}
                        initial={{ strokeDashoffset: 440 }}
                        animate={{ strokeDashoffset: 440 - (440 * analysis.confidence) / 100 }}
                        className={analysis.confidence > 70 ? "text-emerald-500" : analysis.confidence > 40 ? "text-amber-500" : "text-destructive"}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-black text-foreground">{analysis.confidence}%</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Confidence</span>
                    </div>
                  </div>
                </Card>

                {/* Verdict Card */}
                <Card className="md:col-span-2 bg-black/40 backdrop-blur-xl border-white/10 p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-foreground">Veritas Verdict</h3>
                      <Badge className={`px-4 py-1 text-sm font-bold rounded-md ${analysis.verdict === 'Real' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                        analysis.verdict === 'Fake' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                          'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}>
                        {analysis.verdict}
                      </Badge>
                    </div>
                    <ul className="space-y-4">
                      {analysis.reasoning.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Bias Level:</span>
                    <Badge variant="outline" className={`border-white/10 font-bold uppercase text-[10px] tracking-widest px-2 py-0.5 ${analysis.bias === 'Extreme' ? 'text-destructive border-destructive/30' : 'text-primary border-primary/30'
                      }`}>
                      {analysis.bias}
                    </Badge>
                  </div>
                </Card>
              </div>

              {/* Evidence Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px bg-white/10 flex-1" />
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Radio className="h-5 w-5 text-primary" /> Media Evidence
                  </h2>
                  <div className="h-px bg-white/10 flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-red-500" /> YouTube Search
                    </h3>
                    {evidence?.youtube.map((v, i) => (
                      <a key={i} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" className="group block">
                        <div className="flex flex-col sm:flex-row gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all">
                          <div className="w-full sm:w-28 h-40 sm:h-20 rounded-lg overflow-hidden bg-black shrink-0 relative shadow-inner">
                            <img src={v.thumbnail} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex flex-col justify-center pr-2">
                            <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                              <span dangerouslySetInnerHTML={{ __html: v.title }} />
                            </h4>
                            <p className="text-[11px] text-muted-foreground mt-1.5">{v.channel}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Newspaper className="h-4 w-4 text-blue-500" /> News Articles
                    </h3>
                    {evidence?.news.map((art, i) => (
                      <a key={i} href={art.url} target="_blank" rel="noreferrer" className="group block">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all flex justify-between items-center">
                          <div className="overflow-hidden space-y-2">
                            <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-blue-400 transition-colors">{art.title}</h4>
                            <div className="flex items-center gap-3">
                              <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full uppercase font-black">{art.source}</span>
                              <span className="text-[10px] text-muted-foreground">{art.date}</span>
                            </div>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 ml-6 group-hover:text-blue-400 transition-all" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex flex-col items-center gap-3 text-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
            <div className="space-y-1">
              <p className="font-bold">System Error</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setError(null)} className="border-destructive/20 text-destructive hover:bg-destructive/10">Dismiss</Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
