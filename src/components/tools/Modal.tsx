'use client';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { X } from 'lucide-react';
import Image from 'next/image';
type Props = {
  show: boolean;
  onClose?: any;
  children?: React.ReactNode;
  closeIcon?: boolean;
  bg?: string;
  register?: boolean;
  closeIconBlack?: boolean;
};

const Modal = ({
  show,
  onClose,
  children,
  closeIcon = true,
  bg = 'bg-modal',
  register,
  closeIconBlack = false,
}: Props) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // useEffect(() => {
  //   //add body class overflow hidden if this modal exist.
  //   if (typeof window !== "undefined") {
  //     if (show) {
  //       setTimeout(() => {
  //         document.body.classList.add("overflow-hidden");
  //       }, 50);
  //     } else {
  //       document.body.classList.remove("overflow-hidden");
  //     }
  //   }
  // }, [show]);

  const handleCloseClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <>
      <div
        className={clsx(
          'fixed left-0 top-0 h-full w-full bg-[#00000050] blur-sm filter backdrop-blur-sm backdrop-filter ',
          register ? 'z-[9988]' : 'z-[9990]',
        )}
        onClick={handleCloseClick}
      ></div>
      <div
        className={clsx(
          'fixed left-1/2 top-1/2 flex h-max w-max -translate-x-1/2 -translate-y-1/2 items-center justify-center',
          register ? 'z-[9989]' : 'z-[9991]',
        )}
      >
        <div
          className={clsx(
            'relative max-h-[90svh] min-w-[90%] max-w-[90vw] overflow-y-auto lg:min-w-[580px] max-sm:max-w-full',
            bg,
          )}
        >
          {children}

          {closeIcon && (
            <div
              className={clsx(
                'absolute right-2 top-2 flex h-10 w-10 cursor-pointer items-center justify-center p-2 lg:top-2',
              )}
              onClick={handleCloseClick}
            >
              <Image
                src={
                  closeIconBlack
                    ? '/icons/close-circle-black.svg'
                    : '/icons/close-circle.svg'
                }
                alt="close"
                width={36}
                height={36}
              />
            </div>
          )}
        </div>
      </div>
    </>
  ) : null;

  if (isBrowser) {
    const modalRoot = document.getElementById('modal-root');
    return ReactDOM.createPortal(modalContent, modalRoot as Element);
  } else {
    return null;
  }
};

export default Modal;
