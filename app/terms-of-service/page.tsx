import Link from 'next/link'

const LAST_UPDATED = 'January 2, 2026'

export default function TermsOfServicePage() {
    return (
        <main className="bg-gray-50 py-24">
            <div className="container mx-auto px-4 max-w-4xl">

                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-gray-600">
                        These terms govern your use of the ArtisticBuz platform.
                    </p>
                    <p className="text-sm text-gray-500 mt-3">
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <article className="prose prose-emerald max-w-none">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using ArtisticBuz, you agree to be bound by these
                        Terms of Service and all applicable laws.
                    </p>

                    <h2>2. Use of the Platform</h2>
                    <p>
                        You agree to use the platform only for lawful purposes and not to
                        misuse, disrupt, or attempt unauthorized access to our systems.
                    </p>

                    <h2>3. Accounts</h2>
                    <p>
                        If you create an account, you are responsible for maintaining the
                        confidentiality of your credentials and all activity under your account.
                    </p>

                    <h2>4. Intellectual Property</h2>
                    <p>
                        All content, branding, and software on ArtisticBuz are owned by or
                        licensed to us and protected by intellectual property laws.
                    </p>

                    <h2>5. Disclaimer</h2>
                    <p>
                        Our services are provided “as is” without warranties of any kind.
                        We do not guarantee uninterrupted or error-free operation.
                    </p>

                    <h2>6. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, ArtisticBuz shall not be
                        liable for indirect or consequential damages arising from use of
                        the platform.
                    </p>

                    <h2>7. Termination</h2>
                    <p>
                        We may suspend or terminate access to our services at any time for
                        violations of these terms or for operational reasons.
                    </p>

                    <h2>8. Changes to Terms</h2>
                    <p>
                        These terms may be updated periodically. Continued use of the
                        platform constitutes acceptance of the updated terms.
                    </p>

                    <h2>9. Contact</h2>
                    <p>
                        Questions regarding these terms may be sent to{' '}
                        <a href="mailto:info@artisticbuz.com">
                            info@artisticbuz.com
                        </a>.
                    </p>
                </article>
            </div>
        </main>
    )
}

