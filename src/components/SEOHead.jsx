/**
 * SEOHead — Multilingual SEO component.
 *
 * Emits:
 *   - <html lang="xx"> (via Helmet htmlAttributes)
 *   - Translated <title> and <meta name="description">
 *   - Canonical URL for the current locale
 *   - <link rel="alternate" hreflang="xx"> for all 8 locales + x-default
 *   - Open Graph locale tags
 *
 * Scope rule applies: page chrome is translated; exam content from
 * Firestore (titles of exam sets, question statements) is rendered verbatim
 * in whatever language it was authored in.
 *
 * Usage:
 *   <SEOHead title={t`Inicio`} description={t`Descripción de la página`} path="/home" />
 */
import { Helmet } from 'react-helmet-async';
import { useLangStore, SUPPORTED_LANGS } from '../core/i18n';

const SITE_URL = 'https://certzen.app';

// Map our locale ids to BCP-47 tags for hreflang / og:locale.
const HREFLANG_MAP = {
  es: 'es',
  en: 'en',
  fr: 'fr',
  pt: 'pt',
  de: 'de',
  it: 'it',
  zh: 'zh-Hans',
  ja: 'ja',
};

const OG_LOCALE_MAP = {
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
  pt: 'pt_PT',
  de: 'de_DE',
  it: 'it_IT',
  zh: 'zh_CN',
  ja: 'ja_JP',
};

/**
 * All languages share the same URL — no locale prefix in the path.
 * hreflang alternates all point to the same canonical URL.
 */
function canonicalUrl(path) {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

export function SEOHead({ title, description, path = '/', image, noindex = false }) {
  const { lang } = useLangStore();
  const fullTitle = title ? `${title} — CertZen` : 'CertZen';
  const canonical = canonicalUrl(path);
  const htmlLang = HREFLANG_MAP[lang] ?? 'en';

  return (
    <Helmet>
      <html lang={htmlLang} />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />

      {/* hreflang alternates — all locales share the same URL (language switched client-side) */}
      {SUPPORTED_LANGS.map((l) => (
        <link
          key={l.id}
          rel="alternate"
          hrefLang={HREFLANG_MAP[l.id]}
          href={canonical}
        />
      ))}
      {/* x-default points to the canonical URL */}
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="CertZen" />
      <meta property="og:locale" content={OG_LOCALE_MAP[lang] ?? 'es_ES'} />
      {SUPPORTED_LANGS.filter((l) => l.id !== lang).map((l) => (
        <meta key={l.id} property="og:locale:alternate" content={OG_LOCALE_MAP[l.id]} />
      ))}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
