import { Children, type ReactNode } from 'react';
import {
  Banknote,
  BookOpen,
  Bot,
  CircleCheck,
  Coins,
  Globe,
  GraduationCap,
  Lightbulb,
  Lock,
  Pin,
  Rocket,
  Search,
  Settings,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import {
  DECORATIVE_ICON_KEYS,
  splitLeadingDecorative,
  type DecorativeMarker,
} from '@/lib/decorativeIcons';

const ICONS: Record<string, LucideIcon> = {
  check: CircleCheck,
  idea: Lightbulb,
  warning: TriangleAlert,
  launch: Rocket,
  settings: Settings,
  wrench: Wrench,
  lock: Lock,
  search: Search,
  bot: Bot,
  globe: Globe,
  pin: Pin,
  book: BookOpen,
  tools: Wrench,
  education: GraduationCap,
  money: Banknote,
  coin: Coins,
};

function iconFor(marker: DecorativeMarker): LucideIcon {
  return ICONS[DECORATIVE_ICON_KEYS[marker]];
}

export function decorateChildren(children: ReactNode): ReactNode {
  const nodes = Children.toArray(children);
  const index = nodes.findIndex(
    (node) => typeof node === 'string' && node.length > 0,
  );

  if (index === -1) {
    return children;
  }

  const first = nodes[index];

  if (typeof first !== 'string') {
    return children;
  }

  const { marker, rest } = splitLeadingDecorative(first);

  if (!marker) {
    return children;
  }

  const Icon = iconFor(marker);
  const next = [...nodes];

  next[index] = (
    <span key='decorative-icon' className='markdown-icon-wrap'>
      <Icon
        className='markdown-icon'
        data-icon={DECORATIVE_ICON_KEYS[marker]}
        size={16}
        strokeWidth={1.6}
        aria-hidden
      />
      {rest || null}
    </span>
  );

  return next;
}
