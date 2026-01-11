// Accessibility utilities
import { readable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Check if user prefers reduced motion (one-time check)
 */
export function getPrefersReducedMotion(): boolean {
	if (!browser) return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Reactive store that tracks the user's reduced motion preference
 * Updates automatically when the user changes their system preference
 */
export const prefersReducedMotion = readable(false, (set) => {
	if (!browser) return;

	const query = window.matchMedia('(prefers-reduced-motion: reduce)');
	set(query.matches);

	const handler = (e: MediaQueryListEvent) => set(e.matches);
	query.addEventListener('change', handler);

	return () => query.removeEventListener('change', handler);
});
