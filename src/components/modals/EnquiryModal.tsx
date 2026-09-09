import React, { useState } from 'react';
import Modal from '../tools/Modal';
import { Input } from '../ui/input';
import Button from '../ui/button';
import clsx from 'clsx';

interface EnquiryModalProps {
  show: boolean;
  onClose: () => void;
  model?: string;
}

export default function EnquiryModal({
  show,
  onClose,
  model = '',
}: EnquiryModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada API'ye gönderim yapılabilir
    setSuccess(true);
  };

  return (
    <Modal show={show} onClose={onClose} closeIconBlack={true}>
      <div
        className={clsx(
          'bg-white rounded-2xl shadow-xl p-8 w-full',
          'flex flex-col items-center',
        )}
      >
        {!success ? (
          <>
            <h2 className="text-3xl font-secondary text-primary mb-8 w-full text-left">
              Enquiry
            </h2>
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <Input
                value={model}
                disabled
                className="bg-[#F3F1F0] text-primary/80"
                wrapperClassName="w-full"
                placeholder="Model"
              />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name"
                wrapperClassName="w-full"
              />
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Phone Number"
                wrapperClassName="w-full"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                placeholder="Email"
                wrapperClassName="w-full"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Message"
                className="w-full rounded-md border border-[#EAD6C2] bg-[#FAF6F2] px-4 py-2 min-h-[80px] text-[#3A2121] placeholder-[#3A2121]/60"
                style={{ resize: 'vertical' }}
              />
              <Button
                type="submit"
                variant="secondary"
                className="w-full mt-4 py-3 text-lg"
              >
                Send Message
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 p-8">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              className="text-green-600 mb-2"
            >
              <circle cx="12" cy="12" r="12" fill="#E6F4EA" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#22C55E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="text-2xl font-secondary text-primary mb-2 text-center">
              Your message has been successfully sent!
            </h2>
            <div className="text-primary/80 text-base mb-4 text-center">
              Our expert team will review your inquiry and get back to you as
              soon as possible. Thank you for reaching out to us.
            </div>
            <Button variant="secondary" className="w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
