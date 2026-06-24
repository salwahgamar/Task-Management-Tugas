/**
 * Formatting utilities for dates, status labels, etc.
 */

export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (err) {
    return dateString;
  }
}

export function formatStatus(status) {
  switch (status) {
    case 'completed':
      return { label: 'Selesai', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' };
    case 'in_progress':
      return { label: 'Sedang Berjalan', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' };
    case 'pending':
    default:
      return { label: 'Tertunda', color: 'bg-rose-500/10 text-rose-400 border border-rose-500/20' };
  }
}
