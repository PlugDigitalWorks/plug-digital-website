import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: string;
  wrapperClassName?: string;
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
  leftIcon,
  className,
  wrapperClassName,
  error,
  ...props
}) => {
  return (
    <div className={clsx('relative w-full', wrapperClassName)}>
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <Image
            src={`/icons/${leftIcon}`}
            alt=""
            width={20}
            height={20}
            className="opacity-60"
          />
        </span>
      )}
      <input
        className={clsx(
          'w-full rounded-md bg-[#FAF6F2] px-4 py-2 focus:outline-none focus:ring-2 text-[#3A2121] placeholder-[#3A2121]/60',
          leftIcon && '!pl-10',
          error
            ? 'border-red-500 focus:ring-red-400'
            : 'border-[#EAD6C2] focus:ring-[#E1B989]',
          className,
        )}
        {...props}
      />
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
  error?: boolean;
}
export const Select: React.FC<SelectProps> = ({
  className,
  wrapperClassName,
  children,
  error,
  ...props
}) => {
  return (
    <div className={clsx('relative w-full', wrapperClassName)}>
      <select
        className={clsx(
          'w-full rounded-md bg-[#FAF6F2] px-4 py-2 appearance-none focus:outline-none focus:ring-2 text-[#3A2121]',
          error
            ? 'border-red-500 focus:ring-red-400'
            : 'border-[#EAD6C2] focus:ring-[#E1B989]',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#3A2121]">
        <Image
          src="/icons/arrow-down.svg"
          alt="Dropdown"
          width={18}
          height={18}
          className="ml-1"
        />
      </span>
    </div>
  );
};
