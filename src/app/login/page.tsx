"use client";

import { signIn } from "next-auth/react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { LoginBackground } from "@/components/LoginBackground";

export default function LoginPage() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden perspective-1000">
      <LoginBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-full max-w-md z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative group"
        >
          {/* Glowing Aura */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
          
          <Card className="relative bg-black/40 backdrop-blur-[20px] border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden preserve-3d">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <CardHeader className="space-y-6 text-center pt-12 translate-z-40">
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ 
                    y: [0, -12, 0],
                    rotateY: [0, 10, 0],
                    rotateX: [0, 5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4, 
                    ease: "easeInOut" 
                  }}
                  className="p-6 rounded-[2rem] bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(108,99,255,0.3)] relative z-50 preserve-3d"
                >
                  <ShieldCheck className="h-16 w-16 text-primary drop-shadow-[0_0_20px_rgba(108,99,255,0.8)]" />
                  <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl -z-10 opacity-50" />
                </motion.div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-4xl font-black tracking-tighter font-heading text-white">Veritas AI</CardTitle>
                <CardDescription className="text-muted-foreground text-base px-6 font-medium">
                  Authenticated Access Only
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="grid gap-8 pt-8 pb-12 translate-z-20 px-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group/input">
                    <input 
                      type="email" 
                      id="email"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 pt-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all peer group-hover/input:border-white/20"
                      placeholder=" "
                    />
                    <label 
                      htmlFor="email"
                      className="absolute left-4 top-4 text-muted-foreground text-[10px] font-bold uppercase tracking-widest transition-all pointer-events-none peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px]"
                    >
                      Email Address
                    </label>
                  </div>
                  <div className="relative group/input">
                    <input 
                      type="password" 
                      id="password"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 pt-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all peer group-hover/input:border-white/20"
                      placeholder=" "
                    />
                    <label 
                      htmlFor="password"
                      className="absolute left-4 top-4 text-muted-foreground text-[10px] font-bold uppercase tracking-widest transition-all pointer-events-none peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px]"
                    >
                      Password
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-px bg-white/5 flex-1" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">or continue with</span>
                  <div className="h-px bg-white/5 flex-1" />
                </div>

                <Button
                  variant="outline"
                  className="w-full h-16 bg-white/5 border-white/10 hover:bg-white/10 text-foreground transition-all duration-300 flex items-center justify-center gap-4 text-lg font-bold rounded-2xl relative overflow-hidden group/btn"
                  onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                >
                  <div className="absolute inset-0 shimmer opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                  Continue with Google
                </Button>

                <div className="flex items-center justify-center gap-2 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="avatar" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground font-bold tracking-tight">
                    TRUSTED BY 10K+ ANALYSTS
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 text-center pb-10 border-t border-white/5 pt-8 bg-white/[0.02]">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-10 font-bold leading-relaxed">
                Protected by military-grade neural encryption. <br/>
                All verifications are recorded on-chain.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
