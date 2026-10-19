"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { CourseWithRelations } from "@/types";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { createClient } from "@/lib/supabase/client";
import { EnrollmentForm } from "@/components/features/courses/EnrollmentForm";
import { EnquiryForm } from "@/components/features/courses/EnquiryForm";
import { CourseCard } from "@/components/features/courses/CourseCard";
import { Testimonials } from "@/components/site/Testimonials";
import { ClassHighlights } from "@/components/site/ClassHighlights";
import {
    Clock, Award, Users, Star, CheckCircle2, Calendar, ChevronRight,
    PlayCircle, ShieldCheck, Zap, AlertTriangle, Sparkles, Heart,
    BadgeCheck, ArrowRight, Flame, Gift, MessageCircle, Video, CheckCircle
} from "lucide-react";

interface CourseDetailLayoutProps {
    course: CourseWithRelations;
    relatedCourses: CourseWithRelations[];
    exploreCourses: CourseWithRelations[];
    yogaCourses?: CourseWithRelations[];
    categoryName: string;
    categorySlug: string;
    categoryIcon: string;
    heroExtra?: React.ReactNode;
    afterTimings?: React.ReactNode;
    showOnlyActivePricing?: boolean; // New prop for pricing filter
    theme?: 'dark' | 'light'; // New prop for theme
}

