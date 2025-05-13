export interface WPImage {
  node: {
    sourceUrl: string;
    altText: string;
    mediaDetails: {
      width: number;
      height: number;
    };
  };
}

export interface WPTaxonomyNode {
  id: string;
  name: string;
  slug: string;
}

export interface WPPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  modified: string;
  content: string;
  excerpt: string;
  featuredImage: WPImage;
  categories: {
    nodes: WPTaxonomyNode[];
  };
  tags: {
    nodes: WPTaxonomyNode[];
  };
}

export interface WPPostConnection {
  nodes: WPPost[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

export interface WPSettings {
  generalSettings: {
    title: string;
    description: string;
  };
}

export interface WPPageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

// Query response types
export interface PostsQueryResponse {
  posts: WPPostConnection;
}

export interface PostBySlugResponse {
  post: WPPost;
}

export interface SettingsQueryResponse {
  generalSettings: {
    title: string;
    description: string;
  };
}

export interface TagsQueryResponse {
  tags: {
    nodes: WPTaxonomyNode[];
    pageInfo: WPPageInfo;
  };
}

export interface CategoriesQueryResponse {
  categories: {
    nodes: WPTaxonomyNode[];
    pageInfo: WPPageInfo;
  };
} 