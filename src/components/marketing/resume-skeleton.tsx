"use client";

import { motion, useReducedMotion } from "framer-motion";

function Bar({ w, h = "h-2.5", delay = 0 }: { w: string; h?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`${w} ${h} rounded-full bg-[#e2ddd5]`}
      initial={{ opacity: 0, scaleX: reduced ? 1 : 0.3 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] }}
      style={{ transformOrigin: "left" }}
    />
  );
}

function SectionBlock({ title, lines, delay }: { title: string; lines: string[]; delay: number }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-3">
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-[#bab5ac]">
          {title}
        </p>
        <div className="h-px flex-1 bg-[#e8e3db]" />
      </div>
      {lines.map((w, i) => (
        <Bar key={i} w={w} delay={delay + i * 0.06} />
      ))}
    </div>
  );
}

export function ResumeSkeleton() {
  return (
    <div className="space-y-6 p-8">
      {/* Name */}
      <div className="flex flex-col items-center gap-2.5 pb-2">
        <Bar w="w-44" h="h-5" delay={0.1} />
        <div className="flex gap-2">
          <Bar w="w-20" h="h-2" delay={0.18} />
          <Bar w="w-24" h="h-2" delay={0.22} />
          <Bar w="w-16" h="h-2" delay={0.26} />
        </div>
      </div>

      <SectionBlock
        title="Education"
        lines={["w-3/4", "w-1/2", "w-2/3"]}
        delay={0.3}
      />

      <SectionBlock
        title="Experience"
        lines={["w-full", "w-5/6", "w-4/5", "w-full", "w-3/4", "w-2/3"]}
        delay={0.5}
      />

      <SectionBlock
        title="Projects"
        lines={["w-5/6", "w-full", "w-3/4", "w-4/5"]}
        delay={0.8}
      />

      <SectionBlock
        title="Skills"
        lines={["w-full", "w-2/3"]}
        delay={1.0}
      />
    </div>
  );
}
