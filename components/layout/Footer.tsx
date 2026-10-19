"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { trackMetaEvent } from "@/lib/meta-pixel";

export const Footer = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const trackFooterCTA = () => {
        trackMetaEvent('Contact', {
            button: 'Footer CTA'
        });
    };

    return (
        <footer className="pt-16 pb-8 bg-[#692D96] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-6 group">
                            <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                                <Image
                                    src="/logo.png"
                                    alt="NavigateSkills Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <span className="font-bold text-lg text-white">NavigateSkills</span>
                                <span className="font-bold text-lg ml-1 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Academy</span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6 text-gray-400">
                            Empowering you with skills for a better future. Join our community of learners and master Dance, Fitness, and Finance.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/navigate_skill_academy/" target="_blank" className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all shadow-sm hover:shadow-lg hover:shadow-purple-500/20 group text-gray-500">
                                <span className="sr-only">Instagram</span>
                                <svg className="w-5 h-5 fill-current group-hover:fill-[#E1306C]" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.997 3.997 0 110-7.996 3.997 3.997 0 010 7.996zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                            <a href="https://share.google/Jw8kKxEKtlvea19A7" target="_blank" className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all shadow-sm hover:shadow-lg hover:shadow-purple-500/20 group text-gray-500">
                                <span className="sr-only">Google Review</span>
                                <svg className="w-5 h-5 fill-current group-hover:fill-[#4285F4]" viewBox="0 0 24 24">
                                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.157-1.908 4.155-1.229 1.229-3.146 2.568-6.412 2.568-5.12 0-9.16-4.14-9.16-9.26s4.04-9.26 9.16-9.26c2.77 0 4.78 1.09 6.23 2.47l2.31-2.31c-2.08-1.99-4.84-3.16-8.54-3.16-6.62 0-12 5.38-12 12s5.38 12 12 12c3.57 0 6.26-1.17 8.37-3.36 2.16-2.16 2.84-5.21 2.84-7.67 0-.72-.06-1.41-.17-2.07h-11.07z" />
                                </svg>
                            </a>
                            <a 
                                onClick={trackFooterCTA}
                                href="https://wa.me/919218187041?text=Hey,%20I%20want%20to%20know%20about%20your%20yoga%20classes" 
                                target="_blank" 
                                className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all shadow-sm hover:shadow-lg hover:shadow-purple-500/20 group text-gray-500"
                            >
                                <span className="sr-only">WhatsApp</span>
                                <svg className="w-5 h-5 fill-current group-hover:fill-[#25D366]" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold mb-6 text-white">Categories</h3>
                        <ul className="space-y-4">
                            {[
                                { name: "Dance Courses", href: "/dance" },
                                { name: "Fitness Training", href: "/fitness" },
                                { name: "Finance & Trading", href: "/finance" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="font-medium transition-colors inline-flex items-center gap-2 group hover:text-purple-400 text-gray-400"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full group-hover:bg-purple-400 bg-white/10"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold mb-6 text-white">Quick Links</h3>
                        <ul className="space-y-4">
                            {[
                                { name: "About Us", href: "/about" },
                                { name: "Explore Courses", href: "/explore" },
                                { name: "Contact Us", href: "/contact" },
                                { name: "Become an Instructor", href: "/contact" },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        onClick={() => {
                                            if (link.name === "Contact Us" || link.name === "Become an Instructor") {
                                                trackFooterCTA();
                                            }
                                        }}
                                        className="font-medium transition-colors inline-flex items-center gap-2 group hover:text-purple-400 text-gray-400"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full group-hover:bg-purple-400 bg-white/10"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold mb-6 text-white">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <svg className="w-5 h-5 mt-0.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm">C-9/15, 3rd Floor, Sector 7, Rohini, Delhi - 110085 (Near Rohini East Metro Station, Opp. Pillar No. 399)</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm">hello@navigateskill.com</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-sm">+91 92181 87041</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5">
                    <p className="text-sm text-center md:text-left text-gray-500">
                        © {mounted ? new Date().getFullYear() : '2026'} NavigateSkills Academy. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm font-medium">
                        <Link href="/privacy-policy" className="transition-colors hover:text-purple-400 text-gray-400">Privacy Policy</Link>
                        <Link href="/refund-policy" className="transition-colors hover:text-purple-400 text-gray-400">Refund Policy</Link>
                        <Link href="/health-safety-waiver" className="transition-colors hover:text-purple-400 text-gray-400">Health & Safety Waiver</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
