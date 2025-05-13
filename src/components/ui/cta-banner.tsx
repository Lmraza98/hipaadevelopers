'use client';
import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { usePlausible } from 'next-plausible';
import { cn } from '@/lib/utils'; // Assuming clsx and tailwind-merge are set up in utils

export interface CtaBannerProps {
  title: string;
  bodyText: string;
  buttonText: string;
  buttonLink: string;
  imageUrl?: string;
  backgroundColor?: string; // Consider Tailwind color classes e.g., 'bg-blue-500' or allow arbitrary
  className?: string;
}

const CtaBanner: React.FC<CtaBannerProps> = ({
  title,
  bodyText,
  buttonText,
  buttonLink,
  imageUrl,
  backgroundColor = 'bg-slate-100', // Default background
  className,
}) => {
  const plausible = usePlausible();

  return (
    <div
      className={cn(
        'p-6 rounded-lg shadow-md',
        backgroundColor, // Apply background color class
        'flex flex-col md:flex-row items-center', // Responsive layout
        className
      )}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title} // Or a more descriptive alt text if available
          width={128} // Add required width prop for Next/Image
          height={128} // Add required height prop for Next/Image
          className='w-24 h-24 md:w-32 md:h-32 object-cover rounded-md mb-4 md:mb-0 md:mr-6'
        />
      )}
      <div className='text-center md:text-left flex-grow'>
        <h2 className='text-xl font-semibold mb-2'>{title}</h2>
        <p className='text-gray-700 mb-4'>{bodyText}</p>
      </div>
      <a
        href={buttonLink}
        target='_blank'
        rel='noopener noreferrer'
        onClick={() => plausible('CTA Banner Click', { props: { link: buttonLink } })}
        className={cn(
          'mt-4 md:mt-0 md:ml-6',
          'px-6 py-3 rounded-md font-medium text-white',
          'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
          'transition-colors duration-150 ease-in-out' // Smooth transition
        )}
      >
        {buttonText}
      </a>
    </div>
  );
};

export default CtaBanner; 