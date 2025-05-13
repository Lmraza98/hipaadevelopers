import { WPPost } from './types';

export interface TransformedPost {
  id: string;
  title: string;
  slug: string;
  date: Date;
  modifiedDate: Date;
  content: {
    raw: string;
    rendered: string;
  };
  excerpt: {
    raw: string;
    rendered: string;
  };
  featuredImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
  } | null;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  meta: {
    readingTime: number;
    wordCount: number;
  };
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function cleanHtml(html: string): string {
  // Remove WordPress-specific classes and inline styles
  return html
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTextFromHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

export function transformPost(post: WPPost): TransformedPost {
  const cleanContent = cleanHtml(post.content);
  const cleanExcerpt = cleanHtml(post.excerpt);
  const textContent = extractTextFromHtml(post.content);

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: new Date(post.date),
    modifiedDate: new Date(post.modified),
    content: {
      raw: post.content,
      rendered: cleanContent,
    },
    excerpt: {
      raw: post.excerpt,
      rendered: cleanExcerpt,
    },
    featuredImage: post.featuredImage?.node ? {
      url: post.featuredImage.node.sourceUrl,
      alt: post.featuredImage.node.altText,
      width: post.featuredImage.node.mediaDetails.width,
      height: post.featuredImage.node.mediaDetails.height,
    } : null,
    categories: post.categories.nodes.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
    tags: post.tags.nodes.map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
    meta: {
      readingTime: calculateReadingTime(textContent),
      wordCount: textContent.split(/\s+/).length,
    },
  };
}

export function transformPosts(posts: WPPost[]): TransformedPost[] {
  return posts.map(transformPost);
}

// Helper function to format dates consistently
export function formatPostDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Helper function to generate post excerpt
export function generateExcerpt(content: string, maxLength: number = 160): string {
  const text = extractTextFromHtml(content);
  if (text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
}

// Helper function to extract first image from content
export function extractFirstImage(content: string): string | null {
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

// Helper function to extract headings from content
export function extractHeadings(content: string): Array<{ level: number; text: string }> {
  const headings: Array<{ level: number; text: string }> = [];
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/g;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      text: extractTextFromHtml(match[2]),
    });
  }

  return headings;
} 