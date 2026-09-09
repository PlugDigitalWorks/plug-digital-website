import React from 'react';
import Modal from '../tools/Modal';
import Button from '../ui/button';
import Image from 'next/image';
import clsx from 'clsx';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <Modal show={show} onClose={onClose} closeIconBlack={true}>
      <div
        className={clsx(
          'bg-white rounded-2xl shadow-xl p-4 md:p-8 w-full',
          'flex flex-col items-center max-h-[80vh] max-w-[90vw] overflow-y-auto',
        )}
      >
        <div className="w-full flex items-center justify-between mb-6">
          <h2 className="text-3xl font-secondary text-primary">Your Cart</h2>
        </div>
        <hr className="w-full mb-6 border-[#EAD6C2]" />
        {cart.length === 0 ? (
          <div className="text-primary/70 text-lg my-12">
            Your cart is empty.
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex items-start gap-3 w-full mb-6">
              <Image
                src={item.image}
                alt={item.title}
                width={60}
                height={60}
                className="rounded bg-[#F8F7F5] object-contain flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-base md:text-lg text-primary font-secondary font-medium mb-1 line-clamp-2 break-words">
                  {item.title}
                </div>
                <div className="text-sm md:text-base text-primary font-bold mb-2">
                  £{' '}
                  {item.price.toLocaleString('en-GB', {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="text-primary/60 text-xs underline hover:text-secondary"
                    onClick={() => removeFromCart(item.id)}
                    type="button"
                  >
                    Remove
                  </button>
                  <select
                    className="border rounded px-2 py-1 text-xs text-primary bg-white min-w-[60px]"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
        <Button
          variant="secondary"
          className="w-full mt-4 py-3 text-lg"
          disabled={cart.length === 0}
          onClick={handleCheckout}
        >
          Go to Checkout
        </Button>
      </div>
    </Modal>
  );
}
