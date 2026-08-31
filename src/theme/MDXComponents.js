import MDXComponents from '@theme-original/MDXComponents';
import Figure from '@site/src/components/Figure';
import ProjectAtAGlance from '@site/src/components/ProjectAtAGlance';
import RelatedWork from '@site/src/components/RelatedWork';

// Make the case-study primitives available in every .mdx page without a
// per-file import. Markdown (.md) pages are unaffected.
export default {
  ...MDXComponents,
  Figure,
  ProjectAtAGlance,
  RelatedWork,
};
