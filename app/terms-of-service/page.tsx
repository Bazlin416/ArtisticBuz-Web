import type { Metadata } from 'next'
import { PolicyLayout, PolicySection } from '@/components/layout/policy-layout'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions governing your use of the ArtisticBuz platform.',
  alternates: { canonical: 'https://artisticbuz.com/terms-of-service' },
}

const LAST_UPDATED = 'April 21, 2026'
const EFFECTIVE_DATE = 'April 21, 2026'

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'about', title: '2. About ArtisticBuz' },
  { id: 'eligibility', title: '3. Eligibility' },
  { id: 'accounts', title: '4. Accounts & Registration' },
  { id: 'subscriptions', title: '5. Subscriptions & Payments' },
  { id: 'use', title: '6. Permitted Use' },
  { id: 'medical', title: '7. Medical Disclaimer' },
  { id: 'ip', title: '8. Intellectual Property' },
  { id: 'ugc', title: '9. User-Submitted Content' },
  { id: 'third-party', title: '10. Third-Party Services' },
  { id: 'disclaimer', title: '11. Disclaimer of Warranties' },
  { id: 'liability', title: '12. Limitation of Liability' },
  { id: 'indemnification', title: '13. Indemnification' },
  { id: 'termination', title: '14. Termination' },
  { id: 'governing-law', title: '15. Governing Law' },
  { id: 'changes', title: '16. Changes to Terms' },
  { id: 'contact', title: '17. Contact' },
]

