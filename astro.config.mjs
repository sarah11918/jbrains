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
				{ slug: 'mentoring' },
				{ slug: 'training' },
				{ slug: 'working-sessions' },
				{ slug: 'ensemble-programming'},
				{ slug: 'consulting' },
				{ slug: 'speaking' },
				{ slug: 'contact' },
				{
					label: 'Guides',
					autogenerate: {directory: 'guides'},
				}
			],
			plugins: [starlightBlog()],
		}),
	],
});
