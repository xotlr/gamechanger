import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gaming Verein Retz - GAME:changer eSport Community',
  description: 'GAME:changer Gaming Verein in Retz, Niederösterreich. Der führende eSport Club in der Region. Gaming Events, Turniere und Community in Retz.',
  keywords: [
    'Gaming Verein Retz', 'eSport Retz', 'GAME:changer Retz', 'Gaming Community Retz',
    'Gaming Events Retz', 'eSport Turniere Retz', 'Gaming Club Retz', 'Computerspiele Verein Retz',
    'Gaming Team Retz', 'eSport Team Retz', 'Retz Gaming', 'Niederösterreich Gaming'
  ],
  openGraph: {
    title: 'Gaming Verein Retz - GAME:changer eSport Community',
    description: 'Der führende Gaming Verein in Retz, Niederösterreich. GAME:changer bietet Gaming Events, Turniere und eine starke Community.',
  },
};

export default function RetzPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "GAME:changer Gaming Verein Retz",
    "description": "Gaming Verein in Retz, Niederösterreich - eSport Community, Turniere und Events",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Retz",
      "addressRegion": "Niederösterreich",
      "postalCode": "2070",
      "addressCountry": "AT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.7567,
      "longitude": 15.9457
    },
    "url": "https://your-domain.com/retz",
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61565503147498"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#0a0a1c] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span style={{ color: "#ff0057" }}>GAME:</span>
              <span style={{ color: "#2196f3" }}>changer</span>
              <span className="block text-2xl md:text-3xl mt-4 text-gray-300">
                Gaming Verein Retz
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Der führende eSport & Gaming Verein in Retz, Niederösterreich
            </p>
          </header>

          <main className="space-y-12">
            <section className="bg-white/5 rounded-lg p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#ff0057]">Über uns in Retz</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                GAME:changer ist der erste und führende Gaming Verein in Retz und der Region Niederösterreich. 
                Seit unserer Gründung haben wir uns zum Ziel gesetzt, die Gaming-Community in Retz zu stärken 
                und eine Plattform für eSport-Begeisterte zu schaffen.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                Unser Verein bietet regelmäßige Gaming-Events, Turniere und Community-Treffen für alle 
                Altersgruppen und Skill-Level in der Region Retz.
              </p>
            </section>

            <section className="bg-white/5 rounded-lg p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#2196f3]">Gaming in Retz</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Unsere Angebote</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Gaming Turniere in Retz</li>
                    <li>• eSport Events und Workshops</li>
                    <li>• Community Treffen</li>
                    <li>• Gaming Coaching</li>
                    <li>• LAN-Partys</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">Standort Retz</h3>
                  <address className="text-gray-300 not-italic">
                    <p>GAME:changer Gaming Verein</p>
                    <p>Retz, Niederösterreich</p>
                    <p>2070 Retz</p>
                    <p>Österreich</p>
                  </address>
                </div>
              </div>
            </section>

            <section className="bg-white/5 rounded-lg p-8 border border-white/10">
              <h2 className="text-3xl font-bold mb-6 text-[#ff0057]">Gaming Community Retz</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Als Gaming Verein in Retz verstehen wir uns als Bindeglied zwischen Gaming-Enthusiasten 
                in der Region. Wir organisieren regelmäßige Events und schaffen Möglichkeiten für 
                Gamer aller Bereiche sich zu vernetzen und gemeinsam zu spielen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/#member" 
                  className="inline-block px-6 py-3 bg-[#ff0057] text-white rounded-lg hover:bg-[#ff0057]/80 transition-colors text-center"
                >
                  Mitglied werden
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61565503147498" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 border border-[#2196f3] text-[#2196f3] rounded-lg hover:bg-[#2196f3]/10 transition-colors text-center"
                >
                  Facebook folgen
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}