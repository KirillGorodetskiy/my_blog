import { RelatedList } from '@/components/article/RelatedList';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';
import { UNWRITTEN, type Project } from '@/data/types';
import { getRelatedProjects } from '@/lib/content';

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

function Prose({ text }: { text: string }) {
  return <p className='project-copy'>{text}</p>;
}

export function ProjectDetail({
  project,
}: {
  project: Project;
}) {
  const related = getRelatedProjects(project.slug);

  return (
    <article>
      <header className='project-hero'>
        <p className='project-kicker'>
          {project.category}
          <span aria-hidden='true'> · </span>
          {project.status}
        </p>
        <h1 className='project-title'>{project.title}</h1>
        <p className='project-summary'>{project.description}</p>
        <MediaPlaceholder
          src={project.image}
          label={`Pending artwork for ${project.title}`}
          className='project-cover'
        />
      </header>
      <div className='project-shell'>
        <Section title='Problem'>
          <Prose text={project.problem} />
        </Section>
        <Section title='Solution'>
          <Prose text={project.solution} />
        </Section>
        <Section title='Architecture'>
          <Prose text={project.architecture} />
        </Section>
        <Section title='Workflow'>
          <Prose text={project.workflow} />
        </Section>
        <Section title='APIs / integrations'>
          <Prose text={project.integrations} />
        </Section>
        <Section title='Failure handling'>
          <Prose text={project.failureHandling} />
        </Section>
        <Section title='Technologies'>
          {project.technologies.length > 0 ? (
            <ul className='article-tags'>
              {project.technologies.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <Prose text={UNWRITTEN} />
          )}
        </Section>
        <Section title='Screenshots'>
          {project.screenshots.length > 0 ? (
            <div className='project-shots'>
              {project.screenshots.map((shot) => (
                <figure key={shot.src}>
                  <MediaPlaceholder
                    src={shot.src}
                    label={shot.alt}
                    className='aspect-[16/10] w-full rounded-xl'
                  />
                  <figcaption className='article-caption'>
                    {shot.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <Prose text={UNWRITTEN} />
          )}
        </Section>
        <Section title='Lessons learned'>
          {project.lessons.length > 0 ? (
            <ul className='article-list'>
              {project.lessons.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          ) : (
            <Prose text={UNWRITTEN} />
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
            <Prose text='Links will be added when they are public.' />
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
