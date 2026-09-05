import type { ProjectCategory } from '@/data/projects';

export type ProjectFilterValue = 'All' | ProjectCategory;

interface ProjectFiltersProps {
  active: ProjectFilterValue;
  options: readonly ProjectFilterValue[];
  onChange: (value: ProjectFilterValue) => void;
}

export function ProjectFilters({
  active,
  options,
  onChange,
}: ProjectFiltersProps) {
  return (
    <div
      role='group'
      aria-label='Project categories'
      className='flex flex-wrap gap-2'
    >
      {options.map((option) => {
        const pressed = option === active;

        return (
          <button
            key={option}
            type='button'
            aria-pressed={pressed}
            onClick={() => onChange(option)}
            className={
              'rounded-full px-3.5 py-1.5 text-sm ' +
              'tracking-wide transition-colors ' +
              'focus-visible:outline-2 ' +
              'focus-visible:outline-offset-4 ' +
              'focus-visible:outline-[#61e6b3] ' +
              (pressed
                ? 'bg-[#173d33] text-[#61e6b3]'
                : 'bg-[#091112] text-[#c3d0ca] ' +
                  'hover:text-[#edf3ef]')
            }
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
