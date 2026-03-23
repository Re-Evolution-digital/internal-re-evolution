import { getTranslations } from 'next-intl/server'
import SchemaMarkup from '@/components/ui/SchemaMarkup'
import Header from '@/components/sections/Header'
import Hero from '@/components/sections/Hero'
import Problem from '@/components/sections/Problem'
import Services from '@/components/sections/Services'
import HowItWorks from '@/components/sections/HowItWorks'
import AutomationsDemo from '@/components/sections/AutomationsDemo'
import Pricing from '@/components/sections/Pricing'
import Cases from '@/components/sections/Cases'
import Blog from '@/components/sections/Blog'
import DiagnosticForm from '@/components/sections/DiagnosticForm'
import FAQ from '@/components/sections/FAQ'
import Footer from '@/components/sections/Footer'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'meta' })

  return (
    <>
      <SchemaMarkup locale={locale} />
      <Header />
      <main id="main-content">
        <Hero />
        <Problem />
        <Services />
        <HowItWorks />
        <AutomationsDemo />
        <Pricing />
        <Cases />
        <Blog />
        <DiagnosticForm />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
