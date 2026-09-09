import clsx from 'clsx';
import React from 'react';

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx(`max-w-[1160px] mx-auto px-4 w-full`, className)}>
      {children}
    </div>
  );
}
