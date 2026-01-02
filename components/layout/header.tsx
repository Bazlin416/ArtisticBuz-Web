'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu, X, User, LogOut, Crown, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isSubscribed, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-[#19213B] border-b border-white/5 transition-shadow',
        isScrolled && 'shadow-lg'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/ArtisticBuz_logo.png"
              alt="ArtisticBuz Logo"
              width={80}
              height={80}
              priority
              className="rounded-md scale-150"
            />
            <h1 className="text-lg md:text-xl font-bold text-white">
              Hair Graft Calculator
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                {item.label === 'Blog' && <BookOpen className="w-4 h-4" />}
                {item.label}
              </Link>
            ))}
          </nav>
          {/* Desktop CTA / User */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="max-w-[140px] truncate">{user.email}</span>
                    {isSubscribed && (
                      <Crown className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-[#1F2747] border border-white/10 text-gray-200"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem disabled>
                    <span className="text-xs text-gray-400">
                      {isSubscribed ? 'Premium Subscriber' : 'Free Account'}
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-white/10" />

                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-red-400 focus:text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

          </div>


          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 pt-4 pb-6">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-emerald-400 font-medium"
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-white/10">
                {user && (
                  <Button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut();
                    }}
                    variant="outline"
                    className="w-full border-red-500/40 text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                )}

              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}







