/**
 * Animated counter that counts up from 0 to target value
 */
export function countUp(
	element: HTMLElement,
	target: number,
	duration: number = 2000,
	suffix: string = ''
): void {
	const startTime = performance.now();
	const startValue = 0;

	function easeOutExpo(x: number): number {
		return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
	}

	function update(currentTime: number): void {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const easedProgress = easeOutExpo(progress);
		const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

		element.textContent = formatNumber(currentValue) + suffix;

		if (progress < 1) {
			requestAnimationFrame(update);
		}
	}

	requestAnimationFrame(update);
}

/**
 * Format large numbers with K/M suffixes
 */
export function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
	}
	return num.toLocaleString();
}
