import Link from 'next/link';

type ButtonVariant = 'primary' | 'ghost' | 'outline';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[#edf3ef] text-[#05090a] hover:bg-white',
  ghost:
    'border border-[#edf3ef]/35 text-[#edf3ef] ' +
    'hover:border-[#edf3ef] hover:bg-white/5',
  outline:
    'border border-[#61e6b3]/35 text-[#edf3ef] ' +
    'hover:border-[#61e6b3] hover:bg-[#173d33]/50',
};

export function Button({
  href,
  children,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const classes =
    'inline-flex items-center justify-center ' +
    'rounded-full px-5 py-2.5 text-sm font-medium ' +
    'tracking-wide transition-colors ' +
    'focus-visible:outline-2 ' +
    'focus-visible:outline-offset-4 ' +
    'focus-visible:outline-[#61e6b3] ' +
    VARIANTS[variant] +
    (className ? ` ${className}` : '');
  const isInternal = href.startsWith('/');

  if (!isInternal) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
