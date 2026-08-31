// @ts-check
// Engineering portfolio at portfolio.zcohen-nerd.com.
// Chrome (Navbar + Footer) comes from the @zcohen-nerd/brand theme; the
// themeConfig navbar/footer here are intentionally minimal — the swizzled
// components ignore them.

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Zac Cohen Portfolio',
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
  onBrokenAnchors: 'throw',
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
        image: 'https://zcohen-nerd.com/img/zachary-cohen-headshot.jpg',
        jobTitle: 'Electromechanical Systems Engineer',
        // Matches the About page: a one-line summary, no employer / location.
        description:
          'Systems-minded electromechanical engineer, maker, and educator — builder of practical engineering tools, technical guides, and open educational resources.',
        // Only topics that appear on the sites' own pages. No invented terms.
        knowsAbout: [
          'Electromechanical systems integration',
          'Autonomous maritime systems',
          'Embedded hardware bring-up',
          'Hardware safety architecture',
          'PCB design',
          'Connector and interface engineering',
          'Fusion 360',
          'Engineering documentation',
          'Engineering education',
        ],
        sameAs: [
          'https://github.com/zcohen-nerd',
          'https://www.linkedin.com/in/zachary-cohen-nerd/',
          'https://zcohennerd.substack.com/',
          'https://portfolio.zcohen-nerd.com/',
        ],
      }),
    },
    // Icons + a minimal, non-PWA web manifest (display: "browser", no service
    // worker). Docusaurus already emits <link rel="icon"> from `favicon`.
    {tagName: 'link', attributes: {rel: 'apple-touch-icon', href: '/apple-touch-icon.png'}},
    {tagName: 'link', attributes: {rel: 'manifest', href: '/site.webmanifest'}},
    {tagName: 'meta', attributes: {name: 'theme-color', content: '#0a1428'}},
    // Search Console verification — paste the token from Google Search Console /
    // Bing Webmaster Tools and uncomment, then rebuild. See
    // SEARCH-CONSOLE-CHECKLIST.md. (No console change has been made.)
    // {tagName: 'meta', attributes: {name: 'google-site-verification', content: 'REPLACE_ME'}},
    // {tagName: 'meta', attributes: {name: 'msvalidate.01', content: 'REPLACE_ME'}},
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Mermaid diagram rendering + shared brand (swizzled Navbar + Footer).
  themes: ['@docusaurus/theme-mermaid', '@zcohen-nerd/brand'],

  // Pause ambient autoplay video for prefers-reduced-motion users.
  clientModules: [require.resolve('./src/clientModules/reduced-motion.js')],

  customFields: {
    brand: {
      projectName: 'Portfolio',
      projectFamily: 'engineering',
      projectUrl: 'https://portfolio.zcohen-nerd.com/',
      repoUrl: 'https://github.com/zcohen-nerd/Portfolio',
      attribution:
        'The engineering portfolio of Zac Cohen — part of the zcohen-nerd ecosystem.',
      // isHub renders navLinks in the shared Navbar; here they are this
      // site's own sections rather than hub destinations.
      isHub: true,
      navLinks: [
        {label: 'Projects', href: '/projects/'},
        {label: 'FIRST Robotics', href: '/frc/'},
        {label: 'Teaching', href: '/teaching/'},
        {label: 'Writing & Research', href: '/documentation/'},
        {label: 'About', href: '/about/'},
      ],
      connectLinks: [
        {label: 'GitHub', href: 'https://github.com/zcohen-nerd'},
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/zachary-cohen-nerd/',
        },
        {label: 'Email', href: 'mailto:zachary@zcohen-nerd.com'},
        {label: 'Privacy', href: '/privacy/'},
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
