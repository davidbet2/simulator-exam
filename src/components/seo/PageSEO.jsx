import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'CertZen';
const SITE_URL  = 'https://certzen.app';
const DEFAULT_DESCRIPTION = 'Simulador inteligente de exámenes de certificación profesional. Practica, aprende y aprueba con confianza.';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/**
 * PageSEO — drop into any page to override <head> meta tags.
 *
 * @param {string}  title       Page-level title. Appended with " | CertZen"
 * @param {string}  description Meta description (max 160 chars)
 * @param {string}  canonical   Canonical URL (defaults to SITE_URL)
 * @param {string}  ogImage     OG image URL
 * @param {string}  type        OG type: "website" | "article"
 * @param {boolean} noIndex     Set true to add noindex (admin/private pages)
 * @param {object}  jsonLd      Optional JSON-LD structured data object
 */
export function PageSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  type = 'website',
  noIndex = false,
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Domina tu Certificación`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow" />
      }
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type"        content={type} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"        content={ogImage} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"    content={fullTitle} />
      <meta property="og:site_name"    content={SITE_NAME} />
      <meta property="og:locale"       content="es_ES" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content="@certzen_app" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />
      <meta name="twitter:image:alt"   content={fullTitle} />

      {/* JSON-LD structured data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
