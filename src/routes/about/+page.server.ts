import type { PageServerLoad } from './$types';

interface GitHubMember {
	login: string;
	avatar_url: string;
	html_url: string;
}

interface Member {
	login: string;
	name: string | null;
	avatarUrl: string;
	profileUrl: string;
}

// Fisher-Yates shuffle
function shuffle<T>(array: T[]): T[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		// Fetch public org members
		const response = await fetch('https://api.github.com/orgs/pysimhub/public_members', {
			headers: {
				Accept: 'application/vnd.github.v3+json',
				'User-Agent': 'PySimHub'
			}
		});

		if (!response.ok) {
			console.error('Failed to fetch org members:', response.status);
			return { members: [] };
		}

		const githubMembers: GitHubMember[] = await response.json();

		// Fetch additional user details (name) for each member
		const members: Member[] = await Promise.all(
			githubMembers.map(async (member) => {
				try {
					const userResponse = await fetch(`https://api.github.com/users/${member.login}`, {
						headers: {
							Accept: 'application/vnd.github.v3+json',
							'User-Agent': 'PySimHub'
						}
					});

					if (userResponse.ok) {
						const userData = await userResponse.json();
						return {
							login: member.login,
							name: userData.name,
							avatarUrl: member.avatar_url,
							profileUrl: member.html_url
						};
					}
				} catch {
					// Fall back to basic info
				}

				return {
					login: member.login,
					name: null,
					avatarUrl: member.avatar_url,
					profileUrl: member.html_url
				};
			})
		);

		// Shuffle randomly
		return { members: shuffle(members) };
	} catch (error) {
		console.error('Error fetching org members:', error);
		return { members: [] };
	}
};
