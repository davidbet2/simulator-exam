import { ShieldCheck, User } from 'lucide-react';
import { Trans } from '@lingui/react/macro';

/**
 * AuthorChip — compact author display for cards and landing pages.
 *
 * Props:
 *   official       (bool)   — show "CertZen" oficial badge
 *   ownerEmail     (string) — raw email (fallback for displayName)
 *   ownerDisplayName (string) — optional denormalized name
 *   size           — 'sm' | 'md' (default 'sm')
 */
export function AuthorChip({ official, ownerEmail, ownerDisplayName, size = 'sm' }) {
  const textSize = size === 'md' ? 'text-sm' : 'text-xs';
  const iconSize = size === 'md' ? 14 : 12;

  if (official) {
    return (
      <span className={`inline-flex items-center gap-1 font-medium text-brand-700 ${textSize}`}>
        <ShieldCheck size={iconSize} className="fill-brand-500 stroke-white" strokeWidth={2.5} />
        <Trans>CertZen Oficial</Trans>
      </span>
    );
  }

  // Community author: displayName if available, otherwise email prefix (masked)
  const label =
    ownerDisplayName
      ?? (ownerEmail ? ownerEmail.split('@')[0] : 'anónimo');

  return (
    <span className={`inline-flex items-center gap-1 text-ink-soft ${textSize}`}>
      <User size={iconSize} />
      <span className="font-medium">{label}</span>
      <span className="text-[10px] opacity-60">· Comunidad</span>
    </span>
  );
}
