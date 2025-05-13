import { fetchGraphQL } from './client';
import {
  QUERY_ALL_POSTS,
  QUERY_POST_BY_SLUG,
  QUERY_POSTS_BY_CATEGORY,
  QUERY_POSTS_BY_TAG,
  QUERY_ALL_CATEGORIES,
  QUERY_ALL_TAGS,
  QUERY_SITE_DATA,
} from './queries';
import type {
  PostsQueryResponse,
  PostBySlugResponse,
  SettingsQueryResponse,
  TagsQueryResponse,
  CategoriesQueryResponse,
  WPPost,
  WPTaxonomyNode,
  WPPostConnection,
} from './types';

export const DEFAULT_POSTS_PER_PAGE = 10;

export async function getSiteData() {
  const data = await fetchGraphQL<SettingsQueryResponse>(QUERY_SITE_DATA);
  return data.generalSettings;
}

export async function getAllPosts(first = DEFAULT_POSTS_PER_PAGE, after?: string) {
  const data = await fetchGraphQL<PostsQueryResponse>(QUERY_ALL_POSTS, {
    first,
    after,
  });
  return data.posts;
}

export async function getPostBySlug(slug: string): Promise<WPPost> {
  const data = await fetchGraphQL<PostBySlugResponse>(QUERY_POST_BY_SLUG, {
    slug,
  });
  return data.post;
}

interface CategoryPostsResponse {
  category: {
    id: string;
    name: string;
    posts: WPPostConnection;
  };
}

interface TagPostsResponse {
  tag: {
    id: string;
    name: string;
    posts: WPPostConnection;
  };
}

export async function getPostsByCategory(
  categoryId: string,
  first = DEFAULT_POSTS_PER_PAGE,
  after?: string
) {
  const data = await fetchGraphQL<CategoryPostsResponse>(QUERY_POSTS_BY_CATEGORY, {
    categoryId,
    first,
    after,
  });
  return data.category.posts;
}

export async function getPostsByTag(
  tagId: string,
  first = DEFAULT_POSTS_PER_PAGE,
  after?: string
) {
  const data = await fetchGraphQL<TagPostsResponse>(QUERY_POSTS_BY_TAG, {
    tagId,
    first,
    after,
  });
  return data.tag.posts;
}

export async function getAllCategories(
  first = 100,
  after?: string
): Promise<WPTaxonomyNode[]> {
  const data = await fetchGraphQL<CategoriesQueryResponse>(QUERY_ALL_CATEGORIES, {
    first,
    after,
  });
  return data.categories.nodes;
}

export async function getAllTags(
  first = 100,
  after?: string
): Promise<WPTaxonomyNode[]> {
  const data = await fetchGraphQL<TagsQueryResponse>(QUERY_ALL_TAGS, {
    first,
    after,
  });
  return data.tags.nodes;
} 