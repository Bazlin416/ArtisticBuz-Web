'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
        <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 z-50 bg-white shadow-lg rounded-xl p-4 md:flex md:items-center md:justify-between gap-4">
            <p className="text-gray-700 text-sm md:text-base">
                We use cookies to improve your experience. Read our{' '}
                <Link href="/cookie-policy" className="text-emerald-600 hover:underline">
                    Cookie Policy
                </Link>.
            </p>
            <div className="flex gap-2 mt-2 md:mt-0">
                <button
                    onClick={handleDecline}
                    className="px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                    Decline
                </button>
                <button
                    onClick={handleAccept}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                    Accept
                </button>
            </div>
        </div>
    )
}
