import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: '',
			logo: {
				src: './src/assets/logo.png',
			  },
			social: {
				github: 'https://github.com/jbrains',
				mastodon: 'https://mastodon.social/@jbrains',
				blueSky:'https://bsky.app/profile/jbrains.ca',
				stackOverflow: 'https://stackoverflow.com/users/253921/jbrains',
			},
			customCss: [
				'./src/styles/custom.css',
			  ],
			sidebar: [
				{ slug: 'welcome' },
				{ slug: 'learn-more' },
				{ slug: 'experience' },
				{ slug: 'mentoring/office-hours' },
				{ slug: 'working-sessions' },
				{	label: 'Training',
					items: [
						{slug: 'training'},
						{slug: 'training/courses'},
						{ slug: 'training/programs'},
						{ slug: 'training/upcoming-public-courses' },
						{ slug: 'training/book'},

						{ 	label: 'Course List 2025',
							collapsed: true,
							items: [
								{slug: 'course/worlds-best-intro-to-tdd'},
								{slug: 'course/surviving-legacy-code'},
								{slug: 'course/value-driven-product-development'},
								{slug: 'course/evolutionary-design-beyond-the-basics'},
								{slug: 'course/manufacturing-slack'},
								{slug: 'course/coaching-teams-to-adapt-safely'},
								{slug: 'course/surviving-your-inevitable-agile-transition'},
							],
						},
					],
				},
				{ slug: 'ensemble-programming'},
				{ slug: 'consulting' },
				{ slug: 'speaking' },
				{ slug: 'contact' },
				{
					label: 'Pages not in sidebar',
					items: [
						{ slug: 'contact/invite' },
						{ slug: 'sessions/whats-not-to-like-about-this-code' },
						
					],
				},
			],
			plugins: [starlightBlog()],
		}),
	],
});
