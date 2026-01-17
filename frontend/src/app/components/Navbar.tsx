"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (path: string) => {
    return pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          ImageShare
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={`${isActive("/")} transition-colors`}>
            Home
          </Link>
          <Link
            href="/leaderboard"
            className={`${isActive("/leaderboard")} transition-colors`}
          >
            Leaderboard
          </Link>
          <Link
            href="/share"
            className={`${isActive("/share")} transition-colors`}
          >
            Share
          </Link>
          <Link
            href="/mint"
            className={`${isActive("/mint")} transition-colors`}
          >
            Mint Account
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <ConnectButton
              showBalance={false}
              accountStatus="address"
              chainStatus="icon"
            />
          )}
        </div>
      </div>
    </nav>
  );
}
