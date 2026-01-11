<script lang="ts">
	import { page } from '$app/stores';
	import ThemeToggle from './ThemeToggle.svelte';
	import Logo from './Logo.svelte';
	import { Icon } from '$lib/components/icons';
	import { IconButton } from '$lib/components/ui';

	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Projects' },
		{ href: '/about', label: 'About' },
		{ href: '/submit', label: 'Submit' }
	];

	function handleScroll() {
		scrolled = window.scrollY > 50;
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<svelte:window onscroll={handleScroll} />

<header
	class="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
	class:scrolled
	class:glass={scrolled}
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
		<!-- Logo -->
		<a href="/" class="flex items-center gap-2 text-xl font-bold" onclick={closeMobileMenu}>
			<Logo />
			<span class="text-[var(--color-text-primary)]">
				Py<span class="text-[var(--color-accent)]">Sim</span>Hub
			</span>
		</a>

		<!-- Desktop Navigation -->
		<nav class="hidden items-center gap-1 md:flex">
			{#each navItems as item}
				<a
					href={item.href}
					class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
					class:active={$page.url.pathname === item.href ||
						(item.href !== '/' && $page.url.pathname.startsWith(item.href))}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- Right side -->
		<div class="flex items-center gap-2">
			<ThemeToggle />

			<!-- GitHub link -->
			<IconButton
				icon="github"
				label="GitHub"
				href="https://github.com/pysimhub"
				target="_blank"
			/>

			<!-- Mobile menu button -->
			<button
				class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-bg-hover)] md:hidden"
				onclick={toggleMobileMenu}
				aria-label="Toggle menu"
				aria-expanded={mobileMenuOpen}
			>
				<Icon name={mobileMenuOpen ? 'close' : 'hamburger'} />
			</button>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<nav class="glass border-t border-[var(--color-border)] px-4 py-4 md:hidden">
			{#each navItems as item}
				<a
					href={item.href}
					class="block rounded-lg px-4 py-3 text-sm font-medium transition-colors"
					class:active={$page.url.pathname === item.href ||
						(item.href !== '/' && $page.url.pathname.startsWith(item.href))}
					onclick={closeMobileMenu}
				>
					{item.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>

<style>
	header {
		background: transparent;
		/* Establish stacking context for backdrop-filter */
		isolation: isolate;
	}

	header.scrolled {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	nav a {
		color: var(--color-text-secondary);
	}

	nav a:hover {
		color: var(--color-text-primary);
		background-color: var(--color-bg-hover);
	}

	nav a.active {
		color: var(--color-accent);
		background-color: rgba(99, 102, 241, 0.1);
	}

	:global(.light) header.scrolled {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}
</style>
