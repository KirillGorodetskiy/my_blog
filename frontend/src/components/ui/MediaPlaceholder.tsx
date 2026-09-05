interface MediaPlaceholderProps {
  src: string;
  label: string;
  className?: string;
}

export function MediaPlaceholder({
  src,
  label,
  className = '',
}: MediaPlaceholderProps) {
  return (
    <div
      role='img'
      aria-label={label}
      className={
        'relative overflow-hidden bg-[#0d1718] ' +
        className
      }
    >
      <div
        className='absolute inset-0 opacity-80'
        style={{
          background:
            'radial-gradient(circle at 20% 20%, ' +
            'rgba(97, 230, 179, 0.08), transparent 42%), ' +
            'linear-gradient(160deg, #0a1415, #081013 55%, ' +
            '#101a1c)',
        }}
      />
      <div
        className='absolute inset-0 opacity-20'
        style={{
          backgroundImage:
            'linear-gradient(rgba(237,243,239,0.08) 1px, ' +
            'transparent 1px), ' +
            'linear-gradient(90deg, rgba(237,243,239,0.08) 1px, ' +
            'transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <p
        className={
          'absolute inset-x-3 bottom-3 font-mono text-[10px] ' +
          'leading-relaxed tracking-wide text-[#91a09a]'
        }
      >
        Placeholder · {src}
      </p>
    </div>
  );
}
