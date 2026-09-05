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

const ROLE_FIT: Record<MediaRole, 'object-cover' | 'object-contain'> = {
  'project-thumbnail': 'object-contain',
  'article-hero': 'object-cover',
  'article-content-image': 'object-contain',
  'article-screenshot': 'object-contain',
};

export const ROLE_SIZES: Record<MediaRole, string> = {
  'project-thumbnail': '(min-width: 768px) 40vw, 100vw',
  'article-hero': '(min-width: 1280px) 48rem, 100vw',
  'article-content-image': '(min-width: 1280px) 48rem, 100vw',
  'article-screenshot': '(min-width: 768px) 40vw, 100vw',
};

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

export function bypassesImageOptimizer(src: string): boolean {
  const value = src.trim();

  return (
    value.startsWith('/media/') ||
    value.startsWith('http://') ||
    value.startsWith('https://')
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
        sizes={ROLE_SIZES[role]}
        unoptimized={bypassesImageOptimizer(src)}
        className={ROLE_FIT[role]}
        style={
          objectPosition ? { objectPosition } : undefined
        }
        onError={() => setFailed(true)}
      />
    </div>
  );
}
