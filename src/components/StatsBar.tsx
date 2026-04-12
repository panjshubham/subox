"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Package, ShieldCheck, ReceiptText, Truck } from "lucide-react";

type Stat = {
  icon: React.ReactNode;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sublabel: string;
  duration?: number; // ms
};

const STATS: Stat[] = [
  {
    icon: <Package className="w-8 h-8 text-accent-orange mb-3" />,
    value: 500,
    suffix: "+",
    label: "Orders",
    sublabel: "Delivered Pan India",
    duration: 2000,
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-accent-orange mb-3" />,
    value: 100,
    suffix: "%",
    label: "ISI Grade",
    sublabel: "Certified Materials",
    duration: 1600,
  },
  {
    icon: <ReceiptText className="w-8 h-8 text-accent-orange mb-3" />,
    value: 100,
    suffix: "%",
    label: "GST Billing",
    sublabel: "Compliant Invoicing",
    duration: 1200,
  },
  {
    icon: <Truck className="w-8 h-8 text-accent-orange mb-3" />,
    value: 3,
    prefix: "< ",
    suffix: " Days",
    label: "Ships Fast",
    sublabel: "Pan India Delivery",
    duration: 800,
  },
];

// Individual animated counter
function CountUp({
  target,
  prefix = "",
  suffix = "",
  duration = 2000,
  active,
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  active: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active || hasRun.current) return;
    hasRun.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  // margin: trigger slightly before element centre reaches viewport
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="bg-slate-900 overflow-hidden relative border-y border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800/50">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
                delay: i * 0.12,
              }}
              className="flex flex-col items-center text-center p-4"
            >
              {stat.icon}

              {/* Animated number */}
              <div className="text-2xl font-black text-accent-orange uppercase tracking-tighter tabular-nums">
                <CountUp
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={stat.duration}
                  active={inView}
                />
              </div>

              {/* Stat label */}
              <div className="text-sm font-black text-white uppercase tracking-wide mt-0.5">
                {stat.label}
              </div>

              {/* Sub label */}
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Carbon fibre texture overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
    </div>
  );
}
