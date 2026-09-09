import React, { useState } from 'react';
import Modal from './Modal';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import clsx from 'clsx';

// Images for each step
const loginImage = '/images/login-banner.png';
const signupImage = '/images/signup-banner.png';
const resetImage = '/images/forget-banner.png';

export type AuthStep =
  | 'login'
  | 'signup'
  | 'reset-request'
  | 'reset-sent'
  | 'reset-new'
  | 'reset-success'
  | 'google-check-email'
  | 'google-success';

type AuthModalProps = {
  show: boolean;
  onClose: () => void;
  initialStep?: AuthStep;
};

export default function AuthModal({
  show,
  onClose,
  initialStep = 'login',
}: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>(initialStep);
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  // Signup fields
  const [agree, setAgree] = useState(false);
  const [marketing, setMarketing] = useState(false);
  // Reset password fields
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Helper for image selection
  const getImage = () => {
    if (step === 'signup') return signupImage;
    if (step.startsWith('reset')) return resetImage;
    return loginImage;
  };

  // Layout helpers
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      className={clsx(
        'flex flex-col lg:flex-row bg-white rounded-2xl overflow-hidden shadow-xl',
        'w-[95vw] max-w-[540px] lg:max-w-2xl',
      )}
    >
      {/* Left: Form (or on mobile, below image) */}
      <div className="flex-1 flex flex-col justify-center p-4 max-lg:p-0">
        {children}
      </div>
      {/* Right: Image (desktop), Top: Image (mobile) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-black/90 relative min-h-[400px]">
        <Image
          src={getImage()}
          alt="Auth Visual"
          width={320}
          height={320}
          className="object-cover shadow-lg w-full h-full"
        />
      </div>
    </div>
  );
  const TopImage = () => (
    <div className="lg:hidden w-full flex items-center justify-center bg-black/90 mb-4 max-h-[250px] overflow-hidden">
      <Image
        src={getImage()}
        alt="Auth Visual"
        width={220}
        height={220}
        className="object-cover shadow-lg w-full h-full"
      />
    </div>
  );

  // Screens
  const renderLogin = () => (
    <>
      <TopImage />
      <div className="p-4">
        <h2 className="text-2xl font-secondary text-primary mb-6 text-center lg:text-left">
          Log In
        </h2>
        <form className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex items-center justify-between text-xs text-primary/80">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
                className="accent-secondary"
              />
              Stay Logged in
            </label>
            <button
              type="button"
              className="hover:underline text-primary/60"
              onClick={() => setStep('reset-request')}
            >
              Forgot your password?
            </button>
          </div>
          <Button type="submit" variant="primary" className="w-full mt-2">
            Log In
          </Button>
          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-primary/20" />
            <span className="text-primary/60 text-xs">OR</span>
            <div className="flex-1 h-px bg-primary/20" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
            onClick={() => setStep('google-check-email')}
          >
            <Image
              src="/icons/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
          >
            <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
            Continue with Apple
          </Button>
        </form>
        <div className="mt-6 text-xs text-primary/80 text-center">
          Don't have an account?{' '}
          <button
            className="text-secondary hover:underline"
            onClick={() => setStep('signup')}
            type="button"
          >
            Sign Up
          </button>
        </div>
      </div>
    </>
  );

  const renderSignup = () => (
    <>
      <TopImage />
      <div className="p-4">
        <h2 className="text-2xl font-secondary text-primary mb-6 text-center lg:text-left">
          Sign Up
        </h2>
        <form className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="flex items-center gap-2 text-xs text-primary/80">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="accent-secondary"
              required
            />
            By creating an account, I agree to this website's privacy policy and
            terms of service
          </label>
          <label className="flex items-center gap-2 text-xs text-primary/80">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="accent-secondary"
            />
            I consent to receive marketing emails.
          </label>
          <Button type="submit" variant="primary" className="w-full mt-2">
            Sign Up
          </Button>
        </form>
        <div className="mt-6 text-xs text-primary/80 text-center">
          Already have an account?{' '}
          <button
            className="text-secondary hover:underline"
            onClick={() => setStep('login')}
            type="button"
          >
            Log in
          </button>
        </div>
      </div>
    </>
  );

  const renderResetRequest = () => (
    <>
      <TopImage />
      <div className="p-4">
        <h2 className="text-2xl font-secondary text-primary mb-6 text-center lg:text-left">
          Reset Password
        </h2>
        <div className="text-primary/80 text-sm mb-4">
          Lost your password? Please enter your email address. You will receive
          a link to create a new password via email.
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setStep('reset-sent');
          }}
        >
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" className="w-full mt-2">
            Send
          </Button>
        </form>
      </div>
    </>
  );

  const renderResetSent = () => (
    <>
      <TopImage />
      <div className="p-4">
        <h2 className="text-2xl font-secondary text-primary mb-6 text-center lg:text-left">
          Reset Password
        </h2>
        <div className="bg-green-50 border border-green-400 text-green-700 rounded px-4 py-3 mb-6 text-sm">
          Thank you. We have sent you an email with a link to reset your
          password. Please follow this link to create a new password.
        </div>
        <Button
          variant="primary"
          className="w-full"
          onClick={() => setStep('login')}
        >
          Back to Log in
        </Button>
      </div>
    </>
  );

  const renderResetNew = () => (
    <>
      <TopImage />
      <div className="p-4">
        <h2 className="text-2xl font-secondary text-primary mb-6 text-center lg:text-left">
          Reset Password
        </h2>
        <div className="text-primary/80 text-sm mb-4">
          Please enter and confirm your new password. Make sure it meets
          security standards for your protection.
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setStep('reset-success');
          }}
        >
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirmed Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" className="w-full mt-2">
            Reset Password
          </Button>
        </form>
      </div>
    </>
  );

  const renderResetSuccess = () => (
    <>
      <TopImage />
      <div className="flex flex-col items-center justify-center gap-6 p-4">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          className="text-green-600"
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
          Password Successfully Reset
        </h2>
        <div className="text-primary/80 text-sm mb-4 text-center">
          Your password has been updated. You can now log in with your new
          credentials.
        </div>
        <Button
          variant="primary"
          className="w-full"
          onClick={() => setStep('login')}
        >
          Log In
        </Button>
      </div>
    </>
  );

  // Google/Apple linking flows (optional, can be extended as needed)
  const renderGoogleCheckEmail = () => (
    <>
      <TopImage />
      <div className="p-4">
        <h2 className="text-2xl font-secondary text-primary mb-6 text-center lg:text-left">
          Account found, check emails now
        </h2>
        <div className="text-primary/80 text-sm mb-4">
          In order to log in quickly and easily using your Google account, you
          need to verify the link with your account.
          <br />
          Please follow the instructions in the email we sent to
          johndalton@gmail.com.
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setStep('google-success');
          }}
        >
          <Input
            type="text"
            placeholder="Enter Code"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" className="w-full mt-2">
            Send
          </Button>
        </form>
        <div className="text-xs text-primary/60 mt-2">
          Didn't receive an email? Please check your spam folder or request{' '}
          <a href="#" className="underline">
            another email
          </a>
          .
        </div>
      </div>
    </>
  );

  const renderGoogleSuccess = () => (
    <>
      <TopImage />
      <div className="flex flex-col items-center justify-center gap-6 p-4">
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          className="text-green-600"
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
          Your account has been linked with your Google account
        </h2>
        <div className="text-primary/80 text-sm mb-4 text-center">
          We have successfully linked your account with your Google account. Now
          you can log in to our platform quickly and easily using Google or your
          regular login information.
        </div>
        <Button
          variant="primary"
          className="w-full"
          onClick={() => setStep('login')}
        >
          View Collection
        </Button>
      </div>
    </>
  );

  // Main render
  return (
    <Modal
      show={show}
      onClose={() => {
        onClose();
        setStep('login');
      }}
    >
      <Wrapper>
        {step === 'login' && renderLogin()}
        {step === 'signup' && renderSignup()}
        {step === 'reset-request' && renderResetRequest()}
        {step === 'reset-sent' && renderResetSent()}
        {step === 'reset-new' && renderResetNew()}
        {step === 'reset-success' && renderResetSuccess()}
        {step === 'google-check-email' && renderGoogleCheckEmail()}
        {step === 'google-success' && renderGoogleSuccess()}
      </Wrapper>
    </Modal>
  );
}
