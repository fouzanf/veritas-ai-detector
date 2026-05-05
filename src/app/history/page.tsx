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
    <div className="flex-1 flex flex-col items-center p-4 md:p-8 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <main className="w-full max-w-5xl z-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <History className="h-8 w-8 text-primary" />
              Analysis History
            </h1>
            <p className="text-muted-foreground">
              Review your previous news verification reports and insights.
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard")} className="bg-primary hover:bg-primary/90">
            <Search className="mr-2 h-4 w-4" />
            New Analysis
          </Button>
        </div>

        <Card className="shadow-md border-border/50">
          <CardHeader>
            <CardTitle>Past Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="max-w-[300px]">Content Snippet</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-muted/50 transition-colors">
                    <TableCell className="text-sm font-medium">{item.date}</TableCell>
                    <TableCell className="max-w-[300px] text-sm text-muted-foreground truncate">
                      {item.text}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.status === "Verified" ? "default" : "destructive"}
                        className={`px-2 py-0.5 text-xs ${
                          item.status === "Verified" ? "bg-emerald-500 hover:bg-emerald-600" : ""
                        }`}
                      >
                        {item.status === "Verified" ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 mr-1" />
                        )}
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{item.confidence}%</span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full ${
                              item.status === "Verified" ? "bg-emerald-500" : "bg-destructive"
                            }`}
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="sr-only">View Report</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
