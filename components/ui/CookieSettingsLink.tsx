'use client'

export default function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('reevo:open-cookie-settings'))}
      className="text-white/40 text-xs hover:text-white/70 transition-colors text-left"
    >
      {label}
    </button>
  )
}
