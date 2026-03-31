'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0
      setProgress(Math.min(pct, 100))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso de leitura do artigo"
      className="fixed top-0 left-0 right-0 z-50 h-1"
    >
      <div
        className="h-full bg-brand-yellow transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
