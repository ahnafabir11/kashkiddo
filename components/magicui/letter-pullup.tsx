"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LetterPullupProps {
  words: string;
  delay?: number;
  className?: string;
}

export default function LetterPullup({
  words,
  delay,
  className,
}: LetterPullupProps) {
  const letters = words.split("");

  const pullupVariant = {
    initial: { y: 100, opacity: 0 },
    animate: (i: any) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * (delay ? delay : 0.05), // By default, delay each letter's animation by 0.05 seconds
      },
    }),
  };

  return (
    <div className="flex justify-center">
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          custom={i}
          initial="initial"
          whileInView="animate"
          variants={pullupVariant}
          viewport={{ once: true }}
          className={cn("font-display ", className)}
        >
          {letter === " " ? <span>&nbsp;</span> : letter}
        </motion.span>
      ))}
    </div>
  );
}
