export const ARTICLE_CATEGORIES = [
  'AI',
  'Automation',
  'Development',
  'Productivity',
  'Life',
  'Travel',
] as const;

export type ArticleCategory = string;

export interface ArticleList {
  slug: string;
  title: string;
  category: ArticleCategory;
  date: string;
  readTimeMinutes: number;
  excerpt: string;
  image: string;
  featured: boolean;
  tags: string[];
  adminUrl?: string | null;
}

export interface Article extends ArticleList {
  body: string;
}

export const PROJECT_CATEGORIES = [
  'Automation',
  'AI',
  'Web Apps',
  'Infrastructure',
  'Hardware',
  'Other',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export type ProjectStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'complete';

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption: string;
}

export interface ProjectList {
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  image: string;
  featured: boolean;
  status: ProjectStatus;
  technologies: string[];
  adminUrl?: string | null;
}

export interface Project extends ProjectList {
  problem: string;
  solution: string;
  architecture: string;
  workflow: string;
  integrations: string;
  failureHandling: string;
  screenshots: ProjectScreenshot[];
  lessons: string[];
  githubUrl: string | null;
  demoUrl: string | null;
}

export const UNWRITTEN =
  'Notes for this section are still being written.';
