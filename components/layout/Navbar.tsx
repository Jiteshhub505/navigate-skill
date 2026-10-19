"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { getCategories } from "@/app/actions/public-courses";
import { 
    ChevronDown, User, LogOut, BookOpen, CreditCard, LayoutGrid, 
    Mail, Phone, Instagram, Star, Dumbbell, Brain, Calculator, 
    Music, Palette, Code, Briefcase, Heart, Baby, Coffee, Menu, X 
} from "lucide-react";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [scrolled, setScrolled] = useState(false);
    const supabase = createClient();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });

        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };
        fetchCategories();

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    // Close mobile menu on page navigation
    useEffect(() => {
        setIsOpen(false);
        setMobileCategoryOpen(false);
        setProfileOpen(false);
        setCategoryOpen(false);
    }, [pathname]);

    // Close side drawer on desktop resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setProfileOpen(false);
        setIsOpen(false);
        router.push("/");
        router.refresh();
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Courses", href: "/courses", hasDropdown: true },
        { name: "About", href: "/about" },
        { name: "Explore", href: "/explore" },
        { name: "FAQ", href: "/faq" },
        { name: "Contact", href: "/contact" },
    ];

    const getInitials = (name: string) => {
        if (!name) return "U";
        return name.charAt(0).toUpperCase();
    };

    const getCategoryIcon = (categoryName: string) => {
        const name = categoryName?.toLowerCase() || "";
        if (name.includes("yoga") || name.includes("fitness")) return Dumbbell;
        if (name.includes("education") || name.includes("academic")) return Brain;
        if (name.includes("finance") || name.includes("accounting")) return Calculator;
        if (name.includes("music") || name.includes("dance")) return Music;
        if (name.includes("art") || name.includes("design")) return Palette;
        if (name.includes("tech") || name.includes("coding") || name.includes("programming")) return Code;
        if (name.includes("business") || name.includes("career")) return Briefcase;
        if (name.includes("health") || name.includes("medical")) return Heart;
        if (name.includes("parenting") || name.includes("kids")) return Baby;
        if (name.includes("lifestyle") || name.includes("cooking")) return Coffee;
        return LayoutGrid;
    };

    return (
        <>
            {/* Top Announcement Bar */}
            <div className="bg-[#692D96] text-white overflow-hidden py-1 relative z-[60] shadow-sm">
                <div className="flex whitespace-nowrap animate-marquee items-center gap-12 w-max hover:[animation-play-state:paused]">
                    <div className="flex items-center gap-12 shrink-0">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={`first-${i}`} className="flex items-center gap-4">
                                <span className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" />
                                    Special Offer: Yoga @ ₹699 (1 Mo) / ₹1100 (3 Mo) / ₹1499 (6 Mo)
                                </span>
                                <Link href="/courses/yoga" className="bg-white text-[#692D96] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide hover:bg-purple-50 transition-all">
                                    Enroll Now
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-12 shrink-0" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={`second-${i}`} className="flex items-center gap-4">
                                <span className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" />
                                    Special Offer: Yoga @ ₹699 (1 Mo) / ₹1100 (3 Mo) / ₹1499 (6 Mo)
                                </span>
                                <Link href="/courses/yoga" className="bg-white text-[#692D96] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wide hover:bg-purple-50 transition-all">
                                    Enroll Now
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative z-50">
                {/* Top Layer - Utility Bar */}
                <div className="hidden md:block bg-[#692D96] py-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <a href="mailto:hello@navigateskill.com" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors">
                                <Mail size={12} className="text-purple-300" />
                                hello@navigateskill.com
                            </a>
                            <a href="tel:+919218187041" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors">
                                <Phone size={12} className="text-purple-300" />
                                +91 92181 87041
                            </a>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 border-r border-white/20 pr-6">
                                <a href="https://www.instagram.com/navigate_skill_academy/" target="_blank" className="text-white/80 hover:text-white transition-all hover:scale-110">
                                    <Instagram size={14} />
                                </a>
                                <a href="https://share.google/Jw8kKxEKtlvea19A7" target="_blank" className="text-white/80 hover:text-white transition-all hover:scale-110 flex items-center gap-1.5">
                                    <Star size={14} className="fill-current" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Review Us</span>
                                </a>
                            </div>
                            <Link
                                href="/courses/yoga#enroll"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px] transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-green-600/20"
                            >
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                ₹20 Trial
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky top-0 z-50">
                {/* Main Layer - Navigation Bar */}
                <nav
                    aria-label="Main navigation"
                    className={`transition-all duration-300 ${scrolled ? "bg-[#692D96] shadow-lg py-1" : "bg-[#692D96] py-1.5 md:py-2"}`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-10 md:h-12">
                            {/* Logo */}
                            <Link href="/" aria-label="Navigate Skill Academy - Home" className="flex items-center gap-2 md:gap-3 group shrink-0">
                                <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110">
                                    <Image
                                        src="/logo.webp"
                                        alt="Navigate Skill Academy logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row md:items-baseline">
                                    <span className="font-black text-base md:text-xl text-white tracking-tighter leading-none">NavigateSkills</span>
                                    <span className="font-black text-sm md:text-xl md:ml-1 bg-gradient-to-r from-purple-300 to-purple-200 bg-clip-text text-transparent tracking-tighter leading-none">Academy</span>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex items-center gap-8">
                                {navLinks.map((link) => {
                                    const isActive = pathname === link.href;
                                    if (link.hasDropdown) {
                                        return (
                                            <div key={link.name} className="relative group/cat">
                                                <button
                                                    onMouseEnter={() => setCategoryOpen(true)}
                                                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors text-white/80 hover:text-white py-2"
                                                >
                                                    {link.name}
                                                    <ChevronDown size={14} className={`text-white/80 transition-transform duration-300 ${categoryOpen ? "rotate-180" : ""}`} />
                                                </button>

                                                <div
                                                    onMouseLeave={() => setCategoryOpen(false)}
                                                    className={`absolute top-full left-0 mt-3 w-[520px] bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 ${categoryOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}`}
                                                >
                                                    <div className="p-5">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {categories.map((category) => {
                                                                const Icon = getCategoryIcon(category.name);
                                                                const courseCount = category.name?.toLowerCase().includes('finance') ? 1 : 
                                                                                    category.name?.toLowerCase().includes('dance') ? 1 : 
                                                                                    category.subcategories?.length || 1;
                                                                return (
                                                                    <Link
                                                                        key={category.id}
                                                                        href={`/${category.slug}`}
                                                                        className="group p-4 rounded-xl bg-gradient-to-br from-purple-50 via-white to-purple-50 border border-purple-100 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-200"
                                                                    >
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                                                                                <Icon size={20} className="text-purple-600" />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <span className="text-gray-900 font-black text-sm uppercase tracking-widest group-hover:text-purple-700 transition-colors block mb-1">
                                                                                    {category.name}
                                                                                </span>
                                                                                <div className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">
                                                                                    {courseCount} {courseCount === 1 ? 'Course' : 'Courses'} Available
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={`text-xs font-bold uppercase tracking-widest transition-all relative py-1 ${isActive ? "text-white" : "text-white/80 hover:text-white"}`}
                                        >
                                            {link.name}
                                            {isActive && (
                                                <div
                                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-500 rounded-full"
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Right Side Actions (Desktop) */}
                            <div className="hidden lg:flex items-center gap-4">
                                {user ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setProfileOpen(!profileOpen)}
                                            className="flex items-center gap-3 p-1 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/20"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-black text-sm shadow-lg">
                                                {getInitials(user.user_metadata?.full_name || user.email)}
                                            </div>
                                            <ChevronDown size={14} className={`text-white/80 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        {profileOpen && (
                                            <div className="absolute top-full right-0 mt-4 w-64 bg-white border border-purple-200 rounded-2xl overflow-hidden shadow-2xl z-50">
                                                <div className="p-5 border-b border-purple-100 bg-purple-50/30">
                                                    <p className="text-gray-900 font-black text-xs uppercase tracking-widest truncate">
                                                        {user.user_metadata?.full_name || "Student"}
                                                    </p>
                                                    <p className="text-gray-600 text-[10px] truncate mt-1">
                                                        {user.email}
                                                    </p>
                                                </div>

                                                <div className="p-2">
                                                    {[
                                                        { name: "My Profile", icon: User, href: "/profile", color: "text-blue-600" },
                                                        { name: "My Courses", icon: BookOpen, href: "/my-courses", color: "text-purple-600" },
                                                        { name: "Billing", icon: CreditCard, href: "/billing", color: "text-emerald-600" },
                                                    ].map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            onClick={() => setProfileOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-purple-50 group"
                                                        >
                                                            <item.icon size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                                                            <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 uppercase tracking-widest">{item.name}</span>
                                                        </Link>
                                                    ))}

                                                    <div className="my-2 border-t border-purple-100" />

                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-red-500/10 group text-red-500"
                                                    >
                                                        <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                                                        <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href="/login"
                                            className="text-xs font-black uppercase tracking-widest text-white/80 hover:text-white transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            className="bg-white text-purple-700 px-6 py-2.5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-purple-50 transition-all active:scale-95 shadow-lg shadow-white/20"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Toggle Button */}
                            <div className="lg:hidden flex items-center gap-3">
                                {user && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-black text-xs shadow-md">
                                        {getInitials(user.user_metadata?.full_name || user.email)}
                                    </div>
                                )}
                                <button
                                    onClick={() => setIsOpen((prev) => !prev)}
                                    aria-expanded={isOpen}
                                    aria-controls="mobile-menu"
                                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                                    className="p-2 rounded-xl text-white hover:bg-white/10 active:scale-90 transition-transform focus:outline-none"
                                >
                                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Pure CSS Hardware-Accelerated Side Drawer (Zero Lag) */}
                {/* Backdrop */}
                <div
                    onClick={() => setIsOpen(false)}
                    className={`fixed inset-0 bg-black/60 z-[99] lg:hidden transition-opacity duration-200 ease-out ${
                        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                    aria-hidden="true"
                />

                {/* Pre-mounted GPU Slide Drawer */}
                <div
                    id="mobile-menu"
                    role="navigation"
                    aria-label="Mobile navigation"
                    className={`fixed inset-y-0 right-0 z-[100] w-[80vw] max-w-xs bg-white shadow-2xl lg:hidden flex flex-col justify-between transition-transform duration-200 ease-out will-change-transform ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    {/* Drawer Header */}
                    <div className="p-4 border-b border-purple-100 flex items-center justify-between bg-[#692D96] text-white shrink-0">
                        <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                            <div className="relative w-7 h-7">
                                <Image src="/logo.webp" alt="Logo" fill className="object-contain" />
                            </div>
                            <span className="font-black text-sm text-white tracking-tighter">NavigateSkills</span>
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close menu"
                            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Drawer Body (Scrollable) */}
                    <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                        {navLinks.map((link) => {
                            if (link.hasDropdown) {
                                return (
                                    <div key={link.name} className="border-b border-gray-100 pb-3">
                                        <button
                                            onClick={() => setMobileCategoryOpen((prev) => !prev)}
                                            className="flex items-center justify-between w-full py-2 text-sm font-black uppercase tracking-wider text-gray-900 hover:text-purple-700"
                                        >
                                            <span>{link.name}</span>
                                            <ChevronDown
                                                size={16}
                                                className={`text-purple-600 transition-transform duration-200 ${
                                                    mobileCategoryOpen ? "rotate-180" : ""
                                                }`}
                                            />
                                        </button>

                                        <div
                                            className={`overflow-hidden transition-all duration-200 ease-out ${
                                                mobileCategoryOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
                                            }`}
                                        >
                                            <div className="space-y-1 pl-2">
                                                {categories.map((category) => {
                                                    const Icon = getCategoryIcon(category.name);
                                                    return (
                                                        <Link
                                                            key={category.id}
                                                            href={`/${category.slug}`}
                                                            onClick={() => setIsOpen(false)}
                                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                                                        >
                                                            <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center shrink-0">
                                                                <Icon size={13} className="text-purple-700" />
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider truncate">
                                                                {category.name}
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div key={link.name} className="border-b border-gray-100 pb-3">
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="block py-2 text-sm font-black uppercase tracking-wider text-gray-900 hover:text-purple-700"
                                    >
                                        {link.name}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    {/* Drawer Footer */}
                    <div className="p-4 border-t border-purple-100 bg-purple-50/50 shrink-0">
                        {user ? (
                            <div className="space-y-3">
                                <div className="p-3 rounded-lg bg-white border border-purple-100">
                                    <p className="text-xs font-black text-gray-900 uppercase tracking-wider truncate">
                                        {user.user_metadata?.full_name || "Student"}
                                    </p>
                                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-1.5">
                                    <Link
                                        href="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="py-2 text-[10px] font-bold uppercase tracking-wider text-center bg-white border border-purple-200 rounded-lg text-purple-900 hover:bg-purple-100"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/my-courses"
                                        onClick={() => setIsOpen(false)}
                                        className="py-2 text-[10px] font-bold uppercase tracking-wider text-center bg-white border border-purple-200 rounded-lg text-purple-900 hover:bg-purple-100"
                                    >
                                        Courses
                                    </Link>
                                    <Link
                                        href="/billing"
                                        onClick={() => setIsOpen(false)}
                                        className="py-2 text-[10px] font-bold uppercase tracking-wider text-center bg-white border border-purple-200 rounded-lg text-purple-900 hover:bg-purple-100"
                                    >
                                        Billing
                                    </Link>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-2.5 rounded-lg bg-red-50 text-red-600 font-bold uppercase tracking-wider text-xs border border-red-200 flex items-center justify-center gap-1.5 hover:bg-red-100 transition-colors"
                                >
                                    <LogOut size={14} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-white text-purple-800 py-3 rounded-full font-black uppercase tracking-wider text-center text-xs border border-purple-300 hover:bg-purple-50 transition-all active:scale-95"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full bg-[#692D96] text-white py-3 rounded-full font-black uppercase tracking-wider text-center text-xs shadow-md hover:bg-purple-900 transition-all active:scale-95"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
