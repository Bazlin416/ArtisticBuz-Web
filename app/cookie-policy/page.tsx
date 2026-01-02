import Link from 'next/link'

const LAST_UPDATED = 'January 2, 2026'

export default function CookiePolicyPage() {
    return (
        <main className="bg-gray-50 py-24">
            <div className="container mx-auto px-4 max-w-4xl">

                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Cookie Policy
                    </h1>
                    <p className="text-gray-600">
                        This policy explains how cookies are used on ArtisticBuz.
                    </p>
                    <p className="text-sm text-gray-500 mt-3">
                        Last updated: {LAST_UPDATED}
                    </p>
                </header>

                <article className="prose prose-emerald max-w-none">
                    <h2>1. What Are Cookies?</h2>
                    <p>
                        Cookies are small text files stored on your device to help websites
                        function properly and enhance user experience.
                    </p>

                    <h2>2. Types of Cookies We Use</h2>
                    <ul>
                        <li>Essential cookies for site functionality</li>
                        <li>Analytics cookies to understand usage patterns</li>
                        <li>Preference cookies to remember settings</li>
                    </ul>

                    <h2>3. How We Use Cookies</h2>
                    <p>
                        Cookies help us analyze traffic, improve performance, and personalize
                        content. We do not use cookies for intrusive advertising.
                    </p>

                    <h2>4. Third-Party Cookies</h2>
                    <p>
                        Some cookies may be set by third-party tools such as analytics or
                        authentication providers.
                    </p>

                    <h2>5. Managing Cookies</h2>
                    <p>
                        You can control or delete cookies through your browser settings.
                        Disabling cookies may affect certain site features.
                    </p>

                    <h2>6. Updates</h2>
                    <p>
                        This Cookie Policy may be updated periodically. Any changes will be
                        reflected on this page.
                    </p>

                    <h2>7. Contact</h2>
                    <p>
                        For cookie-related questions, contact{' '}
                        <a href="mailto:info@artisticbuz.com">
                            info@artisticbuz.com
                        </a>.
                    </p>
                </article>
            </div>
        </main>
    )
}

