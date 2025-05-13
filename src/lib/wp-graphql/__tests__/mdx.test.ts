import { convertToMDX } from '../mdx';
import type { TransformedPost } from '../transform';

describe('MDX Transformation', () => {
  const createMockPost = (content: string): TransformedPost => ({
    id: '1',
    title: 'Test Post',
    slug: 'test-post',
    date: new Date('2024-01-01'),
    modifiedDate: new Date('2024-01-02'),
    excerpt: {
      raw: 'Test excerpt',
      rendered: 'Test excerpt',
    },
    content: {
      raw: content,
      rendered: content,
    },
    categories: [],
    tags: [],
    featuredImage: null,
    meta: {
      readingTime: 1,
      wordCount: 2,
    },
  });

  describe('convertToMDX', () => {
    it('should convert basic HTML to MDX', async () => {
      const post = createMockPost('<p>Hello World</p>');
      const mdx = await convertToMDX(post);
      expect(mdx.content).toContain('Hello World');
    });

    it('should handle WordPress blocks', async () => {
      const post = createMockPost(`
        <!-- wp:paragraph -->
        <p>Test paragraph</p>
        <!-- /wp:paragraph -->
      `);
      const mdx = await convertToMDX(post);
      expect(mdx.content).toContain('Test paragraph');
    });

    it('should process code blocks with language', async () => {
      const post = createMockPost(`
        <pre><code class="language-typescript">
        const test: string = "Hello";
        </code></pre>
      `);
      const mdx = await convertToMDX(post);
      expect(mdx.content).toContain('```typescript');
      expect(mdx.content).toContain('const test: string = "Hello"');
    });

    it('should handle images with Next.js Image component', async () => {
      const post = createMockPost(`
        <figure>
          <img src="/test.jpg" alt="Test" width="800" height="600" />
          <figcaption>Test caption</figcaption>
        </figure>
      `);
      const mdx = await convertToMDX(post);
      expect(mdx.content).toContain('<WPFigure');
      expect(mdx.content).toContain('<Image');
      expect(mdx.content).toContain('<WPFigCaption');
    });

    it('should sanitize unsafe content', async () => {
      const post = createMockPost('<p>Test</p><script>alert("xss")</script>');
      const mdx = await convertToMDX(post);
      expect(mdx.content).toContain('Test');
      expect(mdx.content).not.toContain('script');
      expect(mdx.content).not.toContain('alert');
    });

    it('should include frontmatter', async () => {
      const post = createMockPost('<p>Test content</p>');
      const mdx = await convertToMDX(post);
      expect(mdx.frontmatter).toMatchObject({
        title: 'Test Post',
        date: expect.any(String),
        modifiedDate: expect.any(String),
        slug: 'test-post',
        excerpt: expect.any(String),
      });
    });
  });
}); 