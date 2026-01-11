// Consolidated formatting utilities

// Re-export formatNumber from countup.ts to centralize formatting
export { formatNumber } from './countup';

/**
 * Format a date string to a readable format
 * @param dateStr - ISO date string
 * @param variant - 'short' for "Jan 15, 2024", 'long' for "January 15, 2024"
 */
export function formatDate(
	dateStr: string,
	variant: 'short' | 'long' = 'long'
): string {
	return new Date(dateStr).toLocaleDateString('en-US', {
		month: variant === 'short' ? 'short' : 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

/**
 * Check if a date is within the last N days
 * @param dateStr - ISO date string
 * @param days - Number of days to check (default: 30)
 */
export function isRecentDate(dateStr: string | undefined, days: number = 30): boolean {
	if (!dateStr) return false;
	const date = new Date(dateStr);
	const cutoff = new Date();
	cutoff.setDate(cutoff.getDate() - days);
	return date > cutoff;
}
