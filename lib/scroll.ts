import type { MouseEvent } from 'react'

/**
 * Smooth-scroll to a page anchor without triggering a Next.js navigation.
 * Falls back to normal navigation if the element is not on the current page.
 */
export function anchorClick(id: string, e: MouseEvent) {
  const el = document.getElementById(id)
  if (el) {
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
