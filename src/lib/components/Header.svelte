<script lang="ts">
	import { page } from '$app/stores';
	import ThemeToggle from './ThemeToggle.svelte';

	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Projects' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/news', label: 'News' },
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
			<svg class="h-8 w-8" viewBox="0 0 32 32" fill="none">
				<circle cx="16" cy="16" r="14" stroke="var(--color-accent)" stroke-width="2" />
				<path
					d="M10 16h12M16 10v12M12 12l8 8M20 12l-8 8"
					stroke="var(--color-accent)"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
			</svg>
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
			<a
				href="https://github.com/pysimhub"
				target="_blank"
				rel="noopener noreferrer"
				class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-bg-hover)]"
				aria-label="GitHub"
			>
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
					<path
						fill-rule="evenodd"
						d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
						clip-rule="evenodd"
					/>
				</svg>
			</a>

			<!-- Mobile menu button -->
			<button
				class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-bg-hover)] md:hidden"
				onclick={toggleMobileMenu}
				aria-label="Toggle menu"
				aria-expanded={mobileMenuOpen}
			>
				{#if mobileMenuOpen}
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				{/if}
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
