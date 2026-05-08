export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-2xl py-8 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
      <div className="container max-w-7xl mx-auto px-4 text-center relative z-10">
        <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">
          © {new Date().getFullYear()} Veritas AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
