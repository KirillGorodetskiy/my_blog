export function filterByCategory<
  T extends { category: string },
>(items: readonly T[], category: string): T[] {
  if (category === 'All') {
    return [...items];
  }

  return items.filter((item) => item.category === category);
}

export function featuredItems<
  T extends { featured: boolean },
>(items: readonly T[], limit = 3): T[] {
  return items.filter((item) => item.featured).slice(0, limit);
}

export function usedCategories<T extends string>(
  items: readonly { category: string }[],
  categories?: readonly T[],
): T[] {
  const present = new Set(items.map((item) => item.category));

  if (categories) {
    return categories.filter((category) => present.has(category));
  }

  return [...present].sort((left, right) =>
    left.localeCompare(right),
  ) as T[];
}

export function categoryToParam(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export function paramToCategory<T extends string>(
  param: string | null | undefined,
  allowed: readonly T[],
): T | 'All' {
  if (!param) {
    return 'All';
  }

  const normalized = param.toLowerCase();
  const match = allowed.find(
    (category) => categoryToParam(category) === normalized,
  );

  return match ?? 'All';
}
