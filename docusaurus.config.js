// @ts-check
// Engineering portfolio at portfolio.zcohen-nerd.com.
// Chrome (Navbar + Footer) comes from the @zcohen-nerd/brand theme; the
// themeConfig navbar/footer here are intentionally minimal — the swizzled
// components ignore them.

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Zachary Cohen — Engineering Portfolio',
  tagline:
    'Electromechanical systems engineer — designing integrated hardware systems from architecture to deployment.',
  favicon: 'img/zcohen-nerd-icon.png',

  url: 'https://portfolio.zcohen-nerd.com',
  baseUrl: '/',

  organizationName: 'zcohen-nerd',
  projectName: 'Portfolio',

  onBrokenLinks: 'warn',
  markdown: {
    // .md files are CommonMark (raw HTML passes through unchanged — the
    // ported Jekyll content uses class/style attributes); .mdx files are MDX.
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Shared brand: swizzled Navbar + Footer for the whole ecosystem.
  themes: ['@zcohen-nerd/brand'],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Surfer Fleet was unpublished pending a complete rewrite; its
        // source is preserved in drafts/projects/surfer-fleet/. Old
        // bookmarks land on the Projects index.
        redirects: [
          {
            from: '/projects/surfer-fleet',
            to: '/projects/',
          },
        ],
      },
    ],
  ],

  customFields: {
    brand: {
      projectName: 'Portfolio',
      projectFamily: 'engineering',
      projectUrl: 'https://portfolio.zcohen-nerd.com/',
      repoUrl: 'https://github.com/zcohen-nerd/Portfolio',
      attribution:
        'The engineering portfolio of Zachary Cohen — part of the zcohen-nerd ecosystem.',
      // isHub renders navLinks in the shared Navbar; here they are this
      // site's own sections rather than hub destinations.
      isHub: true,
      navLinks: [
        {label: 'Projects', href: '/projects/'},
        {label: 'FIRST Robotics', href: '/frc/'},
        {label: 'Teaching', href: '/teaching/'},
        {label: 'Writing & Research', href: '/documentation/'},
      ],
      connectLinks: [
        {label: 'GitHub', href: 'https://github.com/zcohen-nerd'},
        {label: 'LinkedIn', href: 'https://www.linkedin.com/in/zachary-cohen-nerd/'},
        {label: 'Email', href: 'mailto:zachary@zcohen-nerd.com'},
      ],
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // Content lives in src/pages — no docs, no blog.
        docs: false,
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/og-zac-cohen-portfolio.png',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      // Navbar/Footer are fully provided by @zcohen-nerd/brand; these stay empty.
      navbar: {items: []},
      footer: {style: 'dark', links: []},
    }),
};

module.exports = config;
