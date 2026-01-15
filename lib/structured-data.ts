export const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": ["Organization", "SportsOrganization", "LocalBusiness"],
  "name": "GAME:changer",
  "alternateName": ["GAME:changer eSport Gaming Verein", "Game Changer Retz"],
  "description": "GAME:changer - eSport & Gaming Verein in Retz, Niederösterreich",
  "url": "https://gamechanger-retz.at",
  "logo": "https://gamechanger-retz.at/logo.png",
  "image": "https://gamechanger-retz.at/og-image.jpg",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Pleissing",
    "addressRegion": "Niederösterreich",
    "postalCode": "2070",
    "addressCountry": "AT"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 48.7567, "longitude": 15.9457 },
  "areaServed": [
    { "@type": "City", "name": "Retz" },
    { "@type": "City", "name": "Pleissing" },
    { "@type": "State", "name": "Niederösterreich" }
  ],
  "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "availableLanguage": ["de"] },
  "sameAs": ["https://www.facebook.com/profile.php?id=61565503147498"],
  "sport": "eSports"
}
