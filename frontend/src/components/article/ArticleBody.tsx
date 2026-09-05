import { MarkdownContent } from '@/components/markdown/MarkdownContent';

export function ArticleBody({ source }: { source: string }) {
  return <MarkdownContent source={source} />;
}
