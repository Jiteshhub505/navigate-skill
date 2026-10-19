import { getCourseBySlug, getRelatedCourses, getExploreCourses, getCoursesByCategory } from "@/app/actions/public-courses";
import { CourseDetailLayout } from "@/components/features/courses/CourseDetailLayout";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const course = await getCourseBySlug('yoga');

    return {
        title: course
            ? `${course.title} | Online Yoga Classes India`
            : "Online Yoga Classes | Navigate Skill Academy",
        description: course?.description
            ? `${course.description.slice(0, 155)}...`
            : "Join expert-led online yoga classes at Navigate Skill Academy. Live sessions, beginner to advanced levels, certification included. Start your yoga journey today!",
        alternates: {
            canonical: '/courses/yoga',
        },
        keywords: [
            "online yoga classes", "live yoga sessions", "yoga instructor certification",
            "yoga for beginners online", "daily yoga classes India", "best yoga courses"
        ],
        openGraph: {
            title: course ? `${course.title} — Navigate Skill Academy` : "Online Yoga Classes — Navigate Skill Academy",
            description: course?.description?.slice(0, 155) || "Expert-led live yoga classes online. Join thousands of students across India.",
            url: 'https://navigateskill.com/courses/yoga',
            images: course?.imageUrl ? [{ url: course.imageUrl, width: 1200, height: 630 }] : undefined,
        }
    };
}

export const revalidate = 10; // Instant dynamic updates

export default async function YogaCoursesPage() {
    // Fetch all course data in parallel for blazing fast loading
    const [course, relatedCourses, exploreCourses, yogaCourses] = await Promise.all([
        getCourseBySlug('yoga'),
        getRelatedCourses('fitness', 'yoga', 2),
        getExploreCourses('fitness', 3),
        getCoursesByCategory('yoga', 3),
    ]);

    if (!course) {
        notFound();
    }

    // Course JSON-LD Schema for rich Google results
    const courseJsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.title,
        "description": course.description || "Expert-led live yoga classes online",
        "provider": {
            "@type": "Organization",
            "name": "Navigate Skill Academy",
            "url": "https://navigateskill.com",
            "sameAs": [
                "https://www.instagram.com/navigate_skill_academy/",
                "https://www.facebook.com/61586638242341"
            ]
        },
        "url": "https://navigateskill.com/courses/yoga",
        "image": course.imageUrl || "https://navigateskill.com/og-image.png",
        "courseMode": "online",
        "educationalLevel": "Beginner to Advanced",
        "inLanguage": "en",
        "offers": {
            "@type": "Offer",
            "category": "Paid",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "INR",
            "seller": {
                "@type": "Organization",
                "name": "Navigate Skill Academy"
            }
        },
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online",
            "location": "Online"
        }
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://navigateskill.com" },
            { "@type": "ListItem", "position": 2, "name": "Courses", "item": "https://navigateskill.com/explore" },
            { "@type": "ListItem", "position": 3, "name": "Yoga", "item": "https://navigateskill.com/courses/yoga" }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <CourseDetailLayout
                course={course as any}
                relatedCourses={relatedCourses as any[]}
                exploreCourses={exploreCourses as any[]}
                yogaCourses={yogaCourses as any[]}
                categoryName="Fitness"
                categorySlug="fitness"
                categoryIcon="💪"
                showOnlyActivePricing={true}
                theme="light"
            />
        </>
    );
}
