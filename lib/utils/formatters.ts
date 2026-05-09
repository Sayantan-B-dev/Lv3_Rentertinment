export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function formatDuration(min?: number, max?: number): string {
  if (min && max) return `${min} - ${max} mins`;
  if (min) return `From ${min} mins`;
  if (max) return `Up to ${max} mins`;
  return "Flexible";
}

export function formatTeamSize(min?: number, max?: number): string {
  if (min && max) return min === max ? `${min} Member(s)` : `${min} - ${max} Members`;
  if (min) return `${min}+ Members`;
  if (max) return `Up to ${max} Members`;
  return "Solo/Group";
}
