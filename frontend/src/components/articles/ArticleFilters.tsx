export type ArticleFilterValue = 'All' | string;

interface ArticleFiltersProps {
  active: ArticleFilterValue;
  options: readonly ArticleFilterValue[];
  onChange: (value: ArticleFilterValue) => void;
}

export function ArticleFilters({
  active,
  options,
  onChange,
}: ArticleFiltersProps) {
  return (
    <div
      role='group'
      aria-label='Article categories'
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
