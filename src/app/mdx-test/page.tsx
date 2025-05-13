import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts } from '@/lib/wp-graphql/service';
import { convertToMDX } from '@/lib/wp-graphql/mdx';
import { transformPosts } from '@/lib/wp-graphql/transform';
import { WPShortcode, WPFigure, WPFigCaption, WPQuote, WPPullQuote, WPTableContainer } from '@/components/wp-mdx';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import CtaBanner from '@/components/ui/cta-banner';
import '@/components/wp-mdx/styles.css';
import { MDXErrorBoundary } from '@/components/wp-mdx/ErrorBoundary';

// MDX components mapping
const components = {
  WPShortcode,
  WPFigure,
  WPFigCaption,
  WPQuote,
  WPPullQuote,
  WPTableContainer,
  Button,
  Image,
};

export default async function MDXTestPage() {
  try {
    // Fetch and transform posts
    const postsData = await getAllPosts(1);
    const transformedPosts = transformPosts(postsData.nodes);

    if (!transformedPosts.length) {
      return <div>No posts found</div>;
    }

    // Convert the first post to MDX
    const mdxContent = await convertToMDX(transformedPosts[0]);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{mdxContent.frontmatter.title}</h1>
        
        <div className="prose prose-lg max-w-none">
          <MDXErrorBoundary>
            <MDXRemote
              source={mdxContent.content}
              components={components}
            />
          </MDXErrorBoundary>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Post Metadata</h2>
          <dl className="grid grid-cols-2 gap-4">
            <dt className="font-medium">Published</dt>
            <dd>{new Date(mdxContent.frontmatter.date).toLocaleDateString()}</dd>
            
            <dt className="font-medium">Modified</dt>
            <dd>{new Date(mdxContent.frontmatter.modifiedDate).toLocaleDateString()}</dd>
            
            <dt className="font-medium">Categories</dt>
            <dd>{mdxContent.frontmatter.categories.join(', ')}</dd>
            
            <dt className="font-medium">Tags</dt>
            <dd>{mdxContent.frontmatter.tags.join(', ')}</dd>
            
            <dt className="font-medium">Reading Time</dt>
            <dd>{mdxContent.frontmatter.readingTime} minutes</dd>
            
            <dt className="font-medium">Word Count</dt>
            <dd>{mdxContent.frontmatter.wordCount} words</dd>
          </dl>
        </div>

        <CtaBanner
          title="Explore Our Services"
          bodyText="Learn more about how we can help you achieve HIPAA compliance and develop secure healthcare solutions."
          buttonText="Visit hipaadevelopment.com"
          buttonLink="https://hipaadevelopment.com"
          className="mt-8"
        />

      </div>
    );
  } catch (error) {
    console.error('Error in MDXTestPage:', error);
    return <div>Error loading content</div>;
  }
} 