export default function TermsOfServicePage() {
  return (
    <PolicyLayout
      title="Terms of Service"
      subtitle="Please read these terms carefully before using ArtisticBuz. By accessing our platform, you agree to be bound by the terms described below."
      lastUpdated={LAST_UPDATED}
      effectiveDate={EFFECTIVE_DATE}
      sections={SECTIONS}
    >

      <PolicySection id="acceptance" number="1" title="Acceptance of Terms">
        <p>
          These Terms of Service ("Terms") constitute a legally binding agreement between
          you and <strong>Buzlin Holdings Inc.</strong> (operating as <strong>ArtisticBuz</strong>)
          governing your access to and use of the ArtisticBuz website and services located
          at <strong>artisticbuz.com</strong>.
        </p>
        <p>
          By accessing or using ArtisticBuz in any way — including creating an account,
          purchasing a subscription, or simply browsing — you confirm that you have read,
          understood, and agree to be bound by these Terms and our{' '}
          <a href="/privacy-policy" className="text-emerald-600 hover:underline">Privacy Policy</a>.
        </p>
        <p>
          If you do not agree to these Terms, you must not access or use our services.
        </p>
      </PolicySection>

      <PolicySection id="about" number="2" title="About ArtisticBuz">
        <p>
          ArtisticBuz is a professional hair restoration information platform that provides:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>A clinically guided hair graft estimation calculator based on the Norwood scale</li>
          <li>Local currency pricing estimates for hair transplant procedures</li>
          <li>An interactive 3D scalp visualisation tool</li>
          <li>A specialist consultation form submission system</li>
          <li>Educational content on hair loss and restoration</li>
          <li>A directory of vetted partner hair transplant clinics</li>
        </ul>
        <p className="mt-3">
          ArtisticBuz is a product of{' '}
          <a href="https://buzlinholdingsinc.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
            Buzlin Holdings Inc.
          </a>
          , a company incorporated in Alberta, Canada.
        </p>
      </PolicySection>

      <PolicySection id="eligibility" number="3" title="Eligibility">
        <p>
          You must be at least <strong>18 years of age</strong> to use ArtisticBuz or to
          purchase a subscription. By using the platform, you represent and warrant that
          you meet this age requirement.
        </p>
        <p>
          ArtisticBuz is available globally. However, certain features — particularly
          payment processing — may not be available in all countries due to Stripe's
          regional limitations.
        </p>
      </PolicySection>

      <PolicySection id="accounts" number="4" title="Accounts & Registration">
        <p>
          To access the full calculator and consultation features, you must register for
          an account. You agree to:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Provide accurate, complete, and current information during registration</li>
          <li>Maintain the security of your password and not share your credentials</li>
          <li>Notify us immediately at <a href="mailto:info@artisticbuz.com" className="text-emerald-600 hover:underline">info@artisticbuz.com</a> if you suspect unauthorised access to your account</li>
          <li>Accept responsibility for all activity that occurs under your account</li>
        </ul>
        <p className="mt-3">
          We reserve the right to suspend or terminate accounts that contain inaccurate
          information, are used in violation of these Terms, or are otherwise abused.
        </p>
      </PolicySection>

      <PolicySection id="subscriptions" number="5" title="Subscriptions & Payments">
        <p className="font-semibold text-gray-900">14-Day Access Plan</p>
        <p>
          ArtisticBuz offers a <strong>one-time payment</strong> for 14 days of full
          platform access. This is not a recurring subscription — you will not be charged
          again automatically. Access expires 14 days from the date of purchase.
        </p>

        <p className="font-semibold text-gray-900 mt-4">Payment Processing</p>
        <p>
          All payments are processed securely by <strong>Stripe, Inc.</strong> By making
          a purchase, you also agree to Stripe's{' '}
          <a href="https://stripe.com/legal" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
            Terms of Service
          </a>. ArtisticBuz does not store your card details.
        </p>

        <p className="font-semibold text-gray-900 mt-4">Pricing</p>
        <p>
          Prices are displayed in your local currency based on your detected location.
          All prices are inclusive of applicable taxes where required. We reserve the right
          to change pricing at any time; changes will not affect access already purchased.
        </p>

        <p className="font-semibold text-gray-900 mt-4">Refund Policy</p>
        <p>
          Due to the digital nature of our service and the immediate access granted upon
          payment, <strong>all sales are final and non-refundable</strong>, except where
          required by applicable consumer protection laws. If you believe you are entitled
          to a refund under applicable law, please contact us within 14 days of purchase.
        </p>
      </PolicySection>

      <PolicySection id="use" number="6" title="Permitted Use">
        <p>You may use ArtisticBuz for personal, non-commercial purposes only. You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Reproduce, resell, or redistribute any part of the platform or its content without written permission</li>
          <li>Use automated tools (bots, scrapers, crawlers) to extract content or data</li>
          <li>Attempt to gain unauthorised access to our systems, databases, or other users' accounts</li>
          <li>Upload or transmit malicious code, viruses, or harmful content</li>
          <li>Impersonate any person or entity, or falsely represent your affiliation with any person or entity</li>
          <li>Use the platform in any way that violates applicable local, national, or international laws</li>
          <li>Share your account credentials to provide access to others without a valid subscription</li>
        </ul>
      </PolicySection>

      <PolicySection id="medical" number="7" title="Medical Disclaimer">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900 text-sm">
          <p className="font-bold text-base mb-2">Important — Please Read Carefully</p>
          <p>
            The hair graft estimates, pricing information, and all other content provided
            by ArtisticBuz are for <strong>informational and educational purposes only</strong>.
            They do not constitute medical advice, diagnosis, or treatment recommendations.
          </p>
          <p className="mt-2">
            Graft estimates are based on generalised clinical frameworks (such as the
            Norwood scale) and statistical averages. Actual graft requirements vary
            significantly between individuals depending on donor hair density, scalp
            laxity, hair characteristics, and the treating surgeon's assessment.
          </p>
          <p className="mt-2">
            Always consult a <strong>qualified, licensed medical professional</strong> before
            making any decisions about hair restoration treatments. ArtisticBuz and
            Buzlin Holdings Inc. are not liable for any decisions made based on information
            obtained from this platform.
          </p>
        </div>
      </PolicySection>

      <PolicySection id="ip" number="8" title="Intellectual Property">
        <p>
          All content on ArtisticBuz — including but not limited to text, graphics,
          logos, images, 3D models, software, database content, and the calculator
          methodology — is the property of Buzlin Holdings Inc. or its licensors and
          is protected by Canadian and international intellectual property laws.
        </p>
        <p>
          You are granted a limited, non-exclusive, non-transferable, revocable licence
          to access and use the platform solely for personal, non-commercial purposes in
          accordance with these Terms. No other rights are granted.
        </p>
        <p>
          You may not copy, modify, distribute, transmit, display, perform, reproduce,
          publish, license, create derivative works from, transfer, or sell any content
          obtained from ArtisticBuz without our express written consent.
        </p>
      </PolicySection>

      <PolicySection id="ugc" number="9" title="User-Submitted Content">
        <p>
          If you submit content to ArtisticBuz — including consultation form details,
          photos, or messages — you represent that you own or have the necessary rights
          to share such content, and that it does not violate any third-party rights or
          applicable laws.
        </p>
        <p>
          You grant Buzlin Holdings Inc. a limited, royalty-free licence to use your
          submitted content solely for the purpose of providing the requested service
          (i.e., forwarding your consultation to our specialist team). We will not
          publish or share your personal submissions publicly.
        </p>
      </PolicySection>

      <PolicySection id="third-party" number="10" title="Third-Party Services">
        <p>
          ArtisticBuz integrates with third-party services including Supabase, Stripe,
          Sanity, Meta, and others. Your use of these services within our platform is
          subject to their respective terms of service and privacy policies. We are not
          responsible for the practices or content of any third-party services.
        </p>
        <p>
          Links to partner clinic websites are provided for convenience. We do not endorse
          or take responsibility for the content, services, or practices of linked external
          websites.
        </p>
      </PolicySection>

      <PolicySection id="disclaimer" number="11" title="Disclaimer of Warranties">
        <p>
          ArtisticBuz is provided on an <strong>"as is" and "as available"</strong> basis
          without warranties of any kind, express or implied. To the fullest extent
          permitted by applicable law, Buzlin Holdings Inc. disclaims all warranties,
          including but not limited to:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
          <li>Warranties that the platform will be uninterrupted, error-free, or free of viruses or harmful components</li>
          <li>Warranties regarding the accuracy, completeness, or reliability of any content or estimates</li>
        </ul>
      </PolicySection>

      <PolicySection id="liability" number="12" title="Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Buzlin Holdings Inc. and its directors,
          officers, employees, and agents shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages — including loss of profits, data,
          or goodwill — arising out of or in connection with your use of, or inability to
          use, ArtisticBuz.
        </p>
        <p>
          In no event shall our total cumulative liability to you exceed the greater of
          (a) the amount you paid for a subscription in the 12 months preceding the claim,
          or (b) CAD $50.
        </p>
        <p>
          Some jurisdictions do not allow the exclusion of certain warranties or limitation
          of certain damages. In such jurisdictions, our liability is limited to the
          maximum extent permitted by law.
        </p>
      </PolicySection>

      <PolicySection id="indemnification" number="13" title="Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless Buzlin Holdings Inc. and its
          affiliates, directors, officers, employees, and agents from any claims,
          liabilities, damages, losses, and expenses — including reasonable legal fees —
          arising out of or relating to your use of ArtisticBuz, your violation of these
          Terms, or your violation of any third-party rights.
        </p>
      </PolicySection>

      <PolicySection id="termination" number="14" title="Termination">
        <p>
          We may suspend or permanently terminate your account and access to ArtisticBuz
          at our discretion, with or without notice, for reasons including but not limited
          to violation of these Terms, fraudulent activity, or extended inactivity.
        </p>
        <p>
          You may delete your account at any time by contacting{' '}
          <a href="mailto:info@artisticbuz.com" className="text-emerald-600 hover:underline">
            info@artisticbuz.com
          </a>. Deletion does not entitle you to a refund for any unused portion of a
          14-day access period.
        </p>
        <p>
          Upon termination, your right to access the platform ceases immediately.
          Provisions of these Terms that by their nature should survive termination
          (including intellectual property, limitation of liability, and governing law)
          will continue to apply.
        </p>
      </PolicySection>

      <PolicySection id="governing-law" number="15" title="Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of
          the <strong>Province of Alberta, Canada</strong>, without regard to its conflict
          of law provisions.
        </p>
        <p>
          Any disputes arising from these Terms or your use of ArtisticBuz shall be
          subject to the exclusive jurisdiction of the courts of Alberta, Canada.
        </p>
      </PolicySection>

      <PolicySection id="changes" number="16" title="Changes to Terms">
        <p>
          We reserve the right to update or modify these Terms at any time. Material
          changes will be communicated by updating the "Last updated" date on this page.
          Your continued use of ArtisticBuz after any changes constitutes your acceptance
          of the revised Terms.
        </p>
        <p>
          We encourage you to review these Terms periodically to stay informed of any
          updates.
        </p>
      </PolicySection>

      <PolicySection id="contact" number="17" title="Contact">
        <p>
          If you have questions about these Terms, please contact us:
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
