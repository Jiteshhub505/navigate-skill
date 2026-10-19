"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/logo.png";

const links = [
  { label: "Home", href: "/", external: false },
  { label: "Courses", href: "/courses", external: false, sublinks: [
    { label: "Yoga", href: "/courses/yoga" },
    { label: "Fitness", href: "/courses/fitness" },
    { label: "Finance", href: "/courses/finance" },
  ]},
  { label: "Contact", href: "#contact", external: true },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on the homepage
  const isHomePage = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed ${isHomePage ? 'top-[34px] md:top-[36px]' : 'top-0'} inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm"
          : "bg-white/50 backdrop-blur-md border-b border-gray-100"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-24 lg:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="lg:hidden w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
            <Image
              src={logo}
              alt="Navigate Skill Academy Logo"
              className="h-7 w-auto"
              width={28}
              height={28}
            />
          </div>
          <Image
            src={logo}
            alt="Navigate Skill Academy Logo"
            className="hidden lg:block h-10 w-auto md:h-12"
            width={48}
            height={48}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            l.sublinks ? (
              <div key={l.label} className="relative group">
                <button
                  className="relative px-4 py-2 text-sm text-gray-800 hover:text-primary transition-colors group flex items-center gap-1 font-medium"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {l.label}
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
                <div className={`absolute top-full left-0 mt-1 w-48 rounded-xl bg-white border border-gray-100 shadow-xl overflow-hidden transition-all duration-200 ${dropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  {l.sublinks.map((sublink) => (
                    <Link
                      key={sublink.label}
                      href={sublink.href}
                      className="block px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      {sublink.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : l.external ? (
              <a
                key={l.label}
                href={l.href}
                className="relative px-4 py-2 text-sm text-gray-800 hover:text-primary transition-colors group font-medium"
              >
                {l.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                className="relative px-4 py-2 text-sm text-gray-800 hover:text-primary transition-colors group font-medium"
              >
                {l.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            )
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button className="px-5 py-2.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all">
            Login
          </button>
          <button className="relative px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-primary text-white shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <span className="relative z-10">Join Now</span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700" />
          </button>
        </div>

        <button
          aria-label="Menu"
          className="lg:hidden w-10 h-10 grid place-items-center rounded-lg bg-white border border-gray-200 text-gray-800 shadow-sm"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
              {links.map((l) => (
                l.sublinks ? (
                  <div key={l.label}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full py-2 text-base font-medium text-gray-800 hover:text-primary flex items-center justify-between"
                    >
                      {l.label}
                      <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {dropdownOpen && (
                      <div className="pl-4 flex flex-col gap-2 mt-2 border-l-2 border-gray-100">
                        {l.sublinks.map((sublink) => (
                          <Link
                            key={sublink.label}
                            href={sublink.href}
                            onClick={() => setOpen(false)}
                            className="py-2 text-sm text-gray-600 hover:text-primary"
                          >
                            {sublink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : l.external ? (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-2 text-base font-medium text-gray-800 hover:text-primary"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="py-2 text-base font-medium text-gray-800 hover:text-primary"
                  >
                    {l.label}
                  </Link>
                )
              ))}
              <div className="flex gap-3 pt-5 mt-2 border-t border-gray-100">
                <button className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-800 hover:bg-gray-50">Login</button>
                <button className="flex-1 py-3 rounded-xl bg-gradient-primary text-white font-semibold shadow-sm">Join Now</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
