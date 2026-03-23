'use client'

import Image from 'next/image'
import Link from 'next/link'
import { clientData } from '@/data/client-info'

type Props = {
  children: React.ReactNode
  locale?: string
}

function BackButton({ locale }: { locale: string }) {
  function handleBack() {
    // Opened in a new tab → close it; fallback to home if browser blocks window.close()
    if (window.history.length <= 1) {
      window.close()
      // If close was blocked (e.g. not opened via script), navigate home
      setTimeout(() => { window.location.href = `/${locale}` }, 200)
    } else {
      window.history.back()
    }
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#011b54] border-2 border-[#011b54] px-4 py-2 rounded-xl hover:bg-[#011b54] hover:text-white transition-all"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      Fechar
    </button>
  )
}

export default function LegalLayout({ children, locale = 'pt' }: Props) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href={`/${locale}`} className="shrink-0">
            <Image
              src={clientData.brand.logoSvg}
              alt={clientData.business.name}
              width={130}
              height={38}
              className="h-8 w-auto"
              priority
            />
          </Link>

          <BackButton locale={locale} />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 pb-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        <span>© 2026 {clientData.business.name}</span>
        <span className="mx-2">·</span>
        <a href={`mailto:${clientData.contact.email}`} className="hover:text-[#011b54] transition-colors">
          {clientData.contact.email}
        </a>
      </footer>
    </div>
  )
}
