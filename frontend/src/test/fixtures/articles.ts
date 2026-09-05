import {
  AI_AUTOMATIONS_BODY,
  FINDING_FOCUS_BODY,
  PERSONAL_RAG_BODY,
  QUIET_DESK_BODY,
  SAME_PATH_BODY,
  WEEK_WITHOUT_MAP_BODY,
} from '@/test/fixtures/article-bodies';
import type { Article } from '@/data/types';

export const articles: Article[] = [
  {
    slug: 'personal-rag-vps',
    title: 'How I Set Up a Personal RAG System on a VPS',
    category: 'Development',
    date: '2026-08-12',
    readTimeMinutes: 9,
    excerpt:
      'A quiet, local-first retrieval setup that stays on a single VPS.',
    image: '/images/articles/personal-rag-vps.webp',
    featured: true,
    tags: ['Development', 'RAG', 'VPS'],
    body: PERSONAL_RAG_BODY,
  },
  {
    slug: 'building-ai-automations',
    title: 'Lessons from Building AI Automations',
    category: 'AI',
    date: '2026-07-03',
    readTimeMinutes: 7,
    excerpt:
      'What held up after the demo glow faded, and what I rewrote.',
    image: '/images/articles/building-ai-automations.webp',
    featured: true,
    tags: ['AI', 'Automation'],
    body: AI_AUTOMATIONS_BODY,
  },
  {
    slug: 'finding-focus',
    title: 'Finding Focus in a Distracted World',
    category: 'Productivity',
    date: '2026-05-21',
    readTimeMinutes: 6,
    excerpt:
      'A few durable habits for keeping attention when tools get loud.',
    image: '/images/articles/finding-focus.webp',
    featured: true,
    tags: ['Productivity', 'Focus'],
    body: FINDING_FOCUS_BODY,
  },
  {
    slug: 'quiet-automation-desk',
    title: 'Wiring a Quiet Automation Desk',
    category: 'Automation',
    date: '2026-04-08',
    readTimeMinutes: 8,
    excerpt:
      'Small scripts, clear logs, and fewer notifications that shout.',
    image: '/images/articles/quiet-automation-desk.webp',
    featured: false,
    tags: ['Automation'],
    body: QUIET_DESK_BODY,
  },
  {
    slug: 'walking-the-same-path',
    title: 'Walking the Same Path Twice',
    category: 'Life',
    date: '2026-03-16',
    readTimeMinutes: 5,
    excerpt:
      'Why repeating a familiar walk still changes how I write code.',
    image: '/images/articles/walking-the-same-path.webp',
    featured: false,
    tags: ['Life'],
    body: SAME_PATH_BODY,
  },
  {
    slug: 'week-without-a-map',
    title: 'Notes from a Week Without a Map',
    category: 'Travel',
    date: '2026-02-02',
    readTimeMinutes: 8,
    excerpt:
      'Travel notes on moving slowly and noticing the systems around you.',
    image: '/images/articles/week-without-a-map.webp',
    featured: false,
    tags: ['Travel'],
    body: WEEK_WITHOUT_MAP_BODY,
  },
];
