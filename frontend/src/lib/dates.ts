const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  const monthIndex = Number(month) - 1;
  const monthLabel = MONTHS[monthIndex];

  if (!year || !monthLabel || !day) {
    throw new Error(`Invalid date: ${isoDate}`);
  }

  return `${Number(day)} ${monthLabel} ${year}`;
}
