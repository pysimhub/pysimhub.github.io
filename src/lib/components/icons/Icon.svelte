<script lang="ts">
	import { icons, type IconName } from './icons';

	interface Props {
		name: IconName;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		class?: string;
		strokeWidth?: number;
	}

	let { name, size = 'md', class: className = '', strokeWidth = 2 }: Props = $props();

	const sizeClasses = {
		xs: 'h-3 w-3',
		sm: 'h-4 w-4',
		md: 'h-5 w-5',
		lg: 'h-6 w-6',
		xl: 'h-8 w-8'
	};

	const sizeClass = $derived(sizeClasses[size]);
	const icon = $derived(icons[name]);
</script>

{#if 'paths' in icon && icon.paths}
	<!-- Multi-path icon (currently only stroke-type icons use this) -->
	<svg
		class="{sizeClass} {className}"
		viewBox={icon.viewBox}
		fill="none"
		stroke="currentColor"
		stroke-width={strokeWidth}
	>
		{#each icon.paths as path}
			<path
				d={path}
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{/each}
	</svg>
{:else}
	<svg
		class="{sizeClass} {className}"
		viewBox={icon.viewBox}
		fill={icon.type === 'fill' ? 'currentColor' : 'none'}
		stroke={icon.type === 'stroke' ? 'currentColor' : undefined}
		stroke-width={icon.type === 'stroke' ? strokeWidth : undefined}
	>
		<path
			d={icon.path}
			stroke-linecap={icon.type === 'stroke' ? 'round' : undefined}
			stroke-linejoin={icon.type === 'stroke' ? 'round' : undefined}
			fill-rule={icon.type === 'fill' ? 'evenodd' : undefined}
			clip-rule={icon.type === 'fill' ? 'evenodd' : undefined}
		/>
	</svg>
{/if}
