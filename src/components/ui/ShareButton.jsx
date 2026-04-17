import { useState } from 'react';
import { Share2, Link2, Check } from 'lucide-react';

function XIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.802l4.261 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LinkedInIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/**
 * ShareButton — compact share menu with Web Share API fallback.
 *
 * Props:
 *   url      — canonical URL to share (required)
 *   title    — share title
 *   text     — share body text (used by Web Share API + Twitter)
 *   variant  — 'icon' (default) | 'button'
 */
export function ShareButton({ url, title, text, variant = 'icon' }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text ?? title ?? '');

  const links = [
    {
      id: 'twitter',
      label: 'Twitter / X',
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encoded}`,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    },
  ];

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled — no-op
      }
      return;
    }
    setOpen((v) => !v);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  }

  const triggerClass = variant === 'button'
    ? 'inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-muted text-ink text-sm font-medium transition-colors'
    : 'inline-flex items-center justify-center w-9 h-9 rounded-xl border border-surface-border bg-surface-card hover:bg-surface-muted text-ink-soft hover:text-ink transition-colors';

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleNativeShare}
        className={triggerClass}
        aria-label="Compartir"
        title="Compartir"
      >
        <Share2 size={15} />
        {variant === 'button' && <span>Compartir</span>}
      </button>

      {/* Dropdown (shown only when Web Share API is not available) */}
      {open && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-surface-card border border-surface-border shadow-[0_8px_30px_-8px_rgba(0,0,0,0.2)] z-50 overflow-hidden">
            {links.map(({ id, label, icon: Icon, href }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-ink hover:bg-surface-muted transition-colors"
              >
                <Icon size={15} className="text-ink-soft shrink-0" />
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={copyLink}
              className="flex items-center gap-3 px-4 py-3 text-sm text-ink hover:bg-surface-muted transition-colors w-full border-t border-surface-border"
            >
              {copied
                ? <><Check size={15} className="text-success-500 shrink-0" /> Copiado</>
                : <><Link2 size={15} className="text-ink-soft shrink-0" /> Copiar enlace</>
              }
            </button>
          </div>
        </>
      )}
    </div>
  );
}
