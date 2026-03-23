declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

export const GA_EVENTS = {
  CTA_CLICK: 'cta_click',
  FORM_START: 'form_start',
  FORM_SUBMIT: 'form_submit',
  FORM_SUCCESS: 'form_success',
  CHATBOT_OPEN: 'chatbot_open',
  CHATBOT_LEAD_READY: 'chatbot_lead_ready',
  WHATSAPP_CLICK: 'whatsapp_click',
  PRICING_INTENT: 'pricing_intent',
  LANGUAGE_SWITCH: 'language_switch',
  DEMO_TAB_CLICK: 'demo_tab_click',
  SCROLL_DEPTH: 'scroll_depth',
} as const
