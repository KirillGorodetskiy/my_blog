import { RelatedList } from '@/components/article/RelatedList';
import { StaffEditLink } from '@/components/content/StaffEditLink';
import { MarkdownContent } from '@/components/markdown/MarkdownContent';
import { MarkdownInline } from '@/components/markdown/MarkdownInline';
import { ContentMedia } from '@/components/ui/ContentMedia';
import { UNWRITTEN, type Project } from '@/data/types';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className='project-section'>
      <h2 className='project-section-title'>{title}</h2>
      {children}
    </section>
  );
}

function BlockCopy({ text }: { text: string }) {
  return <MarkdownContent source={text} />;
}

function InlineCopy({ text }: { text: string }) {
  return (
    <p className='project-copy'>
      <MarkdownInline source={text} />
    </p>
  );
}

export function ProjectDetail({
  project,
  related = [],
}: {
  project: Project;
  related?: Project[];
}) {

  return (
    <article>
      <header className='project-hero'>
        <p className='project-kicker'>
          {project.category}
          <span aria-hidden='true'> · </span>
          {project.status}
        </p>
        <h1 className='project-title'>{project.title}</h1>
        <StaffEditLink
          kind='project'
          slug={project.slug}
          label='Edit project'
        />
        <div className='project-summary'>
          <MarkdownContent
            source={project.description}
            className='project-content'
          />
        </div>
        <ContentMedia
          src={project.image}
          label={`Artwork for ${project.title}`}
          className='project-cover'
        />
      </header>
      <div className='project-shell'>
        <Section title='Problem'>
          <BlockCopy text={project.problem} />
        </Section>
        <Section title='Solution'>
          <BlockCopy text={project.solution} />
        </Section>
        <Section title='Architecture'>
          <BlockCopy text={project.architecture} />
        </Section>
        <Section title='Workflow'>
          <BlockCopy text={project.workflow} />
        </Section>
        <Section title='APIs / integrations'>
          <BlockCopy text={project.integrations} />
        </Section>
        <Section title='Failure handling'>
          <BlockCopy text={project.failureHandling} />
        </Section>
        <Section title='Technologies'>
          {project.technologies.length > 0 ? (
            <ul className='article-tags'>
              {project.technologies.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <InlineCopy text={UNWRITTEN} />
          )}
        </Section>
        <Section title='Screenshots'>
          {project.screenshots.length > 0 ? (
            <div className='project-shots'>
              {project.screenshots.map((shot) => (
                <figure key={shot.src}>
                  <ContentMedia
                    src={shot.src}
                    label={shot.alt}
                    className='aspect-[16/10] w-full rounded-xl'
                  />
                  <figcaption className='article-caption'>
                    <MarkdownInline source={shot.caption} />
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <InlineCopy text={UNWRITTEN} />
          )}
        </Section>
        <Section title='Lessons learned'>
          {project.lessons.length > 0 ? (
            <ul className='article-list'>
              {project.lessons.map((lesson) => (
                <li key={lesson}>
                  <MarkdownInline source={lesson} />
                </li>
              ))}
            </ul>
          ) : (
            <InlineCopy text={UNWRITTEN} />
          )}
        </Section>
        <div className='project-links'>
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              rel='noopener noreferrer'
              className='article-link'
            >
              GitHub
            </a>
          ) : null}
          {project.demoUrl ? (
            <a href={project.demoUrl} className='article-link'>
              Live demo
            </a>
          ) : null}
          {!project.githubUrl && !project.demoUrl ? (
            <InlineCopy text='Links will be added when they are public.' />
          ) : null}
        </div>
        <RelatedList
          title='Related projects'
          basePath='/projects'
          items={related.map((item) => ({
            slug: item.slug,
            title: item.title,
            detail: item.description,
          }))}
        />
      </div>
    </article>
  );
}
