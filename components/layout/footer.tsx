import Image from 'next/image';
import Link from 'next/link';
import { Mail, MapPin, Linkedin, Instagram, Facebook } from 'lucide-react';

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

            {/* Social Media */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://www.linkedin.com/company/artisticbuz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ArtisticBuz on LinkedIn"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4 text-gray-300" />
              </a>
              <a
                href="https://www.instagram.com/artisticbuz.ca"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ArtisticBuz on Instagram"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4 text-gray-300" />
              </a>
              <a
                href="https://www.facebook.com/ArtisticBuz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ArtisticBuz on Facebook"
                className="w-9 h-9 rounded-full bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4 text-gray-300" />
              </a>
            </div>
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
              {/* Location */}
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-gray-400">
                  Edmonton, Alberta, Canada
                </span>
              </li>

              {/* Email */}
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

            <div className="text-xs text-gray-500 space-y-1">
              <p>© 2025 ArtisticBuz. All rights reserved.</p>
              <p>
                ArtisticBuz is a product of{' '}
                <a
                  href="https://buzlinholdingsinc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition-colors underline underline-offset-2"
                >
                  Buzlin Holdings Inc.
                </a>
              </p>
            </div>

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



