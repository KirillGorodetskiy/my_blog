'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';

export type MediaRole =
  | 'project-thumbnail'
  | 'article-hero'
  | 'article-content-image'
  | 'article-screenshot';

interface ContentMediaProps {
  role: MediaRole;
  src: string;
  label: string;
  className?: string;
  objectPosition?: string;
}

const ROLE_CLASS: Record<MediaRole, string> = {
  'project-thumbnail': 'project-thumbnail',
  'article-hero': 'article-hero-image',
  'article-content-image': 'article-content-image',
  'article-screenshot': 'article-screenshot',
};

const BOXED_ROLES: MediaRole[] = [
  'project-thumbnail',
  'article-hero',
];

function joinClasses(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function hasUsableMediaSrc(src: string): boolean {
  const value = src.trim();

  if (!value) {
    return false;
  }

  return (
    value.startsWith('/') ||
    value.startsWith('https://') ||
    value.startsWith('http://')
  );
}

export function ContentMedia({
  role,
  src,
  label,
  className = '',
  objectPosition,
}: ContentMediaProps) {
  const [failed, setFailed] = useState(false);
  const roleClass = ROLE_CLASS[role];

  if (!hasUsableMediaSrc(src) || failed) {
    return (
      <MediaPlaceholder
        src={src || 'missing'}
        label={label}
        className={joinClasses(roleClass, className)}
      />
    );
  }

  if (!BOXED_ROLES.includes(role)) {
    return (
      <img
        src={src}
        alt={label}
        className={joinClasses(roleClass, className)}
        onError={() => setFailed(true)}
      />
    );
  }

  const fitClass =
    role === 'project-thumbnail'
      ? 'object-contain'
      : 'object-cover';

  return (
    <div
      className={joinClasses(
        'relative overflow-hidden',
        roleClass,
        className,
      )}
    >
      <Image
        src={src}
        alt={label}
        fill
        unoptimized
        className={fitClass}
        style={
          objectPosition ? { objectPosition } : undefined
        }
        onError={() => setFailed(true)}
      />
    </div>
  );
}
