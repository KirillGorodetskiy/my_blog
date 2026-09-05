'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';

interface ContentMediaProps {
  src: string;
  label: string;
  className?: string;
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
  src,
  label,
  className = '',
}: ContentMediaProps) {
  const [failed, setFailed] = useState(false);

  if (!hasUsableMediaSrc(src) || failed) {
    return (
      <MediaPlaceholder
        src={src || 'missing'}
        label={label}
        className={className}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={label}
        fill
        unoptimized
        className='object-cover'
        onError={() => setFailed(true)}
      />
    </div>
  );
}
