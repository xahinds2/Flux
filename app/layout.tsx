import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: { default: "Flux — Marketplace", template: "%s · Flux" },
  description: "Buy and sell anything. Message sellers directly on WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider signInFallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/profile">
      <html lang="en">
        <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
          <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="text-xl font-bold tracking-tight">
                Flux
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/" className="text-slate-600 hover:text-slate-900">
                  Browse
                </Link>
                <SignedIn>
                  <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
                    Dashboard
                  </Link>
                  <Link href="/new" className="rounded-lg bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800">
                    Sell
                  </Link>
                  <div className="h-7 w-7">
                    <UserButton />
                  </div>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal" forceRedirectUrl="/new">
                    <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800">Sell</button>
                  </SignInButton>
                </SignedOut>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
