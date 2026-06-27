import { useEffect } from 'react'

interface SeoOptions {
  title?: string
  description?: string
  image?: string | null
  /** Canonical/OG url. Defaults to the current location. */
  url?: string
  type?: 'website' | 'article'
  /** JSON-LD structured data object (e.g. an Article schema). */
  jsonLd?: Record<string, unknown> | null
}

const DEFAULT_TITLE = 'The Refined Report'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.setAttribute('data-seo', 'true')
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-seo="true"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    el.setAttribute('data-seo', 'true')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Minimal SEO manager for this SPA: sets the document title, description,
 * Open Graph / Twitter tags, canonical link and optional JSON-LD.
 * Restores the default title on unmount.
 */
export function useSeo({ title, description, image, url, type = 'website', jsonLd }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} — The Refined Report` : DEFAULT_TITLE
    const canonical = url || (typeof window !== 'undefined' ? window.location.href : '')

    document.title = fullTitle

    if (description) {
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:description', description)
      upsertMeta('name', 'twitter:description', description)
    }

    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:type', type)
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')

    if (canonical) {
      upsertMeta('property', 'og:url', canonical)
      upsertLink('canonical', canonical)
    }
    if (image) {
      upsertMeta('property', 'og:image', image)
      upsertMeta('name', 'twitter:image', image)
    }

    // JSON-LD structured data
    const ldId = 'seo-jsonld'
    let ldEl = document.getElementById(ldId) as HTMLScriptElement | null
    if (jsonLd) {
      if (!ldEl) {
        ldEl = document.createElement('script')
        ldEl.id = ldId
        ldEl.type = 'application/ld+json'
        document.head.appendChild(ldEl)
      }
      ldEl.textContent = JSON.stringify(jsonLd)
    } else if (ldEl) {
      ldEl.remove()
    }

    return () => {
      document.title = DEFAULT_TITLE
      const ld = document.getElementById(ldId)
      if (ld) ld.remove()
    }
  }, [title, description, image, url, type, jsonLd])
}
