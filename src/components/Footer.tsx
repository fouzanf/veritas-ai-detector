export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-6 mt-auto">
      <div className="container max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Veritas AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