export function CourseDetailLayout({
    course,
    relatedCourses,
    exploreCourses,
    yogaCourses = [],
    categoryName,
    categorySlug,
    categoryIcon,
    heroExtra,
    afterTimings,
    showOnlyActivePricing = false,
    theme = 'light'
}: CourseDetailLayoutProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<'1_month' | '6_months'>('1_month');
    const [selectedBatch, setSelectedBatch] = useState<number>(0);
    const isOutOfStock = !!course.deletedAt;

    const isYoga = course.slug === 'yoga' || course.title.toLowerCase().includes('yoga');

    // Get pricing from course.pricing JSON or defaults
    const pricing = course.pricing as { '1_month'?: number; '3_months'?: number; '6_months'?: number } || {};
    const oneMonthPrice = pricing['1_month'] || 699;
    const threeMonthsPrice = pricing['3_months'] || 1100;
    const sixMonthsPrice = pricing['6_months'] || 1499;

    const instructorRef = useRef<HTMLDivElement>(null);
    const testimonialRef = useRef<HTMLDivElement>(null);
    const [userData, setUserData] = useState<{ email?: string; phone?: string; name?: string }>({});

    useEffect(() => {
        const initTracking = async () => {
            let currentUserData = {};
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    let name = user.user_metadata?.full_name || user.user_metadata?.name || '';
                    if (!name && user.email) {
                        const { data: dbUser } = await supabase
                            .from('users')
                            .select('name')
                            .eq('email', user.email)
                            .single();
                        if (dbUser?.name) {
                            name = dbUser.name;
                        }
                    }
                    currentUserData = {
                        email: user.email || "",
                        name: name,
                        phone: user.phone || ""
                    };
                    setUserData(currentUserData);
                }
            } catch (e) {
                console.error("Error fetching user for tracking:", e);
            }

            // Standard Event: PageView
            trackMetaEvent('PageView', {}, currentUserData);

            // Standard Event: ViewContent
            if (isYoga) {
                trackMetaEvent('ViewContent', {
                    content_name: 'Yoga Course',
                    content_category: 'Fitness',
                    content_type: 'Course'
                }, currentUserData);
            }
        };

        initTracking();
    }, [course, isYoga]);

    useEffect(() => {
        // Scroll to top
        window.scrollTo(0, 0);

        const handleScroll = () => setIsScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);

        // Track custom scroll events
        let scroll50Fired = false;
        let scroll90Fired = false;

        const handleScrollTracking = () => {
            if (!isYoga) return;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            if (scrollPercent >= 50 && !scroll50Fired) {
                scroll50Fired = true;
                trackMetaEvent('Scroll50', {}, userData, true);
            }
            if (scrollPercent >= 90 && !scroll90Fired) {
                scroll90Fired = true;
                trackMetaEvent('Scroll90', {}, userData, true);
            }
        };

        window.addEventListener('scroll', handleScrollTracking);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScrollTracking);
        };
    }, [course, isYoga, userData]);

    useEffect(() => {
        if (!isYoga) return;

        let instructorFired = false;
        let testimonialFired = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === instructorRef.current && !instructorFired) {
                        instructorFired = true;
                        trackMetaEvent('Instructor_View', {}, userData, true);
                    }
                    if (entry.target === testimonialRef.current && !testimonialFired) {
                        testimonialFired = true;
                        trackMetaEvent('Review_View', {}, userData, true);
                    }
                }
            });
        }, { threshold: 0.1 });

        if (instructorRef.current) observer.observe(instructorRef.current);
        if (testimonialRef.current) observer.observe(testimonialRef.current);

        return () => {
            observer.disconnect();
        };
    }, [course, isYoga, userData]);

    const handleWhatsApp = () => {
        if (isYoga) {
            trackMetaEvent('Contact', {
                contact_method: 'WhatsApp'
            }, userData);
        }
        window.open('https://wa.me/919218187041?text=Hey,%20I%20want%20to%20book%20a%2020rs%20trial%20class', '_blank');
    };

    const features = course.features || [
        "20 guided yoga sessions over 1 month",
        "5 days per week training schedule",
        "Progressive beginner to intermediate level",
        "Build strength, flexibility, and balance",
        "Learn proper alignment and breath control",
        "Full-body flows and relaxation techniques",
        "Personalized feedback and guidance",
        "Access to recorded sessions",
        "Community support group",
        "Certificate upon completion",
    ];

    return (
        <div className="relative min-h-screen overflow-x-hidden w-full text-gray-900 bg-[#faf7ff]">
            {/* Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden w-full bg-gradient-to-br from-gray-50 via-purple-50/50 to-gray-50">
                <div className="hidden sm:block absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="hidden sm:block absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-100/20 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Main Content */}
            <div className="relative">
                <main className="pt-4 lg:pt-6 pb-12 w-full overflow-x-hidden">
                    <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8 w-full box-border">
                        {/* Hero Section */}
                        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 sm:gap-8 lg:gap-12 mb-12 lg:mb-16 items-center lg:py-8 w-full">
                            {/* Left: Course Info */}
                            <div className="flex flex-col justify-center space-y-4 lg:space-y-6 w-full min-w-0">
                                {/* Breadcrumb */}
                                <nav className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-500' : 'text-neutral-500'}`}>
                                    <Link href="/" className={theme === 'light' ? 'hover:text-gray-900 transition-colors' : 'hover:text-white transition-colors'}>Home</Link>
                                    <ChevronRight size={12} />
                                    <Link href={`/${categorySlug}`} className={theme === 'light' ? 'hover:text-gray-900 transition-colors' : 'hover:text-white transition-colors'}>{categoryName}</Link>
                                    <ChevronRight size={12} />
                                    <span className="text-purple-600">{course.title}</span>
                                </nav>

                                {/* Main Heading with better gradient */}
                                <div>
                                    <h2 className={`font-display font-black text-5xl sm:text-5xl lg:text-6xl leading-tight ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                        {course.title.split(' ').slice(0, -1).join(' ')}{" "}
                                        <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 bg-clip-text text-transparent">
                                            {course.title.split(' ').slice(-1)}
                                        </span>
                                    </h2>
                                </div>

                                {/* Subtitle with better styling */}
                                <h2 className="text-base sm:text-lg lg:text-2xl font-bold -mt-2 lg:-mt-4">
                                    <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">
                                        Navigate Skill Academy
                                    </span>
                                </h2>

                                {/* Description with better readability */}
                                <p className={`text-sm sm:text-base lg:text-lg leading-relaxed w-full ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                    {course.description}
                                </p>

                                {/* Info Pills with better design */}
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 w-full">
                                    <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border shadow-sm flex-shrink-0 ${theme === 'light' ? 'bg-purple-100/40 border-purple-300/50' : 'bg-purple-900/40 border-purple-700/50'}`}>
                                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-purple-200/50' : 'bg-purple-800/50'}`}>
                                            <Clock className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-300'}`} />
                                        </div>
                                        <span className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                                            {typeof course.duration === 'string' ? course.duration : course.duration?.name}
                                        </span>
                                    </div>
                                    {course.teacher && (
                                        <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border shadow-sm flex-shrink-0 ${theme === 'light' ? 'bg-pink-100/40 border-pink-300/50' : 'bg-pink-900/40 border-pink-700/50'}`}>
                                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-pink-200/50' : 'bg-pink-800/50'}`}>
                                                <Users className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${theme === 'light' ? 'text-pink-600' : 'text-pink-300'}`} />
                                            </div>
                                            <span className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                                                By {course.teacher.user?.name}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border shadow-sm flex-shrink-0 ${theme === 'light' ? 'bg-purple-100/40 border-purple-300/50' : 'bg-purple-900/40 border-purple-700/50'}`}>
                                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-purple-200/50' : 'bg-purple-800/50'}`}>
                                            <Video className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-300'}`} />
                                        </div>
                                        <span className={`text-[10px] sm:text-xs font-semibold whitespace-nowrap ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                                            Online Classes
                                        </span>
                                    </div>
                                </div>

                                {/* CTA Buttons connected to dynamic backend pricing */}
                                {(() => {
                                    const allPricings = course.coursePricings || [];
                                    const activePricings = showOnlyActivePricing 
                                        ? allPricings.filter(p => p.isActive === true) 
                                        : (allPricings.filter(p => p.isActive === false).length > 0 ? allPricings.filter(p => p.isActive === false) : allPricings);

                                    const standardPricing = activePricings.find(p => {
                                        const l = p.duration?.name?.toLowerCase() || '';
                                        return l.includes('1 month') || l.includes('1m') || l.includes('monthly');
                                    }) || activePricings.find(p => !p.duration?.name?.toLowerCase().includes('trial')) || activePricings[0];

                                    const trialPricing = allPricings.find(p => {
                                        const l = p.duration?.name?.toLowerCase() || '';
                                        return l.includes('trial') || l.includes('demo');
                                    });

                                    const displayMonthlyPrice = standardPricing ? `₹${Number(standardPricing.discountedPrice)}/month` : (course.price ? `₹${Number(course.price)}/month` : '₹599/month');
                                    const rawMonthlyValue = standardPricing ? Number(standardPricing.discountedPrice) : Number(course.price || 599);
                                    const trialPriceVal = trialPricing ? Number(trialPricing.discountedPrice) : 20;
                                    const displayTrialPrice = `Book Trial ₹${trialPriceVal}`;

                                    return (
                                        <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
                                            {!isOutOfStock && (
                                                <button
                                                    onClick={() => {
                                                        if (isYoga) {
                                                            trackMetaEvent('InitiateCheckout', {
                                                                value: rawMonthlyValue,
                                                                currency: 'INR',
                                                                content_name: 'Yoga Course',
                                                                plan: standardPricing?.duration?.name || '1 Month'
                                                            }, userData);
                                                        }
                                                        document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' });
                                                    }}
                                                    className="group flex-1 inline-flex flex-col items-center justify-center gap-0.5 px-6 py-2.5 rounded-full bg-purple-600 text-white font-bold shadow-xl hover:shadow-2xl hover:bg-purple-700 hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                                                >
                                                    <span className="text-xs sm:text-sm">Buy Now</span>
                                                    <span className="text-base sm:text-lg">{displayMonthlyPrice}</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (isYoga) {
                                                        trackMetaEvent('Lead', {
                                                            value: trialPriceVal,
                                                            currency: 'INR',
                                                            content_name: 'Yoga Trial'
                                                        }, userData);
                                                    }
                                                    document.getElementById('enroll')?.scrollIntoView({ behavior: 'smooth' });
                                                }}
                                                className="group flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-transparent border-2 border-green-600 text-green-600 font-bold shadow-md hover:bg-green-50 hover:shadow-xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                <span className="text-sm">{displayTrialPrice}</span>
                                            </button>
                                        </div>
                                    );
                                })()}

                                {/* Trust indicators */}
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 ${theme === 'light' ? 'border-white' : 'border-gray-800'}`}></div>
                                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 ${theme === 'light' ? 'border-white' : 'border-gray-800'}`}></div>
                                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 ${theme === 'light' ? 'border-white' : 'border-gray-800'}`}></div>
                                        </div>
                                        <div className="text-xs sm:text-sm">
                                            <div className={`font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>1,200+</div>
                                            <div className={`text-[10px] sm:text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>Happy Students</div>
                                        </div>
                                    </div>
                                    <div className="text-xs sm:text-sm">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-400 font-bold text-base sm:text-lg">★★★★★</span>
                                        </div>
                                        <div className={`text-[10px] sm:text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>4.9/5 Rating</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Course Images */}
                            <div className="w-full lg:w-auto min-w-0">
                                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 w-full">
                                    <div className="relative w-full h-36 sm:h-40 lg:h-56 rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                                        <Image
                                            src="/assets/1.png"
                                            alt={`${course.title} - Practice 1`}
                                            fill
                                            className="object-cover object-center"
                                        />
                                    </div>
                                    <div className="relative w-full h-36 sm:h-40 lg:h-56 rounded-lg sm:rounded-xl overflow-hidden shadow-lg mt-4 sm:mt-6">
                                        <Image
                                            src="/assets/2.jpg"
                                            alt={`${course.title} - Practice 2`}
                                            fill
                                            className="object-cover object-center"
                                        />
                                    </div>

                                    <div className="relative w-full h-36 sm:h-40 lg:h-56 rounded-lg sm:rounded-xl overflow-hidden shadow-lg col-span-2">
                                        <Image
                                            src="/assets/yoga-course3.webp"
                                            alt={`${course.title} - Practice 3`}
                                            fill
                                            className="object-cover object-center"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div id="enroll" className={`mb-12 rounded-3xl border shadow-2xl overflow-hidden ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-neutral-900 border-white/10'}`}>
                            {/* Special Offer Banner */}
                            <div className={`px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 ${theme === 'light' ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600' : 'bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600'}`}>
                                <div className="flex items-center gap-2 text-white flex-1 min-w-0">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <span className="font-bold text-xs sm:text-sm lg:text-base truncate">
                                        Special Offer: Limited Time Discount on All Plans!
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        if (isYoga) {
                                            trackMetaEvent('Contact', {
                                                content_name: 'Yoga Enquiry'
                                            }, userData);
                                        }
                                        handleWhatsApp();
                                    }}
                                    className="px-3 sm:px-5 py-1.5 sm:py-2 bg-white text-purple-600 rounded-full text-xs sm:text-sm font-bold hover:bg-gray-50 transition-all shadow-lg flex-shrink-0"
                                >
                                    Enquire Now
                                </button>
                            </div>

                            <div className="p-4 sm:p-6 lg:p-10">
                                {isOutOfStock ? (
                                    <EnquiryForm course={course} fullWidth />
                                ) : (
                                    <EnrollmentForm course={course} fullWidth showOnlyActivePricing={showOnlyActivePricing} skipLoginRequired={showOnlyActivePricing} theme={theme} />
                                )}
                            </div>
                        </div>

                        {/* Students Feedback Videos */}
                        <div className="mb-12 sm:mb-16">
                            <ClassHighlights />
                        </div>

                        {/* Testimonials */}
                        <div ref={testimonialRef} className="mb-12 sm:mb-16">
                            <Testimonials />
                        </div>

                        {/* What You'll Learn */}
                        <div className={`mb-12 sm:mb-16 p-4 sm:p-5 lg:p-6 rounded-lg border ${theme === 'light' ? 'bg-purple-50/50 border-purple-200' : 'bg-purple-900/30 border-purple-700/50'}`}>
                            <h2 className={`font-display font-bold text-lg sm:text-xl lg:text-3xl mb-4 sm:mb-5 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                What You'll <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">Learn</span>
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                                        <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* About Instructor */}
                        {course.teacher && (
                            <div ref={instructorRef} className={`mb-12 p-4 sm:p-5 lg:p-6 rounded-lg border shadow-md ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800/50 border-gray-700'}`}>
                                <h2 className={`font-display font-bold text-lg sm:text-xl lg:text-3xl mb-4 sm:mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    Meet Your <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">Instructor</span>
                                </h2>
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center text-2xl lg:text-3xl font-bold flex-shrink-0 ${theme === 'light' ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white' : 'bg-gradient-to-br from-purple-700 to-purple-800 text-purple-200'}`}>
                                        {course.teacher.profileImageUrl ? (
                                            <div className="relative w-full h-full rounded-full overflow-hidden">
                                                <Image src={course.teacher.profileImageUrl} alt="" fill className="object-cover" />
                                            </div>
                                        ) : (
                                            course.teacher.user?.name?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-xl lg:text-2xl mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{course.teacher.user?.name}</h3>
                                        <p className={`text-sm lg:text-base mb-4 leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                                            {course.teacher.bio || `With years of dedicated experience in ${categoryName.toLowerCase()}, ${course.teacher.user?.name} has transformed the lives of hundreds through expert teaching and personalized guidance. Their teaching style is characterized by precision, patience, and profound focus on helping students achieve their goals.`}
                                        </p>

                                        {/* Stats */}
                                        <div className="grid grid-cols-3 gap-4 mt-6">
                                            <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-200">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-xs font-semibold text-gray-600">Rating</span>
                                                </div>
                                                <div className="text-2xl font-black text-purple-700">4.9</div>
                                            </div>
                                            <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-200">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <Video className="w-4 h-4 text-purple-600" />
                                                    <span className="text-xs font-semibold text-gray-600">Courses</span>
                                                </div>
                                                <div className="text-2xl font-black text-purple-700">1</div>
                                            </div>
                                            <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-200">
                                                <div className="flex items-center justify-center gap-1 mb-1">
                                                    <Users className="w-4 h-4 text-purple-600" />
                                                    <span className="text-xs font-semibold text-gray-600">Students</span>
                                                </div>
                                                <div className="text-2xl font-black text-purple-700">1.2k+</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}



                        {/* Yoga Courses */}
                        {yogaCourses.length > 0 && (
                            <section className="mb-12">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-4xl">🧘</span>
                                            <h2 className={`text-3xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Yoga & Wellness</h2>
                                        </div>
                                        <p className={`text-neutral-500 ${theme === 'light' ? 'text-gray-500' : ''}`}>Explore our yoga programs</p>
                                    </div>
                                    <Link href="/courses/yoga" className={`font-bold flex items-center gap-2 hover:gap-3 transition-all ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>
                                        View All <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {yogaCourses.slice(0, 3).map((c, i) => (
                                        <CourseCard key={c.id} course={c} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Explore More */}
                        {exploreCourses.length > 0 && (
                            <section className="mb-12">
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                                    <div>
                                        <h2 className={`text-3xl font-black mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Explore More</h2>
                                        <p className={`text-neutral-500 ${theme === 'light' ? 'text-gray-500' : ''}`}>Discover other courses from our academy</p>
                                    </div>
                                    <Link href="/explore" className={`font-bold flex items-center gap-2 hover:gap-3 transition-all ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>
                                        View All <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {exploreCourses.slice(0, 3).map((c, i) => (
                                        <CourseCard key={c.id} course={c} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
