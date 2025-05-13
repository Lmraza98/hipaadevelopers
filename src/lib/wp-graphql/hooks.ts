import { useCallback, useEffect, useState } from 'react';
import * as wpService from './service';
import type { WPPost, WPTaxonomyNode, WPPostConnection } from './types';

interface UsePostsResult {
  posts: WPPost[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function usePosts(initialPosts?: WPPostConnection): UsePostsResult {
  const [posts, setPosts] = useState<WPPost[]>(initialPosts?.nodes || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(initialPosts?.pageInfo.hasNextPage || false);
  const [endCursor, setEndCursor] = useState(initialPosts?.pageInfo.endCursor);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const data = await wpService.getAllPosts(10, endCursor);
      setPosts(prev => [...prev, ...data.nodes]);
      setHasMore(data.pageInfo.hasNextPage);
      setEndCursor(data.pageInfo.endCursor);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load posts'));
    } finally {
      setIsLoading(false);
    }
  }, [endCursor, hasMore, isLoading]);

  return { posts, isLoading, error, hasMore, loadMore };
}

interface UsePostResult {
  post: WPPost | null;
  isLoading: boolean;
  error: Error | null;
}

export function usePost(slug: string, initialPost?: WPPost): UsePostResult {
  const [post, setPost] = useState<WPPost | null>(initialPost || null);
  const [isLoading, setIsLoading] = useState(!initialPost);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialPost) return;

    async function loadPost() {
      try {
        const data = await wpService.getPostBySlug(slug);
        setPost(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load post'));
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [slug, initialPost]);

  return { post, isLoading, error };
}

interface UseTaxonomyResult {
  items: WPTaxonomyNode[];
  isLoading: boolean;
  error: Error | null;
}

export function useCategories(initialCategories?: WPTaxonomyNode[]): UseTaxonomyResult {
  const [categories, setCategories] = useState<WPTaxonomyNode[]>(initialCategories || []);
  const [isLoading, setIsLoading] = useState(!initialCategories);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialCategories) return;

    async function loadCategories() {
      try {
        const data = await wpService.getAllCategories();
        setCategories(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load categories'));
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, [initialCategories]);

  return { items: categories, isLoading, error };
}

export function useTags(initialTags?: WPTaxonomyNode[]): UseTaxonomyResult {
  const [tags, setTags] = useState<WPTaxonomyNode[]>(initialTags || []);
  const [isLoading, setIsLoading] = useState(!initialTags);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (initialTags) return;

    async function loadTags() {
      try {
        const data = await wpService.getAllTags();
        setTags(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load tags'));
      } finally {
        setIsLoading(false);
      }
    }

    loadTags();
  }, [initialTags]);

  return { items: tags, isLoading, error };
} 