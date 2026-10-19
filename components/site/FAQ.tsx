"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  { q: "What is NavigateSkills Academy?", a: "NavigateSkills Academy is a premier online learning platform offering specialized courses. We connect you with expert instructors for strictly live, interactive training sessions." },
  { q: "How do I enroll in a course?", a: "Simply browse our 'Explore' page, select the course you're interested in, and click 'Enroll Now'. You'll be guided through a secure checkout process to reserve your seat in the upcoming batch." },
  { q: "Are the classes live or pre-recorded?", a: "All our classes are 100% live and interactive. We believe in real-time feedback and direct instructor engagement, so we do not provide pre-recorded sessions. This ensures you get the personal attention required to master the material." },
  { q: "Can I get a refund after purchasing a course or service?", a: "No. Because our classes are live and seats per batch are strictly limited, your enrollment instantly reserves a spot that cannot be offered to another student. Therefore, all sales are final, and we do not offer refunds under any circumstances." }
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-6 lg:py-8 pb-8 lg:pb-12">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="text-center mb-8">
          <h2 className="font-display font-bold text-2xl lg:text-3xl text-foreground">
            Questions, <span className="text-gradient">Answered</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={`rounded-xl glass transition-all duration-500 ${
                  isOpen ? "border-primary/60" : ""
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-4 lg:p-5 text-left"
                >
                  <span className="font-semibold text-sm lg:text-base text-foreground">{f.q}</span>
                  <span
                    className={`grid place-items-center w-8 h-8 rounded-full bg-gradient-primary transition-transform duration-500 flex-shrink-0 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 lg:px-5 pb-4 lg:pb-5 -mt-1 text-xs lg:text-sm text-muted-foreground leading-relaxed">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
