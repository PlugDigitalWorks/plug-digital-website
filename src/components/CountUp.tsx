import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';
import { Watch, Users, Award, ThumbsUp } from 'lucide-react';

// Internal CountUp Component
interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
  suffix?: string;
}

function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd,
  suffix = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;

      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };

      const formattedNumber = Intl.NumberFormat('en-US', options).format(
        latest,
      );

      return (
        (separator
          ? formattedNumber.replace(/,/g, separator)
          : formattedNumber) + suffix
      );
    },
    [maxDecimals, separator, suffix],
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === 'down' ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === 'function') {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === 'down' ? from : to);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === 'function') {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000,
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    onEnd,
    duration,
  ]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}

// Stats Data
const stats = [
  {
    icon: (
      <Watch className="w-12 h-12 mb-4 text-white font-thin stroke-[1px]" />
    ),
    value: 5000,
    label: 'Watches Sold',
    suffix: '+',
  },
  {
    icon: (
      <Users className="w-12 h-12 mb-4 text-white font-thin stroke-[1px]" />
    ),
    value: 50000,
    label: 'Satisfied Customers',
    suffix: '+',
  },
  {
    icon: (
      <Award className="w-12 h-12 mb-4 text-white font-thin stroke-[1px]" />
    ),
    value: 15,
    label: 'Years of Expertise',
    suffix: '+',
  },
  {
    icon: (
      <ThumbsUp className="w-12 h-12 mb-4 text-white font-thin stroke-[1px]" />
    ),
    value: 99,
    label: 'Satisfaction Rate',
    suffix: '%',
  },
];

export default function StatsSection() {
  return (
    <section className="bg-[#3e2723] py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              {stat.icon}
              <div className="text-4xl font-bold mb-2">
                <CountUp
                  to={stat.value}
                  separator=""
                  direction="up"
                  duration={2}
                  className="count-up-text"
                  suffix={stat.suffix}
                />
              </div>
              <p className="text-gray-300 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
