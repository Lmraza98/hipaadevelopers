import { useMemo } from 'react';
import { usePosts, usePost } from './hooks';
import { transformPosts, transformPost, TransformedPost } from './transform';
import type { WPPostConnection } from './types';

interface UseTransformedPostsResult {
  posts: TransformedPost[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useTransformedPosts(initialPosts?: WPPostConnection): UseTransformedPostsResult {
  const { posts, isLoading, error, hasMore, loadMore } = usePosts(initialPosts);

  const transformedPosts = useMemo(() => transformPosts(posts), [posts]);

  return {
    posts: transformedPosts,
    isLoading,
    error,
    hasMore,
    loadMore,
  };
}

interface UseTransformedPostResult {
  post: TransformedPost | null;
  isLoading: boolean;
  error: Error | null;
}

export function useTransformedPost(slug: string): UseTransformedPostResult {
  const { post, isLoading, error } = usePost(slug);
  
  const transformedPost = useMemo(
    () => (post ? transformPost(post) : null),
    [post]
  );

  return {
    post: transformedPost,
    isLoading,
    error,
  };
} 