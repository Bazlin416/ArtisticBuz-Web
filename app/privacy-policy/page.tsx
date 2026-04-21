import type { Metadata } from 'next'
import { PolicyLayout, PolicySection } from '@/components/layout/policy-layout'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How ArtisticBuz collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://artisticbuz.com/privacy-policy' },
}

const LAST_UPDATED = 'April 21, 2026'
const EFFECTIVE_DATE = 'April 21, 2026'

const SECTIONS = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'who-we-are', title: '2. Who We Are' },
  { id: 'information-collected', title: '3. Information We Collect' },
  { id: 'how-we-use', title: '4. How We Use Your Information' },
  { id: 'data-sharing', title: '5. Data Sharing & Third Parties' },
  { id: 'data-retention', title: '6. Data Retention' },
  { id: 'security', title: '7. Data Security' },
  { id: 'your-rights', title: '8. Your Rights' },
  { id: 'international', title: '9. International Transfers' },
  { id: 'children', title: '10. Children\'s Privacy' },
  { id: 'updates', title: '11. Policy Updates' },
  { id: 'contact', title: '12. Contact Us' },
]

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="We are committed to protecting your personal information and being transparent about what we collect and why. This policy applies to all users of the ArtisticBuz platform."
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      sections={SECTIONS}
    >

      <PolicySection id="introduction" number="1" title="Introduction">
        <p>
          ArtisticBuz ("we", "us", or "our") operates the hair graft calculator and
          related services available at <strong>artisticbuz.com</strong>. This Privacy
          Policy describes how we collect, use, disclose, and safeguard your information
          when you visit our website, create an account, or use our services.
        </p>
        <p>
          By using ArtisticBuz, you consent to the practices described in this policy.
          If you do not agree, please do not access or use our services.
        </p>
      </PolicySection>

      <PolicySection id="who-we-are" number="2" title="Who We Are">
        <p>
          ArtisticBuz is a product of <strong>Buzlin Holdings Inc.</strong>, a company
          incorporated under the laws of Alberta, Canada, with its principal office in
          Edmonton, Alberta.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 text-xs space-y-1">
          <p><span className="font-semibold">Legal entity:</span> Buzlin Holdings Inc.</p>
          <p><span className="font-semibold">Operating as:</span> ArtisticBuz</p>
          <p><span className="font-semibold">Location:</span> Edmonton, Alberta, Canada</p>
          <p><span className="font-semibold">Email:</span> info@artisticbuz.com</p>
        </div>
        <p>
          For privacy purposes, Buzlin Holdings Inc. is the data controller responsible
          for your personal information collected through this platform.
        </p>
      </PolicySection>

      <PolicySection id="information-collected" number="3" title="Information We Collect">
        <p>We collect information in the following categories:</p>

        <p className="font-semibold text-gray-900 mt-4">a) Information You Provide Directly</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account registration: full name, email address, password</li>
          <li>Consultation form: name, phone number, country, date of birth, hair loss history, medical conditions, photos you voluntarily upload</li>
          <li>Communications you initiate with us via email</li>
        </ul>

        <p className="font-semibold text-gray-900 mt-4">b) Payment Information</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Payment is processed entirely by <strong>Stripe, Inc.</strong> We do not store your card number, CVV, or full payment details</li>
          <li>We retain your Stripe Customer ID and subscription status to manage your access</li>
        </ul>

        <p className="font-semibold text-gray-900 mt-4">c) Calculator Usage Data</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Hair loss pattern selections, hair type, desired density, and gender preference used in the calculator</li>
          <li>Calculation history stored locally in your browser (localStorage) — not transmitted to our servers</li>
        </ul>

        <p className="font-semibold text-gray-900 mt-4">d) Automatically Collected Data</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>IP address (used to detect your country for currency localisation; not stored long-term)</li>
          <li>Browser type, operating system, referring URL, pages visited, and timestamps</li>
          <li>Cookies and similar tracking technologies (see our <a href="/cookie-policy" className="text-emerald-600 hover:underline">Cookie Policy</a>)</li>
        </ul>
      </PolicySection>

      <PolicySection id="how-we-use" number="4" title="How We Use Your Information">
        <p>We use your information for the following purposes:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><span className="font-semibold">Service delivery:</span> Creating and managing your account, processing payments, granting access to the calculator and consultation features</li>
          <li><span className="font-semibold">Consultation routing:</span> Forwarding your completed consultation form to our specialist team via encrypted email</li>
          <li><span className="font-semibold">Currency localisation:</span> Using your approximate location (country) to display pricing in your local currency</li>
          <li><span className="font-semibold">Communications:</span> Sending transactional emails such as payment confirmations and support responses</li>
          <li><span className="font-semibold">Security & fraud prevention:</span> Monitoring for unauthorised access and abuse of our platform</li>
          <li><span className="font-semibold">Analytics:</span> Understanding how users interact with our site to improve the product (via Meta Pixel and server-side logging)</li>
          <li><span className="font-semibold">Legal compliance:</span> Meeting obligations under applicable Canadian and international laws</li>
        </ul>
        <p className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800">
          <strong>Medical disclaimer:</strong> The graft estimates produced by the ArtisticBuz calculator are for informational purposes only and do not constitute medical advice. Always consult a qualified medical professional before making any treatment decisions.
        </p>
      </PolicySection>

      <PolicySection id="data-sharing" number="5" title="Data Sharing & Third Parties">
        <p>
          We do not sell your personal information. We share data only with the following
          trusted service providers, each bound by strict data processing agreements:
        </p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 rounded-tl-lg font-semibold text-gray-700">Provider</th>
                <th className="text-left p-3 font-semibold text-gray-700">Purpose</th>
                <th className="text-left p-3 rounded-tr-lg font-semibold text-gray-700">Data Shared</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-3 font-medium">Supabase</td>
                <td className="p-3 text-gray-600">Authentication & database</td>
                <td className="p-3 text-gray-600">Email, name, subscription status</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Stripe, Inc.</td>
                <td className="p-3 text-gray-600">Payment processing</td>
                <td className="p-3 text-gray-600">Email, country, payment details</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Sanity</td>
                <td className="p-3 text-gray-600">Content management</td>
                <td className="p-3 text-gray-600">None (read-only CMS)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">Meta (Facebook)</td>
                <td className="p-3 text-gray-600">Conversion tracking (Pixel)</td>
                <td className="p-3 text-gray-600">Anonymised purchase events</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">ipapi.co</td>
                <td className="p-3 text-gray-600">Country detection</td>
                <td className="p-3 text-gray-600">IP address (transient)</td>
              </tr>
              <tr>
                <td className="p-3 font-medium">ExchangeRate-API</td>
                <td className="p-3 text-gray-600">Currency conversion</td>
                <td className="p-3 text-gray-600">None</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          We may also disclose your information if required by law, court order, or
          government authority, or to protect the rights, property, or safety of
          Buzlin Holdings Inc., its users, or the public.
        </p>
      </PolicySection>

      <PolicySection id="data-retention" number="6" title="Data Retention">
        <p>We retain your personal data only for as long as necessary:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><span className="font-semibold">Account data</span> — retained while your account is active, and for up to 2 years after account deletion for legal and audit purposes</li>
          <li><span className="font-semibold">Subscription records</span> — retained for 7 years to comply with Canadian financial record-keeping requirements</li>
          <li><span className="font-semibold">Consultation form submissions</span> — retained for 3 years from submission date</li>
          <li><span className="font-semibold">Calculation history</span> — stored only in your browser's localStorage; deleted when you clear your browser data or use the "Clear history" button in the calculator</li>
        </ul>
        <p className="mt-3">
          You may request deletion of your account and associated data at any time by
          contacting us at <a href="mailto:info@artisticbuz.com" className="text-emerald-600 hover:underline">info@artisticbuz.com</a>.
        </p>
      </PolicySection>

      <PolicySection id="security" number="7" title="Data Security">
        <p>
          We implement appropriate technical and organisational safeguards to protect
          your personal information, including:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>TLS/SSL encryption for all data in transit</li>
          <li>Supabase Row-Level Security (RLS) policies ensuring users can only access their own data</li>
          <li>Payment processing handled entirely by Stripe's PCI-DSS compliant infrastructure</li>
          <li>Server-side email recipient validation — client-submitted recipient addresses are never honoured</li>
          <li>Environment-based secret management (no credentials in source code)</li>
        </ul>
        <p className="mt-3">
          While we take all reasonable steps to protect your data, no internet transmission
          or electronic storage method is 100% secure. If you suspect unauthorised access
          to your account, please contact us immediately.
        </p>
      </PolicySection>

      <PolicySection id="your-rights" number="8" title="Your Rights">
        <p>
          Depending on your location, you may have the following rights regarding your
          personal data. We honour requests under both Canadian privacy law (PIPEDA) and,
          where applicable, the EU General Data Protection Regulation (GDPR):
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li><span className="font-semibold">Access:</span> Request a copy of the personal data we hold about you</li>
          <li><span className="font-semibold">Rectification:</span> Request correction of inaccurate or incomplete data</li>
          <li><span className="font-semibold">Erasure:</span> Request deletion of your personal data ("right to be forgotten")</li>
          <li><span className="font-semibold">Restriction:</span> Request that we limit how we process your data</li>
          <li><span className="font-semibold">Portability:</span> Receive your data in a structured, machine-readable format</li>
          <li><span className="font-semibold">Objection:</span> Object to processing based on legitimate interests</li>
          <li><span className="font-semibold">Withdraw consent:</span> Where processing is based on consent, withdraw it at any time without affecting the lawfulness of prior processing</li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, email us at{' '}
          <a href="mailto:info@artisticbuz.com" className="text-emerald-600 hover:underline">
            info@artisticbuz.com
          </a>{' '}
          with your request. We will respond within 30 days.
        </p>
      </PolicySection>

      <PolicySection id="international" number="9" title="International Transfers">
        <p>
          Buzlin Holdings Inc. is based in Canada. Some of our service providers (Supabase,
          Stripe, Meta) may process data in the United States or other jurisdictions.
          Where data is transferred outside Canada, we ensure appropriate safeguards are
          in place — including standard contractual clauses and adherence to each provider's
          data processing agreements.
        </p>
      </PolicySection>

      <PolicySection id="children" number="10" title="Children's Privacy">
        <p>
          ArtisticBuz is not directed to individuals under the age of 18. We do not
          knowingly collect personal information from minors. If you believe a child has
          provided us with personal information, please contact us and we will promptly
          delete it.
        </p>
      </PolicySection>

      <PolicySection id="updates" number="11" title="Policy Updates">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our
          practices, technology, or legal requirements. When we make material changes, we
          will update the "Last updated" date at the top of this page. We encourage you
          to review this policy periodically.
        </p>
        <p>
          Continued use of ArtisticBuz after any changes constitutes your acceptance of
          the updated policy.
        </p>
      </PolicySection>

      <PolicySection id="contact" number="12" title="Contact Us">
        <p>
          For any privacy-related questions, requests, or concerns, please contact our
          Privacy Officer:
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
