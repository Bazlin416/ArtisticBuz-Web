'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const accepted = localStorage.getItem('cookiesAccepted')
        if (!accepted) setIsVisible(true)
    }, [])

    const handleAccept = () => {
        localStorage.setItem('cookiesAccepted', 'true')
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem('cookiesAccepted', 'false')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 max-w-xl">
            <div
                className="
          bg-gradient-to-br from-emerald-50 via-white to-teal-50
          border border-emerald-200
          rounded-2xl shadow-2xl
          p-5 md:p-6
          animate-in slide-in-from-bottom-4 fade-in duration-300
        "
            >
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Cookie className="w-5 h-5 text-emerald-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                            We value your privacy
                        </h4>

                        <p className="text-sm text-gray-600 leading-relaxed">
                            ArtisticBuz uses cookies to enhance site functionality, understand
                            usage patterns, and improve your experience. You can learn more in
                            our{' '}
                            <Link
                                href="/cookie-policy"
                                className="text-emerald-700 font-medium hover:underline"
                            >
                                Cookie Policy
                            </Link>.
                        </p>

                        {/* Actions */}
                        <div className="mt-4 flex flex-wrap gap-3">
                            <button
                                onClick={handleDecline}
                                className="
                  px-4 py-2 rounded-xl
                  border border-gray-300
                  text-sm font-medium text-gray-700
                  hover:bg-gray-100
                  transition
                "
                            >
                                Decline
                            </button>

                            <button
                                onClick={handleAccept}
                                className="
                  px-5 py-2 rounded-xl
                  bg-emerald-600 text-white
                  text-sm font-semibold
                  hover:bg-emerald-700
                  shadow-md hover:shadow-lg
                  transition
                "
                            >
                                Accept cookies
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

