import clsx from 'clsx';
import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className, id }: SectionProps) {
  return (
    <section className={clsx(`py-12`, className)} id={id}>
      {children}
    </section>
  );
}
