"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History, Search, CheckCircle2, AlertTriangle, Eye, Loader2 } from "lucide-react";

const mockHistory = [
  {
    id: "1",
    date: "2026-05-04 14:30",
    text: "New study shows that eating chocolate improves memory...",
    status: "Flagged",
    confidence: 82,
  },
  {
    id: "2",
    date: "2026-05-04 10:15",
    text: "NASA's James Webb Telescope discovers new water world...",
    status: "Verified",
    confidence: 96,
  },
  {
    id: "3",
    date: "2026-05-03 18:45",
    text: "Unverified reports of a massive energy breakthrough in...",
    status: "Flagged",
    confidence: 74,
  },
  {
    id: "4",
    date: "2026-05-02 09:20",
    text: "Global carbon emissions hit record low in recent quarter...",
    status: "Verified",
    confidence: 91,
  },
];

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center p-4 md:p-8 relative overflow-hidden bg-background">
      {/* 3D Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <main className="w-full max-w-5xl z-10 space-y-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-bold tracking-tight flex items-center gap-3 font-heading text-foreground">
              <History className="h-8 w-8 sm:h-10 sm:w-10 text-primary drop-shadow-[0_0_15px_rgba(108,99,255,0.8)]" />
              Intelligence Logs
            </h1>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest pl-14">
              Historical cross-reference data.
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")} className="bg-primary hover:bg-primary/90 rounded-xl shadow-[0_0_15px_rgba(108,99,255,0.3)] hover:shadow-[0_0_25px_rgba(108,99,255,0.5)] transition-all">
            <Search className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="perspective-1000"
        >
          <Card className="bg-black/40 backdrop-blur-2xl border-white/10 shadow-2xl overflow-hidden preserve-3d transition-transform duration-500 hover:rotate-x-1 hover:-rotate-y-1 rounded-3xl">
            <CardHeader className="border-b border-white/5 bg-white/5 translate-z-10">
              <CardTitle className="text-foreground font-heading">Archive</CardTitle>
            </CardHeader>
            <CardContent className="p-0 translate-z-10 overflow-x-auto">
              <Table className="min-w-[600px] md:min-w-full">
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="font-mono text-xs uppercase text-muted-foreground">Date</TableHead>
                    <TableHead className="max-w-[300px] font-mono text-xs uppercase text-muted-foreground">Content Snippet</TableHead>
                    <TableHead className="font-mono text-xs uppercase text-muted-foreground">Status</TableHead>
                    <TableHead className="font-mono text-xs uppercase text-muted-foreground">Confidence</TableHead>
                    <TableHead className="text-right font-mono text-xs uppercase text-muted-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockHistory.map((item, i) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      key={item.id} 
                      className="group hover:bg-white/5 transition-colors border-white/5 cursor-pointer"
                    >
                      <TableCell className="text-xs font-mono text-muted-foreground">{item.date}</TableCell>
                      <TableCell className="max-w-[300px] text-sm text-foreground truncate">
                        {item.text}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border-white/10 ${
                            item.status === "Verified" ? "bg-emerald-500/20 text-emerald-400" : "bg-destructive/20 text-destructive"
                          }`}
                        >
                          {item.status === "Verified" ? (
                            <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 mr-1 inline" />
                          )}
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold font-heading">{item.confidence}%</span>
                          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full ${
                                item.status === "Verified" ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-destructive shadow-[0_0_10px_#ef4444]"
                              }`}
                              style={{ width: `${item.confidence}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 rounded-full">
                          <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="sr-only">View Report</span>
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
