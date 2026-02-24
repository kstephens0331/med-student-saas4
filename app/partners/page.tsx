import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Trusted Partners | Get Step Ready - USMLE Preparation',
  description:
    'Get Step Ready partners with a network of trusted businesses across technology, healthcare, construction, and more. Meet the companies we work with and recommend.',
  openGraph: {
    title: 'Trusted Partners | Get Step Ready',
    description:
      'Discover the trusted businesses that Get Step Ready collaborates with and recommends.',
    type: 'website',
  },
};

const partners = [
  {
    name: 'StephensCode LLC',
    category: 'Web Development & Technology',
    description:
      'The veteran-owned development team behind Get Step Ready. With fourteen-plus years of experience and over 2,600 projects delivered, StephensCode builds custom web applications, learning platforms, and digital tools that help businesses and educators reach their goals.',
    url: 'https://stephenscode.dev',
  },
  {
    name: 'Forge-X',
    category: 'Construction Management Software',
    description:
      'A project management platform purpose-built for the trades. Forge-X brings invoicing, scheduling, daily job logs, and payment tracking into a single dashboard — keeping contractors and property owners aligned through every project milestone.',
    url: 'https://forge-x.app',
  },
  {
    name: 'AMW Cooling & Heating',
    category: 'HVAC Services',
    description:
      'A veteran-owned HVAC company based in Conroe, TX serving the Greater Houston metro. AMW provides professional air conditioning repair, heating installation, preventive maintenance, and around-the-clock emergency service — fully licensed and insured.',
    url: 'https://amwairconditioning.com',
  },
  {
    name: 'Terracotta Construction',
    category: 'General Contracting',
    description:
      'Professional contractors offering construction, landscaping, fencing, handyman services, apartment turnovers, and 24/7 emergency repairs across Montgomery County and the Greater Houston corridor. Built on reliability and craftsmanship.',
    url: 'https://terracottaconstruction.com',
  },
  {
    name: 'C.A.R.S Collision & Refinish',
    category: 'Auto Body & Paint',
    description:
      'Veteran and family-owned auto body specialists located in Spring, TX. C.A.R.S delivers expert collision repair, custom paint work, paintless dent removal, and spray-in bedliners — serving Spring, The Woodlands, and North Houston.',
    url: 'https://carscollisionandrefinishshop.com',
  },
  {
    name: 'SACVPN',
    category: 'VPN & Cybersecurity',
    description:
      'Private VPN infrastructure built for business and personal use. SACVPN deploys dedicated server instances with enterprise-grade encryption and speeds reaching 700 Mbps — no shared servers, no data logging. Veteran-owned and security-first.',
    url: 'https://sacvpn.com',
  },
  {
    name: 'LotSwap',
    category: 'Automotive Marketplace',
    description:
      'A fee-free dealer-to-dealer vehicle marketplace that cuts out the auction middleman. Dealers list wholesale inventory, negotiate directly, and close deals faster — saving an average of $1,500 to $2,500 per vehicle on traditional auction costs.',
    url: 'https://lotswap.io',
  },
  {
    name: 'Benefit Builder LLC',
    category: 'Benefits Consulting',
    description:
      'A brokerage focused on Section 125 pre-tax benefit plans and supplemental insurance options including life, dental, and vision coverage. Benefit Builder designs benefit packages that lower tax liability for employers and their teams.',
    url: 'https://benefitbuilderllc.com',
  },
  {
    name: 'ColorFuse Prints',
    category: 'Custom Printing & Apparel',
    description:
      'Premium DTF transfers, sublimation printing, and custom apparel production. From branded uniforms to ready-to-press transfers, ColorFuse delivers vibrant, durable results shipped directly to businesses and creators.',
    url: 'https://colorfuseprints.com',
  },
  {
    name: 'FC Photo Houston',
    category: 'Photography',
    description:
      'A Houston-area photographer covering portraits, professional headshots, events, and creative sessions. FC Photo Houston combines high-quality, polished imagery with a warm, personable approach to every project.',
    url: 'https://fcphotohouston.com',
  },
  {
    name: 'GradeStack',
    category: 'SEO & Website Monitoring',
    description:
      'A self-hosted website audit platform that scores sites on performance, SEO, security, accessibility, and best practices. GradeStack crawls your pages automatically and provides clear, step-by-step guidance to fix every issue uncovered.',
    url: 'https://gradestack.dev',
  },
  {
    name: 'JustWell Clinical Research',
    category: 'Clinical Research',
    description:
      'An IRB-approved clinical research site in the Greater Houston area conducting trials across cardiology, neurology, dermatology, ophthalmology, and family medicine. JustWell connects patients with cutting-edge treatments and compensated study opportunities.',
    url: 'https://justwellclinical.org',
  },
  {
    name: 'Lefty Cartel',
    category: 'Sports & Community',
    description:
      'An exclusive community and apparel brand created for left-handed ball players. Lefty Cartel features training resources, a members-only store, and a veteran-backed brotherhood celebrating the craft of playing from the left side.',
    url: 'https://leftycartel.net',
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted <span className="text-primary-300">Partners</span>
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Get Step Ready is part of a network of dedicated businesses we collaborate with,
            trust, and proudly recommend. From web development to healthcare, these companies
            share our commitment to excellence.
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <span className="text-xs uppercase tracking-wider text-primary-600 font-semibold mb-2 block">
                  {partner.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {partner.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">
                  {partner.description}
                </p>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Visit Website
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Ace Step 1?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of medical students using Get Step Ready to prepare for the
            USMLE Step 1 with flashcards, practice questions, and AI-powered study tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors"
            >
              Start Studying Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-700/30 text-white border border-primary-400/30 rounded-lg font-semibold text-lg hover:bg-primary-700/50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Get Step Ready &mdash; Built by{' '}
            <a
              href="https://stephenscode.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:underline"
            >
              StephensCode LLC
            </a>
            . All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
