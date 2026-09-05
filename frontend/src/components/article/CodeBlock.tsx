import { CopyButton } from '@/components/ui/CopyButton';
import { highlightCode } from '@/lib/highlight';

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const html = highlightCode(value, language);

  return (
    <figure className='article-code'>
      <figcaption className='article-code-bar'>
        <span className='article-code-lang'>{language}</span>
        <CopyButton value={value} />
      </figcaption>
      <pre className='article-code-pre'>
        <code
          className='article-code-body'
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </figure>
  );
}
