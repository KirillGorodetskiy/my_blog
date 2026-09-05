'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  PROJECT_CATEGORIES,
  projects,
} from '@/data/projects';
import {
  categoryToParam,
  filterByCategory,
  paramToCategory,
  usedCategories,
} from '@/lib/filters';
import { ProjectCard } from '@/components/projects/ProjectCard';
import {
  ProjectFilters,
  type ProjectFilterValue,
} from '@/components/projects/ProjectFilters';

export function ProjectsBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const options = useMemo<ProjectFilterValue[]>(
    () => [
      'All',
      ...usedCategories(projects, PROJECT_CATEGORIES),
    ],
    [],
  );
  const active = paramToCategory(
    params.get('tag'),
    PROJECT_CATEGORIES,
  );
  const visible = useMemo(
    () => filterByCategory(projects, active),
    [active],
  );

  function onChange(value: ProjectFilterValue) {
    const next = new URLSearchParams(params.toString());

    if (value === 'All') {
      next.delete('tag');
    } else {
      next.set('tag', categoryToParam(value));
    }

    const query = next.toString();
    router.push(
      query ? `${pathname}?${query}` : pathname,
      { scroll: false },
    );
  }

  return (
    <section className='mx-auto max-w-6xl px-5 py-14 md:px-8'>
      <ProjectFilters
        active={active}
        options={options}
        onChange={onChange}
      />
      {visible.length === 0 ? (
        <p className='mt-16 text-center text-[#91a09a]'>
          Nothing on this bench yet.
        </p>
      ) : (
        <div className='mt-10 grid gap-6 sm:grid-cols-2'>
          {visible.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
            />
          ))}
        </div>
      )}
    </section>
  );
}
