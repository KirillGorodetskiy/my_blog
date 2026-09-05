'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { fetchJson } from '@/lib/api/client';

interface StaffEditPayload {
  adminUrl?: string | null;
}

export function StaffEditLink({
  kind,
  slug,
  label,
}: {
  kind: 'article' | 'project';
  slug: string;
  label: string;
}) {
  const { user, ready } = useAuth();
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || !user.isStaff) {
      return;
    }

    const path = kind === 'article'
      ? `/api/v1/articles/${slug}/`
      : `/api/v1/projects/${slug}/`;
    let cancelled = false;

    fetchJson<StaffEditPayload>(path)
      .then((payload) => {
        if (!cancelled) {
          setHref(payload.adminUrl ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHref(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [kind, ready, slug, user.isStaff]);

  if (!user.isStaff || !href) {
    return null;
  }

  return (
    <a href={href} className='staff-edit-link'>
      {label}
    </a>
  );
}
