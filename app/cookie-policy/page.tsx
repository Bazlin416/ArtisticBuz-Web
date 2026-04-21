import type { Metadata } from 'next'
import { PolicyLayout, PolicySection } from '@/components/layout/policy-layout'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How ArtisticBuz uses cookies and similar tracking technologies.',
  alternates: { canonical: 'https://artisticbuz.com/cookie-policy' },
}

const LAST_UPDATED = 'April 21, 2026'
const EFFECTIVE_DATE = 'April 21, 2026'

const SECTIONS = [
  { id: 'what-are-cookies', title: '1. What Are Cookies?' },
  { id: 'types', title: '2. Types of Cookies We Use' },
  { id: 'local-storage', title: '3. Local Storage & Browser Data' },
  { id: 'third-party', title: '4. Third-Party Cookies' },
  { id: 'consent', title: '5. Your Consent' },
  { id: 'managing', title: '6. Managing & Disabling Cookies' },
  { id: 'updates', title: '7. Policy Updates' },
  { id: 'contact', title: '8. Contact Us' },
]

export default function CookiePolicyPage() {
  return (
    <PolicyLayout
      title="Cookie Policy"
      subtitle="This policy explains how ArtisticBuz uses cookies and similar technologies, what data they collect, and how you can manage your preferences."
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      sections={SECTIONS}
    >

      <PolicySection id="what-are-cookies" number="1" title="What Are Cookies?">
        <p>
          Cookies are small text files placed on your device (computer, tablet, or mobile)
          when you visit a website. They are widely used to make websites function correctly,
          work more efficiently, and to provide information to site owners.
        </p>
        <p>
          Cookies can be <strong>session cookies</strong> (deleted when you close your browser)
          or <strong>persistent cookies</strong> (remain on your device for a set period or
          until manually deleted).
        </p>
        <p>
          They can be set by the website you are visiting (<strong>first-party cookies</strong>)
          or by third-party services integrated into that site (<strong>third-party cookies</strong>).
        </p>
      </PolicySection>

      <PolicySection id="types" number="2" title="Types of Cookies We Use">
        <p>ArtisticBuz uses the following categories of cookies:</p>

        <div className="space-y-4 mt-4">
          {/* Strictly Necessary */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-emerald-50">
              <p className="font-semibold text-gray-900 text-sm">Strictly Necessary</p>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Always Active
              </span>
            </div>
            <div className="px-5 py-4 text-xs space-y-2 text-gray-600">
              <p>These cookies are essential for the platform to function. They cannot be disabled.</p>
              <table className="w-full mt-2">
                <thead>
                  <tr className="text-gray-500">
                    <th className="text-left py-1 font-medium">Cookie</th>
                    <th className="text-left py-1 font-medium">Provider</th>
                    <th className="text-left py-1 font-medium">Purpose</th>
                    <th className="text-left py-1 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2 font-mono">sb-*</td>
                    <td className="py-2">Supabase</td>
                    <td className="py-2">Authentication session token</td>
                    <td className="py-2">Session / 1 week</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">cookie-consent</td>
                    <td className="py-2">ArtisticBuz</td>
                    <td className="py-2">Stores your cookie consent choice</td>
                    <td className="py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-blue-50">
              <p className="font-semibold text-gray-900 text-sm">Analytics & Performance</p>
              <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                Requires Consent
              </span>
            </div>
            <div className="px-5 py-4 text-xs space-y-2 text-gray-600">
              <p>These cookies help us understand how visitors interact with the site so we can improve it.</p>
              <table className="w-full mt-2">
                <thead>
                  <tr className="text-gray-500">
                    <th className="text-left py-1 font-medium">Cookie</th>
                    <th className="text-left py-1 font-medium">Provider</th>
                    <th className="text-left py-1 font-medium">Purpose</th>
                    <th className="text-left py-1 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2 font-mono">_fbp</td>
                    <td className="py-2">Meta (Facebook)</td>
                    <td className="py-2">Conversion tracking via Meta Pixel</td>
                    <td className="py-2">90 days</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono">_fbc</td>
                    <td className="py-2">Meta (Facebook)</td>
                    <td className="py-2">Click ID for ad attribution</td>
                    <td className="py-2">90 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <p className="mt-4">
          We do <strong>not</strong> use cookies for targeted advertising or retargeting.
          We do not share cookie data with advertising networks for profiling purposes.
        </p>
      </PolicySection>

      <PolicySection id="local-storage" number="3" title="Local Storage & Browser Data">
        <p>
          In addition to cookies, ArtisticBuz uses your browser's{' '}
          <strong>localStorage</strong> to store certain non-personal data locally on your
          device. This data is never transmitted to our servers.
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 rounded-tl-lg font-semibold text-gray-700">Key</th>
                <th className="text-left p-3 font-semibold text-gray-700">Purpose</th>
                <th className="text-left p-3 rounded-tr-lg font-semibold text-gray-700">Deleted when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-3 font-mono">ab_calc_history</td>
                <td className="p-3 text-gray-600">Stores your last 5 graft calculation results for the "Recent Estimates" panel</td>
                <td className="p-3 text-gray-600">You click "Clear history" or clear browser data</td>
              </tr>
              <tr>
                <td className="p-3 font-mono">ab_currency_*</td>
                <td className="p-3 text-gray-600">Caches your detected country and local exchange rate to avoid repeat API calls</td>
                <td className="p-3 text-gray-600">Cache expires automatically or on browser data clear</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          You can clear localStorage at any time via your browser's developer tools
          or by clearing your browser's site data.
        </p>
      </PolicySection>

      <PolicySection id="third-party" number="4" title="Third-Party Cookies">
        <p>
          Some features of ArtisticBuz involve third-party services that may set their
          own cookies on your device:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="font-semibold">Supabase:</span> Sets session cookies to maintain
            your authenticated login state. See Supabase's{' '}
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              Privacy Policy
            </a>.
          </li>
          <li>
            <span className="font-semibold">Meta Pixel:</span> Placed to track purchase
            conversions (e.g., when a subscription is completed). No personal data is
            transmitted — only anonymised event signals. See Meta's{' '}
            <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              Privacy Policy
            </a>.
          </li>
          <li>
            <span className="font-semibold">Stripe:</span> During the checkout process,
            Stripe may set fraud-detection cookies. See Stripe's{' '}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              Privacy Policy
            </a>.
          </li>
        </ul>
        <p className="mt-3">
          We have no control over third-party cookies. We recommend reviewing the respective
          privacy policies of each provider for full details.
        </p>
      </PolicySection>

      <PolicySection id="consent" number="5" title="Your Consent">
        <p>
          When you first visit ArtisticBuz, a cookie consent banner is displayed. By
          clicking "Accept", you consent to the use of analytics and performance cookies
          as described in this policy. Strictly necessary cookies are placed without
          requiring consent, as they are essential for the site to function.
        </p>
        <p>
          You may withdraw your consent at any time by clearing your browser cookies and
          refreshing the page, which will re-display the consent banner. Note that withdrawing
          consent will not affect the lawfulness of any processing that has already occurred.
        </p>
      </PolicySection>

      <PolicySection id="managing" number="6" title="Managing & Disabling Cookies">
        <p>
          You can control and manage cookies in several ways:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="font-semibold">Browser settings:</span> Most browsers allow you
            to block or delete cookies. Instructions vary by browser:
            <ul className="list-none mt-1 ml-4 space-y-0.5 text-emerald-700">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="hover:underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="hover:underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="hover:underline">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="hover:underline">Microsoft Edge</a></li>
            </ul>
          </li>
          <li>
            <span className="font-semibold">Opt out of Meta tracking:</span> Use Meta's{' '}
            <a href="https://www.facebook.com/ads/preferences" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              Ad Preferences
            </a>{' '}
            or the{' '}
            <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              Digital Advertising Alliance opt-out
            </a>.
          </li>
        </ul>
        <p className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800">
          <strong>Note:</strong> Disabling strictly necessary cookies (such as authentication
          cookies) will prevent you from logging in and using the calculator. Analytics cookies
          can be disabled without affecting core functionality.
        </p>
      </PolicySection>

      <PolicySection id="updates" number="7" title="Policy Updates">
        <p>
          We may update this Cookie Policy periodically to reflect changes in the
          technologies we use or applicable regulations. Any updates will be reflected
          by a revised "Last updated" date on this page.
        </p>
        <p>
          Significant changes may also be communicated via a notification on our website
          or by re-displaying the consent banner.
        </p>
      </PolicySection>

      <PolicySection id="contact" number="8" title="Contact Us">
        <p>
          If you have any questions or concerns about our use of cookies, please contact:
        </p>
        <div className="bg-gray-50 rounded-xl p-5 mt-3 space-y-2 text-xs">
          <p><span className="font-semibold">Company:</span> Buzlin Holdings Inc. (operating as ArtisticBuz)</p>
          <p><span className="font-semibold">Location:</span> Edmonton, Alberta, Canada</p>
          <p>
            <span className="font-semibold">Email:</span>{' '}
            <a href="mailto:info@artisticbuz.com" className="text-emerald-600 hover:underline">
              info@artisticbuz.com
            </a>
          </p>
          <p>
            <span className="font-semibold">Website:</span>{' '}
            <a href="https://buzlinholdingsinc.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              buzlinholdingsinc.com
            </a>
          </p>
        </div>
      </PolicySection>

    </PolicyLayout>
  )
}
