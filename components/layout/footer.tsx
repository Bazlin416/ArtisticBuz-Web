import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4">

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src="/ArtisticBuz_logo.png"
                alt="ArtisticBuz Logo"
                width={80}
                height={80}
                priority
                className="rounded-md scale-150"
              />
              <div className="leading-tight">
                <h2 className="text-xl font-bold text-white">
                  Hair Graft Calculator
                </h2>
                <p className="text-xs text-gray-400">
                  Precision • Confidence • Natural Results
                </p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-gray-400 max-w-md">
              ArtisticBuz provides medically guided hair restoration solutions,
              combining advanced technology with aesthetic precision to help
              you restore hair, confidence, and self-image.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Explore
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/blogs"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Contact
            </h3>

            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-gray-400">
                  info@artisticbuz.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <p className="text-xs text-gray-500">
              © 2025 ArtisticBuz. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/privacy-policy"
                className="text-xs text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms-of-service"
                className="text-xs text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Terms of Service
              </Link>

              <Link
                href="/cookie-policy"
                className="text-xs text-gray-400 hover:text-emerald-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}



