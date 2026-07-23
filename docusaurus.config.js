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
  // GitHub Pages serves directory-style URLs (/projects/sentry-v3/);
  // explicit so the sitemap uses the final, non-redirecting form.
  trailingSlash: true,

  organizationName: 'zcohen-nerd',
  projectName: 'Portfolio',

  onBrokenLinks: 'throw',
  markdown: {
    // .md files are CommonMark (raw HTML passes through unchanged — the
    // ported Jekyll content uses class/style attributes); .mdx files are MDX.
    format: 'detect',
    // Render ```mermaid fences via @docusaurus/theme-mermaid.
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  // Structured data: shared Person identity only. A global ProfilePage was
  // previously injected on EVERY route, wrongly declaring each page to be
  // the portfolio homepage — removed. A homepage-only ProfilePage is
  // deferred (the CommonMark homepage cannot cleanly host per-page head
  // tags without an MDX conversion risk).
  headTags: [
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Zac Cohen',
        alternateName: 'Zachary Cohen',
        url: 'https://zcohen-nerd.com/',
        jobTitle: 'Electromechanical Systems Engineer',
        sameAs: [
          'https://github.com/zcohen-nerd',
          'https://www.linkedin.com/in/zachary-cohen-nerd/',
          'https://zcohennerd.substack.com/',
        ],
      }),
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Mermaid diagram rendering + shared brand (swizzled Navbar + Footer).
  themes: ['@docusaurus/theme-mermaid', '@zcohen-nerd/brand'],

  // Pause ambient autoplay video for prefers-reduced-motion users.
  clientModules: [require.resolve('./src/clientModules/reduced-motion.js')],

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
