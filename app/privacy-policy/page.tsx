import Link from 'next/link'

const LAST_UPDATED = 'January 2, 2026'

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-gray-50 py-24">
            <div className="container mx-auto px-4 max-w-4xl">

                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-600">
                        Your privacy matters to us. This policy explains how ArtisticBuz
                        collects, uses, and protects your information.
                    </p>
                    <p className="text-sm text-gray-500 mt-3">
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <article className="prose prose-emerald max-w-none">
                    <h2>1. Introduction</h2>
                    <p>
                        ArtisticBuz is committed to respecting your privacy and safeguarding
                        your personal data. This Privacy Policy applies to all visitors,
                        users, and customers who access our website and services.
                    </p>

                    <h2>2. Information We Collect</h2>
                    <p>We may collect the following categories of information:</p>
                    <ul>
                        <li>Personal details such as name and email address</li>
                        <li>Usage data such as pages visited and interactions</li>
                        <li>Device and browser information</li>
                    </ul>

                    <h2>3. How We Use Your Information</h2>
                    <p>Your information is used to:</p>
                    <ul>
                        <li>Provide and improve our services</li>
                        <li>Communicate important updates</li>
                        <li>Ensure platform security and integrity</li>
                        <li>Comply with legal requirements</li>
                    </ul>

                    <h2>4. Data Sharing</h2>
                    <p>
                        We do not sell your personal information. Data may be shared only
                        with trusted service providers who assist in operating our platform,
                        under strict confidentiality agreements.
                    </p>

                    <h2>5. Data Security</h2>
                    <p>
                        We implement industry-standard technical and organizational measures
                        to protect your data against unauthorized access, alteration, or loss.
                    </p>

                    <h2>6. Your Rights</h2>
                    <p>
                        You have the right to request access, correction, or deletion of your
                        personal data. You may also object to certain processing activities.
                    </p>

                    <h2>7. Policy Updates</h2>
                    <p>
                        This Privacy Policy may be updated periodically. Any changes will be
                        reflected on this page with a revised “Last updated” date.
                    </p>

                    <h2>8. Contact Us</h2>
                    <p>
                        For privacy-related questions, contact us at{' '}
                        <a href="mailto:info@artisticbuz.com">
                            info@artisticbuz.com
                        </a>.
                    </p>
                </article>
            </div>
        </main>
    )
}

