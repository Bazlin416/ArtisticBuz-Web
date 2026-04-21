import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Section {
  id: string
  title: string
}

interface PolicyLayoutProps {
  title: string
  subtitle: string
  lastUpdated: string
  effectiveDate: string
  sections: Section[]
  children: React.ReactNode
}

export function PolicyLayout({
  title,
  subtitle,
  lastUpdated,
  effectiveDate,
  sections,
  children,
}: PolicyLayoutProps) {
  return (
    <main className="bg-gray-50 min-h-screen">

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-800 text-white py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-emerald-200 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{title}</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-emerald-100 text-lg max-w-2xl leading-relaxed">{subtitle}</p>

          <div className="flex flex-wrap gap-6 mt-8 text-sm text-emerald-200">
            <span>Last updated: <strong className="text-white">{lastUpdated}</strong></span>
            <span>Effective: <strong className="text-white">{effectiveDate}</strong></span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-16">
        <div className="grid lg:grid-cols-[260px_1fr] gap-12 items-start">

          {/* Sticky Table of Contents */}
          <aside className="hidden lg:block sticky top-28">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Contents
              </p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-gray-600 hover:text-emerald-600 hover:pl-1 transition-all py-1 border-l-2 border-transparent hover:border-emerald-400 pl-3"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm">
              <p className="font-semibold text-emerald-800 mb-1">Questions?</p>
              <p className="text-emerald-700 text-xs mb-3">Our team is happy to help.</p>
              <a
                href="mailto:info@artisticbuz.com"
                className="text-emerald-600 font-medium hover:underline text-xs"
              >
                info@artisticbuz.com
              </a>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-6">
            {children}

            {/* Back link */}
            <div className="pt-8 border-t border-gray-200">
              <Link
                href="/"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                ← Back to Home
              </Link>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}

export function PolicySection({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 scroll-mt-28"
    >
      <div className="flex items-start gap-4 mb-5">
        <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">
          {number}
        </span>
        <h2 className="text-xl font-bold text-gray-900 pt-1.5">{title}</h2>
      </div>
      <div className="text-gray-700 text-sm leading-relaxed space-y-3 pl-13">
        {children}
      </div>
    </section>
  )
}
