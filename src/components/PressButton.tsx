"use client";

/**
 * PressButton — a drop-in replacement for <button> with whileTap scale feedback.
 * Usage: <PressButton className="..." onClick={...}>Label</PressButton>
 */

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type PressButtonProps = HTMLMotionProps<"button"> & {
  scale?: number; // default 0.97
};

export const PressButton = forwardRef<HTMLButtonElement, PressButtonProps>(
  ({ scale = 0.97, whileTap, children, ...props }, ref) => {
    const tapProp = props.disabled ? {} : (whileTap ?? { scale });
    return (
      <motion.button
        ref={ref}
        whileTap={tapProp}
        transition={{ duration: 0.1 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

PressButton.displayName = "PressButton";
