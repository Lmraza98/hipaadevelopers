import '@testing-library/jest-dom';
import React from 'react';
import type { ImageProps } from 'next/image';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image(props: Omit<ImageProps, 'src'> & { src: string }) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return React.createElement('img', { ...props, alt: props.alt || '' });
  },
}));

// Mock unified and related packages
jest.mock('unified', () => ({
  unified: () => ({
    use: () => ({
      use: () => ({
        use: () => ({
          use: () => ({
            process: async (content: string) => ({
              toString: () => content,
            }),
          }),
        }),
      }),
    }),
  }),
}));

jest.mock('rehype-parse', () => () => ({}));
jest.mock('rehype-stringify', () => () => ({}));
jest.mock('rehype-sanitize', () => () => ({}));
jest.mock('remark-rehype', () => () => ({}));
jest.mock('remark-mdx', () => () => ({})); 