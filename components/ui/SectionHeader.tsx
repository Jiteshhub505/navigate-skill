"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    description?: string;
    centered?: boolean;
    light?: boolean;
}

export default function SectionHeader({
    title,
    subtitle,
    description,
    centered = true,
    light = false
}: SectionHeaderProps) {
    return (
        <div className={`mb-16 ${centered ? 'text-center' : 'text-left'}`}>
            {subtitle && (
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-purple-400 font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
                >
                    {subtitle}
                </motion.span>
            )}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`text-3xl md:text-5xl font-bold mb-6 tracking-tight ${light ? 'text-white' : 'bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent'
                    }`}
            >
                {title}
            </motion.h2>
            {description && (
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
}
