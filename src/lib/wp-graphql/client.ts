import { GraphQLClient } from 'graphql-request';
import { cache } from 'react';

// Environment variables
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost/graphql';

// Create a cached client instance
export const getClient = cache(() => {
  return new GraphQLClient(WORDPRESS_API_URL, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

// Helper function to make cached GraphQL requests
export async function fetchGraphQL<TData, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables?: TVariables
): Promise<TData> {
  try {
    const client = getClient();
    const data = await client.request<TData>(query, variables);
    return data;
  } catch (error) {
    console.error('GraphQL fetch error:', error);
    throw error;
  }
}

// Common GraphQL fragments
export const PostFields = `
  fragment PostFields on Post {
    id
    title
    slug
    date
    modified
    content
    excerpt
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
    categories {
      nodes {
        id
        name
        slug
      }
    }
    tags {
      nodes {
        id
        name
        slug
      }
    }
  }
`; 