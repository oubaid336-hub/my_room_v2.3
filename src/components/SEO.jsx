import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description, image }) {
  const siteTitle = 'MyRoom.tn'
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const defaultDesc = 'Trouve ton logement étudiant près de ton université en Tunisie.'
  const defaultImage = 'https://myroom.tn/og-image.jpg'
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://myroom.tn'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  )
}
