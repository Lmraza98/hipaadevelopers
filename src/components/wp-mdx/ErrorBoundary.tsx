'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MDXErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to your error reporting service
    console.error('MDX Rendering Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-200 rounded bg-red-50">
          <h3 className="text-red-800 font-semibold mb-2">Content Rendering Error</h3>
          <p className="text-red-600">
            {this.state.error?.message || 'An error occurred while rendering this content.'}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
} 