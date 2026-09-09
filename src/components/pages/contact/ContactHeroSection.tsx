'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import StatsSection from '@/components/CountUp';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const stats = [
  {
    icon: '/icons/box.svg',
    label: '5000+',
    desc: 'Watches Sold',
  },
  {
    icon: '/icons/satisfied-customers.svg',
    label: '50000+',
    desc: 'Satisfied Customers',
  },
  {
    icon: '/icons/years-of-experience.svg',
    label: '15+',
    desc: 'Years of Expertise',
  },
  {
    icon: '/icons/satisfaction-rate.svg',
    label: '99%',
    desc: 'Satisfaction Rate',
  },
];

const watches = [
  { src: '/images/contact-watch-new-1.png', scale: 1 },
  { src: '/images/contact-watch-new-2.png', scale: 1 },
  { src: '/images/contact-watch-new-3.png', scale: 1 },
];

const getWatchPosition = (index: number, activeIndex: number) => {
  if (index === activeIndex) return 'center';
  if (index === (activeIndex + 1) % 3) return 'right';
  return 'left';
};

interface ContactHeroSectionProps {
  showWhatsApp?: boolean;
}

export default function ContactHeroSection({
  showWhatsApp = true,
}: ContactHeroSectionProps) {
  const [activeWatch, setActiveWatch] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact-forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section className=" pt-0 pb-0 min-h-[600px] relative overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-2 lg:pt-12 pb-8 relative z-10 pt-24 md:pt-32">
          {/* Sol: Bilgi ve iletişim */}
          <div className="w-full lg:w-[35%] xl:w-[30%] flex flex-col gap-6 shrink-0">
            <div>
              <h1 className="text-[28px] md:text-[36px] font-light leading-tight mb-2">
                <span className="text-[#E1B989] font-medium">Get in Touch</span>
                <br />
                with <span className="font-semibold">Pacha of London</span>
              </h1>
              <div className="lg::text-white/80  text-base mb-6 max-w-md">
                Whether you're looking for a rare timepiece, need expert advice,
                or have a service inquiry, our team is here to assist you.
              </div>
            </div>
            <div className="flex flex-col gap-3 ">
              <div className="flex items-center gap-3 bg-[#3A2121] bg-opacity-80 rounded-lg px-4 py-3 text-white">
                <Image
                  src="/icons/location.svg"
                  alt="Address"
                  width={28}
                  height={28}
                />
                <div>
                  <div className="font-semibold text-white">Address</div>
                  <div className="text-white/80 text-sm">
                    41 Beauchamp Place,
                    <br />
                    Knightsbridge London SW3 1NX
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#3A2121] bg-opacity-80 rounded-lg px-4 py-3 text-white">
                <Image
                  src="/icons/mail.svg"
                  alt="Mail"
                  width={28}
                  height={28}
                />
                <div>
                  <div className="font-semibold text-white">Mail Address</div>
                  <div className="text-white/80 text-xs">
                    pachaoflondon@hotmail.co.uk
                  </div>
                </div>
              </div>
              {showWhatsApp ? (
                <Link
                  href="https://api.whatsapp.com/send/?phone=447999993330&text=Hello%21+I%27m+interested+in+your+luxury+watches+and+jewelry.+Can+you+help+me%3F&type=phone_number&app_absent=0"
                  target="_blank"
                  className="flex items-center gap-3 bg-[#3A2121] bg-opacity-80 rounded-lg px-4 py-3 text-white"
                >
                  <Image
                    src="/icons/phone.svg"
                    alt="Phone"
                    width={28}
                    height={28}
                  />
                  <div>
                    <div className="font-semibold text-white">Phone Number</div>
                    <div className="text-white/80 text-sm">+44 7999993330</div>
                  </div>
                </Link>
              ) : (
                <a
                  href="tel:+447999993330"
                  className="flex items-center gap-3 bg-[#3A2121] bg-opacity-80 rounded-lg px-4 py-3 text-white"
                >
                  <Image
                    src="/icons/phone.svg"
                    alt="Phone"
                    width={28}
                    height={28}
                  />
                  <div>
                    <div className="font-semibold text-white">Phone Number</div>
                    <div className="text-white/80 text-sm">+44 7999993330</div>
                  </div>
                </a>
              )}
              <Link
                href="https://www.instagram.com/pacha_of_london_jewellers/"
                target="_blank"
              >
                <div className="flex items-center gap-3 bg-[#3A2121] bg-opacity-80 rounded-lg px-4 py-3 text-white">
                  <Image
                    src="/icons/instagram.svg"
                    alt="Phone"
                    width={28}
                    height={28}
                  />
                  <div>
                    <div className="font-semibold text-white">Instagram</div>
                    <div className="text-white/80 text-sm">
                      pacha_of_london_jewellers
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Orta: Saat görseli - Interactive Rotation Layout */}
          <div className="w-full lg:flex-1 flex justify-center items-center relative h-[250px] lg:h-[500px] my-4 lg:my-0 overflow-hidden">
            {watches.map((watch, index) => {
              const position = getWatchPosition(index, activeWatch);
              const isCenter = position === 'center';
              const isLeft = position === 'left';
              const isRight = position === 'right';

              return (
                <div
                  key={index}
                  onClick={() => setActiveWatch(index)}
                  className={`absolute left-1/2 top-1/2 transition-all duration-700 ease-in-out cursor-pointer ${
                    isCenter
                      ? 'z-30 scale-100 opacity-100'
                      : 'z-10 scale-75 opacity-60 hover:opacity-100 hover:scale-100'
                  }`}
                  style={{
                    transform: `translate(-50%, -50%) ${
                      isCenter
                        ? 'translateX(0) rotate(0deg)'
                        : isLeft
                          ? 'translateX(-55%) rotate(-15deg)'
                          : 'translateX(55%) rotate(15deg)'
                    }`,
                  }}
                >
                  <Image
                    src={watch.src}
                    alt={`Contact Watch ${index + 1}`}
                    width={350}
                    height={350}
                    className={`object-contain drop-shadow-2xl transition-all duration-700 w-[220px] h-[220px] lg:w-[350px] lg:h-[350px] ${
                      isCenter
                        ? 'brightness-110'
                        : 'brightness-90 hover:brightness-100'
                    }`}
                    priority
                  />
                </div>
              );
            })}
          </div>

          {/* Sağ: Form */}
          <div className="w-full lg:w-[35%] xl:w-[30%] flex justify-center shrink-0">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg px-8 py-8 w-full max-w-[370px] flex flex-col gap-4"
            >
              <div className="text-2xl font-medium text-primary mb-2">
                Get in Touch
              </div>
              <div className="text-primary/80 text-sm mb-2">
                Please fill out the form below, and our team will get back to
                you as soon as possible. For urgent inquiries, feel free to
                contact us directly via phone or email.
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  Sorry, there was an error sending your message. Please try
                  again.
                </div>
              )}

              <Input
                placeholder="Your Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-[#F3F1F0] border-0"
              />
              <Input
                placeholder="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-[#F3F1F0] border-0"
              />
              <Input
                placeholder="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="bg-[#F3F1F0] border-0"
              />
              <Input
                placeholder="Phone Number (optional)"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-[#F3F1F0] border-0"
              />
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleInputChange}
                required
                className="bg-[#F3F1F0] border-0 rounded-md px-3 py-2 min-h-[80px] text-primary text-base resize-none focus:outline-none"
              />
              <Button type="submit" className="mt-2" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Submit Message'}
              </Button>
            </form>
          </div>
        </div>

        {/* Alt: İstatistikler */}
        <div className="w-full mt-0">
          <StatsSection />
        </div>
      </Container>
    </Section>
  );
}
