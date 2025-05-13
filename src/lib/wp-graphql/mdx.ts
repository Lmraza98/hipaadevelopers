import { unified } from 'unified';
import remarkRehype from 'remark-rehype';
import remarkMdx from 'remark-mdx';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import matter from 'gray-matter';
import { decode } from 'html-entities';
import type { TransformedPost } from './transform';
import { LRUCache } from 'lru-cache';

interface MDXContent {
  frontmatter: {
    title: string;
    date: string;
    modifiedDate: string;
    slug: string;
    excerpt: string;
    featuredImage?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    };
    categories: string[];
    tags: string[];
    readingTime: number;
    wordCount: number;
  };
  content: string;
}

interface BlockPattern {
  pattern: RegExp;
  replacement: ((match: string, content: string) => string) | (() => string);
}

// WordPress block patterns for conversion
const WP_BLOCKS: Record<string, BlockPattern> = {
  QUOTE: {
    pattern: /<blockquote[^>]*class="wp-block-quote"[^>]*>(.*?)<\/blockquote>/g,
    replacement: (_: string, content: string) => `<WPQuote>${content}</WPQuote>`,
  },
  PULLQUOTE: {
    pattern: /<blockquote[^>]*class="wp-block-pullquote"[^>]*>(.*?)<\/blockquote>/g,
    replacement: (_: string, content: string) => `<WPPullQuote>${content}</WPPullQuote>`,
  },
  TABLE: {
    pattern: /<figure[^>]*class="wp-block-table"[^>]*>(.*?)<\/figure>/g,
    replacement: (_: string, content: string) => `<WPTableContainer>${content}</WPTableContainer>`,
  },
  BUTTON: {
    pattern: /<div[^>]*class="wp-block-button"[^>]*>(.*?)<\/div>/g,
    replacement: (_: string, content: string) => `<Button variant="wordpress">${content}</Button>`,
  },
  SEPARATOR: {
    pattern: /<hr[^>]*class="wp-block-separator"[^>]*\/?>/g,
    replacement: () => `<Separator />`,
  },
  MEDIA_TEXT: {
    pattern: /<div[^>]*class="wp-block-media-text[^"]*"[^>]*>(.*?)<\/div>/g,
    replacement: (_: string, content: string) => `<div className="wp-media-text">${content}</div>`,
  },
  COLUMNS: {
    pattern: /<div[^>]*class="wp-block-columns[^"]*"[^>]*>(.*?)<\/div>/g,
    replacement: (_: string, content: string) => `<div className="wp-columns">${content}</div>`,
  },
  COLUMN: {
    pattern: /<div[^>]*class="wp-block-column[^"]*"[^>]*>(.*?)<\/div>/g,
    replacement: (_: string, content: string) => `<div className="wp-column">${content}</div>`,
  },
  GROUP: {
    pattern: /<div[^>]*class="wp-block-group[^"]*"[^>]*>(.*?)<\/div>/g,
    replacement: (_: string, content: string) => `<div className="wp-group">${content}</div>`,
  },
};

// Initialize LRU cache for MDX content
const mdxCache = new LRUCache<string, string>({
  max: 500, // Maximum number of items to store
  ttl: 1000 * 60 * 60, // Cache for 1 hour
});

async function convertHtmlToMdx(html: string): Promise<string> {
  // Check cache first
  const cacheKey = Buffer.from(html).toString('base64');
  const cached = mdxCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        // Allow className for styling
        '*': [...(defaultSchema.attributes?.['*'] || []), 'className'],
        // Allow Next.js Image props
        'img': [
          ...(defaultSchema.attributes?.['img'] || []),
          'width', 'height', 'loading', 'priority', 'sizes'
        ],
        // Allow data attributes for components
        'div': [
          ...(defaultSchema.attributes?.['div'] || []),
          ['data-*']
        ]
      },
      // Add custom components to allowed tags
      tagNames: [
        ...(defaultSchema.tagNames || []),
        'WPShortcode',
        'WPFigure',
        'WPFigCaption',
        'WPQuote',
        'WPPullQuote',
        'WPTableContainer',
        'Button',
        'Image',
        'Separator'
      ]
    })
    .use(remarkRehype)
    .use(remarkMdx)
    .use(rehypeStringify);

  // Pre-process HTML before conversion
  let processedHtml = html
    // Convert WordPress shortcodes to MDX components
    .replace(/\[([^\]]+)\]/g, (_, content) => `<WPShortcode>${content}</WPShortcode>`)
    // Handle WordPress captions
    .replace(/\[caption[^\]]*\](.*?)\[\/caption\]/g, (_, content) => 
      `<WPCaption>${content}</WPCaption>`
    )
    // Clean up WordPress-specific markup
    .replace(/<!--.*?-->/g, '') // Remove HTML comments
    .replace(/<div[^>]*wp-block[^>]*>/g, '<div>') // Clean WordPress block classes
    .trim();

  // Convert WordPress blocks to MDX components
  Object.values(WP_BLOCKS).forEach(({ pattern, replacement }) => {
    processedHtml = processedHtml.replace(pattern, replacement);
  });

  // Handle alignment classes
  processedHtml = processedHtml
    .replace(/class="align(left|right|center|wide|full)"/g, 'className="align$1"')
    .replace(/class="has-text-align-(left|right|center)"/g, 'className="text-$1"');

  const result = await processor.process(processedHtml);
  const mdxContent = result.toString();
  
  // Cache the result
  mdxCache.set(cacheKey, mdxContent);
  
  return mdxContent;
}

