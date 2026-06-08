import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Slide-in direction for the reveal. */
  direction?: "up" | "left" | "right" | "none";
  as?: "div" | "section" | "li";
}

const offset = 36;

function buildVariants(direction: RevealProps["direction"]): Variants {
  const hidden =
    direction === "left"
      ? { opacity: 0, x: -offset }
      : direction === "right"
      ? { opacity: 0, x: offset }
      : direction === "none"
      ? { opacity: 0 }
      : { opacity: 0, y: offset };

  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

/**
 * Wraps content in a scroll-triggered reveal animation. Replaces the old
 * IntersectionObserver + `.reveal-section.animate` CSS approach with Framer
 * Motion for smoother, interruptible transitions.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={buildVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
