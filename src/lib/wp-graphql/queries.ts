import { PostFields } from './client';

export const QUERY_SITE_DATA = `
  query SiteData {
    generalSettings {
      title
      description
    }
  }
`;

export const QUERY_ALL_POSTS = `
  query AllPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        ...PostFields
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${PostFields}
`;

export const QUERY_POST_BY_SLUG = `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...PostFields
    }
  }
  ${PostFields}
`;

export const QUERY_POSTS_BY_CATEGORY = `
  query PostsByCategory($categoryId: ID!, $first: Int, $after: String) {
    category(id: $categoryId, idType: SLUG) {
      id
      name
      posts(first: $first, after: $after) {
        nodes {
          ...PostFields
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${PostFields}
`;

export const QUERY_POSTS_BY_TAG = `
  query PostsByTag($tagId: ID!, $first: Int, $after: String) {
    tag(id: $tagId, idType: SLUG) {
      id
      name
      posts(first: $first, after: $after) {
        nodes {
          ...PostFields
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${PostFields}
`;

export const QUERY_ALL_CATEGORIES = `
  query AllCategories($first: Int, $after: String) {
    categories(first: $first, after: $after) {
      nodes {
        id
        name
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_ALL_TAGS = `
  query AllTags($first: Int, $after: String) {
    tags(first: $first, after: $after) {
      nodes {
        id
        name
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`; 