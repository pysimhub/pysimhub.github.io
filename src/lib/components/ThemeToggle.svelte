<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Icon } from '$lib/components/icons';
	import { IconButton } from '$lib/components/ui';
</script>

<IconButton
	icon={$theme === 'dark' ? 'sun' : 'moon'}
	label={$theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	onclick={() => theme.toggle()}
	class="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
/>
