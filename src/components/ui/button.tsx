import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?:
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'outline'
  | 'disabled'
  | 'outline-white';
  className?: string;
  small?: boolean;
  href?: string;
};

export default function Button({
  children,
  variant = 'outline',
  className = '',
  small = false,
  href,
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    'rounded px-6 py-2 text-base font-normal transition whitespace-nowrap';
  const variants: Record<string, string> = {
    primary:
      'bg-secondary text-white border border-secondary hover:bg-secondary/90',
    secondary:
      'bg-white text-secondary border border-secondary hover:bg-secondary/10',
    tertiary:
      'bg-white text-primary border border-secondary hover:bg-secondary/10',
    outline:
      'bg-white text-[#3A2121] border border-[#3A2121] hover:bg-[#3A2121]/5',
    'outline-white':
      'bg-transparent text-white border border-white hover:bg-white/10',
    disabled:
      'bg-white text-secondary border border-secondary opacity-60 cursor-not-allowed',
  };
  const classes = clsx(
    base,
    variants[disabled ? 'disabled' : variant],
    small && 'text-sm px-4 py-1',
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
