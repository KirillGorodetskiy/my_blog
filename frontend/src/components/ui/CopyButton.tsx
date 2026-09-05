'use client';

import { useState } from 'react';

interface CopyButtonProps {
  value: string;
  getValue?: () => string;
  label?: string;
  className?: string;
}

export function CopyButton({
  value,
  getValue,
  label = 'Copy',
  className = '',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      const text = getValue ? getValue() : value;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type='button'
      onClick={onCopy}
      className={
        'rounded-full px-2.5 py-1 text-xs tracking-wide ' +
        'text-[#c3d0ca] transition-colors ' +
        'hover:text-[#edf3ef] ' +
        'focus-visible:outline-2 ' +
        'focus-visible:outline-offset-4 ' +
        'focus-visible:outline-[#61e6b3] ' +
        className
      }
    >
      {copied ? 'Copied' : label}
    </button>
  );
}
