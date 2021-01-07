module.exports = {
  title: 'Grapevine',
  tagline: 'Fast, unopinionated, embeddable, minimalist web framework for .NET',
  url: 'https://scottoffen.github.io/grapevine',
  baseUrl: '/grapevine/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'scottoffen',
  projectName: 'grapevine',
  themeConfig: {
    prism: {
      additionalLanguages: ['csharp'],
    },
    googleAnalytics: {
        trackingID: 'G-NY1EMEGC7C',
    },
    navbar: {
      title: 'Grapevine',
      logo: {
        alt: 'Grapevine Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/scottoffen/grapevine',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Overview',
              to: 'docs/',
            },
            {
              label: 'Tutorials',
              to: 'docs/tutorials/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/grapevine',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/scottoffen/grapevine/discussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/scottoffen/grapevine',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Scott Offen`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/scottoffen/grapevine-docs/edit/master/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/scottoffen/grapevine-docs/edit/master/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
