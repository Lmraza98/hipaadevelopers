import React from 'react';

interface WPShortcodeProps {
  children: React.ReactNode;
  className?: string;
}

export function WPShortcode({ children, className }: WPShortcodeProps) {
  // Process shortcode content and render appropriate component
  const shortcodeContent = children?.toString() || '';
  const parts = shortcodeContent.split(' ');
  const name = parts[0];
  const attributes = parts.slice(1).reduce<Record<string, string>>((acc, part) => {
    const [key, value] = part.split('=');
    if (key && value) {
      acc[key] = value.replace(/['"]/g, '');
    }
    return acc;
  }, {});

  switch (name.toLowerCase()) {
    case 'gallery':
      return (
        <div 
          className={`wp-gallery ${className || ''}`}
          data-columns={attributes.columns || '3'}
          data-size={attributes.size || 'medium'}
        >
          {children}
        </div>
      );
    case 'video':
      return (
        <div 
          className={`wp-video ${className || ''}`}
          data-width={attributes.width}
          data-height={attributes.height}
        >
          {children}
        </div>
      );
    case 'audio':
      return (
        <div 
          className={`wp-audio ${className || ''}`}
          data-src={attributes.src}
        >
          {children}
        </div>
      );
    default:
      // For unknown shortcodes, render as a div with shortcode name as class
      return (
        <div 
          className={`wp-shortcode wp-shortcode-${name} ${className || ''}`}
          {...attributes}
        >
          {children}
        </div>
      );
  }
}

interface WPCaptionProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  width?: number;
}

export function WPCaption({ children, className, align = 'center', width }: WPCaptionProps) {
  const style = width ? { maxWidth: width } : undefined;
  
  return (
    <figure 
      className={`wp-caption align${align} ${className || ''}`}
      style={style}
    >
      {children}
    </figure>
  );
}

interface WPFigureProps {
  children: React.ReactNode;
  className?: string;
}

export function WPFigure({ children, className }: WPFigureProps) {
  return (
    <figure className={`wp-figure ${className || ''}`}>
      {children}
    </figure>
  );
}

interface WPFigCaptionProps {
  children: React.ReactNode;
  className?: string;
}

export function WPFigCaption({ children, className }: WPFigCaptionProps) {
  return (
    <figcaption className={`wp-caption ${className || ''}`}>
      {children}
    </figcaption>
  );
}

interface WPQuoteProps {
  children: React.ReactNode;
  className?: string;
  cite?: string;
}

export function WPQuote({ children, className, cite }: WPQuoteProps) {
  return (
    <blockquote className={`wp-quote ${className || ''}`} cite={cite}>
      {children}
    </blockquote>
  );
}

interface WPPullQuoteProps {
  children: React.ReactNode;
  className?: string;
}

export function WPPullQuote({ children, className }: WPPullQuoteProps) {
  return (
    <blockquote className={`wp-pullquote ${className || ''}`}>
      {children}
    </blockquote>
  );
}

interface WPTableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function WPTableContainer({ children, className }: WPTableContainerProps) {
  return (
    <div className={`wp-table-container ${className || ''}`}>
      {children}
    </div>
  );
} 