function cleanCodeBlocks(content: string): string {
  // First pass: Convert WordPress code blocks to MDX code blocks
  let processedContent = content.replace(
    /<pre[^>]*><code[^>]*class="(?:language-)?([^"]*)"[^>]*>([\s\S]*?)<\/code><\/pre>/g,
    (_, language, code) => {
      // Normalize language identifier
      const normalizedLang = normalizeLanguage(language);
      
      // Decode HTML entities and clean up the code
      const decodedCode = decode(code)
        .replace(/^\n+|\n+$/g, '') // Trim leading/trailing newlines
        .replace(/\n\s*\n/g, '\n'); // Normalize multiple newlines
      
      return `\`\`\`${normalizedLang}\n${decodedCode}\n\`\`\``;
    }
  );

  // Second pass: Handle inline code
  processedContent = processedContent.replace(
    /<code[^>]*>(.*?)<\/code>/g,
    (_, code) => {
      const decodedCode = decode(code).trim();
      return `\`${decodedCode}\``;
    }
  );

  return processedContent;
}

function normalizeLanguage(lang: string): string {
  // Map WordPress language identifiers to standard ones
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'php': 'php',
    'py': 'python',
    'rb': 'ruby',
    'sh': 'bash',
    'shell': 'bash',
    'yml': 'yaml',
    'json': 'json',
  };

  const normalized = lang.toLowerCase().trim();
  return languageMap[normalized] || normalized || 'text';
}

function processImages(content: string): string {
  // Convert WordPress image URLs to Next.js Image component
  let processedContent = content.replace(
    /<img[^>]+src="([^"]+)"[^>]*(?:srcset="([^"]+)")?[^>]*alt="([^"]*)"[^>]*(?:width="([^"]+)")?[^>]*(?:height="([^"]+)")?[^>]*>/g,
    (_, src, srcset, alt, width, height) => {
      // Extract the largest image from srcset if available
      const largestSrc = srcset ? 
        srcset.split(',')
          .map((s: string): [string, number] => {
            const [url, size] = s.trim().split(' ');
            return [url, parseInt(size || '0')];
          })
          .sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0][0] : 
        src;

      // Use provided dimensions or fallback to responsive
      const imgWidth = width ? parseInt(width) : 800;
      const imgHeight = height ? parseInt(height) : Math.round(imgWidth * 0.75); // 4:3 aspect ratio

      return `
<Image
  src="${largestSrc}"
  alt="${alt || ''}"
  width={${imgWidth}}
  height={${imgHeight}}
  className="wp-image"
  priority={false}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
/>`;
    }
  );

  // Handle WordPress figure/figcaption
  processedContent = processedContent.replace(
    /<figure[^>]*>\s*(<Image[^>]+\/>)\s*<figcaption[^>]*>(.*?)<\/figcaption>\s*<\/figure>/g,
    (_, image, caption) => `
<WPFigure>
  ${image}
  <WPFigCaption>${caption}</WPFigCaption>
</WPFigure>`
  );

  return processedContent;
}

function generateFrontmatter(post: TransformedPost): string {
  const frontmatter = {
    title: post.title,
    date: post.date.toISOString(),
    modifiedDate: post.modifiedDate.toISOString(),
    slug: post.slug,
    excerpt: post.excerpt.rendered,
    ...(post.featuredImage && {
      featuredImage: {
        url: post.featuredImage.url,
        alt: post.featuredImage.alt,
        width: post.featuredImage.width,
        height: post.featuredImage.height,
      },
    }),
    categories: post.categories.map(cat => cat.name),
    tags: post.tags.map(tag => tag.name),
    readingTime: post.meta.readingTime,
    wordCount: post.meta.wordCount,
  };

  return matter.stringify('', frontmatter).trim();
}

export async function convertToMDX(post: TransformedPost): Promise<MDXContent> {
  // Clean and prepare the content
  let content = post.content.rendered;
  
  // Convert code blocks first
  content = cleanCodeBlocks(content);
  
  // Convert to MDX
  content = await convertHtmlToMdx(content);
  
  // Process images
  content = processImages(content);
  
  // Generate frontmatter
  const frontmatterContent = generateFrontmatter(post);
  
  // Combine frontmatter and content
  const mdxContent = `${frontmatterContent}\n\n${content}`;
  
  // Parse the final MDX content
  const { data: frontmatter, content: finalContent } = matter(mdxContent);
  
  return {
    frontmatter: frontmatter as MDXContent['frontmatter'],
    content: finalContent,
  };
}

export async function convertMultipleToMDX(posts: TransformedPost[]): Promise<MDXContent[]> {
  return Promise.all(posts.map(post => convertToMDX(post)));
} 