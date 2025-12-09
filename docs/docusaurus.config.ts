import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Pak Studies',
  tagline: 'Simple Chapters',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'facebook',
  projectName: 'docusaurus',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },

        // 👇 BLOG COMPLETELY DISABLED
        blog: false,

        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',

    colorMode: {
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: 'Pak Studies',
      logo: {
        alt: 'Pak Studies Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Pak Studies',
        },
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Book Chapters',
          items: [
            {
              label: 'Ideology of Pakistan',
              to: '/docs/pak-studies/ideology-of-pakistan',
            },
            {
              label: 'Two Nation Theory',
              to: '/docs/pak-studies/two-nation-theory',
            },
            {
              label: 'Quaid-e-Azam’s Role',
              to: '/docs/pak-studies/quaid-e-azam-role',
            },
            {
              label: 'Creation of Pakistan (1947)',
              to: '/docs/pak-studies/creation-of-pakistan-1947',
            },
          ],
        },

        {
          title: 'Quick Links',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
          ],
        },

        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],

      copyright: `© ${new Date().getFullYear()} Pak Studies — beautifully crafted & built by Naeem Uddin with ❤️ using Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
