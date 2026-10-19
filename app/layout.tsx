import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import WhatsAppWidget from "@/components/common/WhatsAppWidget";
import { HideOnPaths } from "@/components/common/HideOnPaths";
import MetaPixelTracker from "@/components/site/MetaPixelTracker";

export const viewport: Viewport = {
    themeColor: "#faf7ff",
    colorScheme: "light",
    width: "device-width",
    initialScale: 1,
};

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: 'swap',
    preload: true,
    // Only load weights we actually use
    weight: ['400', '500', '600', '700', '800'],
});


export const metadata: Metadata = {
    title: {
        default: "Navigate Skill Academy | Online Yoga Classes, Fitness, Dance & Learning Programs",
        template: "%s | Navigate Skill Academy"
    },
    description: "Join Navigate Skill Academy for expert-led online yoga classes and structured learning programs. Explore fitness, dance, and academic courses. Start your journey now!",
    keywords: [
        "online yoga classes", "yoga classes online India", "online fitness classes",
        "dance classes online", "stock trading course", "online learning platform India",
        "fitness training online", "Navigate Skill Academy",
        "live yoga classes", "certified yoga instructor", "online courses India"
    ],
    metadataBase: new URL('https://navigateskill.com'),
    alternates: {
        canonical: '/',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: "Navigate Skill Academy | Online Yoga, Fitness & Learning",
        description: "Join expert-led online yoga classes and structured learning programs. Transform your journey with Navigate Skill Academy.",
        url: 'https://navigateskill.com',
        siteName: 'Navigate Skill Academy',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Navigate Skill Academy — Online Yoga, Fitness, Dance & Trading Courses',
            },
        ],
        locale: 'en_IN',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Navigate Skill Academy',
        description: 'Online Yoga, Fitness, Dance & Learning Programs',
        images: ['/og-image.png'],
    },
    icons: {
        icon: '/logo-icon.png',
        shortcut: '/logo-icon.png',
        apple: '/logo-icon.png',
    }
};

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": "Navigate Skill Academy",
        "url": "https://navigateskill.com",
        "logo": "https://navigateskill.com/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9218187041",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": "en"
        },
        "sameAs": [
            "https://www.facebook.com/61586638242341",
            "https://www.instagram.com/navigate_skill_academy/"
        ],
        "description": "Navigate Skill Academy offers expert-led online yoga classes, fitness programs, dance, and academic courses.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "C-9/15, 3rd Floor, Sector 7, Rohini, Near Rohini East Metro Station, Opposite Metro Pillar No. 399",
            "addressLocality": "Delhi",
            "postalCode": "110085",
            "addressCountry": "IN"
        }
    },
    {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Navigate Skill Academy",
        "image": "https://navigateskill.com/og-image.png",
        "url": "https://navigateskill.com",
        "telephone": "+91-9218187041",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "C-9/15, 3rd Floor, Sector 7, Rohini, Near Rohini East Metro Station, Opposite Metro Pillar No. 399",
            "addressLocality": "Delhi",
            "postalCode": "110085",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 28.7088,
            "longitude": 77.1264
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "06:00",
            "closes": "22:00"
        },
        "sameAs": [
            "https://www.facebook.com/61586638242341",
            "https://www.instagram.com/navigate_skill_academy/"
        ]
    }
];

import { PreloadLinks } from "@/components/ui/PreloadLinks";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth bg-[#faf7ff] text-gray-950">
            <head>
                <PreloadLinks />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '1760871571894513');
                        `,
                    }}
                />
                <noscript>
                    <img
                        height="1"
                        width="1"
                        style={{ display: "none" }}
                        src="https://www.facebook.com/tr?id=1760871571894513&ev=PageView&noscript=1"
                        alt=""
                    />
                </noscript>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                className={`${geistSans.variable} antialiased min-h-screen flex flex-col bg-[#faf7ff] text-gray-950`}
            >
                <ReactQueryProvider>
                    <Suspense fallback={null}>
                        <MetaPixelTracker />
                    </Suspense>
                    <HideOnPaths paths={["/courses/yoga/conversation"]}>
                        <Navbar />
                    </HideOnPaths>
                    <main className="flex-grow overflow-x-hidden">
                        {children}
                    </main>
                    <HideOnPaths paths={["/courses/yoga/conversation"]}>
                        <Footer />
                        <WhatsAppWidget />
                    </HideOnPaths>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
