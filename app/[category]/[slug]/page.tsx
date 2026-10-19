import { notFound } from "next/navigation";
import { getCourseBySlug, getRelatedCourses, getExploreCourses, getCoursesByCategory } from "@/app/actions/public-courses";
import { CourseDetailLayout } from "@/components/features/courses/CourseDetailLayout";
import { Metadata } from "next";

export async function generateMetadata({
    params
}: {
    params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
    const { category, slug } = await params;
    const course = await getCourseBySlug(slug);

    if (!course) {
        return {
            title: "Course Details | Navigate Skill Academy",
        };
    }

    const title = `${course.title} Course | Navigate Skill Academy`;
    const description = course.description
        ? `${course.description.slice(0, 155)}...`
        : `Learn ${course.title} online at Navigate Skill Academy. Live expert guidance, practical sessions, and certification.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/${category}/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `https://navigateskill.com/${category}/${slug}`,
            images: course.imageUrl ? [{ url: course.imageUrl, width: 1200, height: 630 }] : undefined,
        }
    };
}


export const revalidate = 10;

export default async function GenericCourseDetailPage({
    params
}: {
    params: Promise<{ category: string; slug: string }>
}) {
    const { category, slug } = await params;

    const course = await getCourseBySlug(slug);

    if (!course) {
        notFound();
    }

    const [relatedCourses, exploreCourses, yogaCourses] = await Promise.all([
        getRelatedCourses(category, slug, 2),
        getExploreCourses(category, 3),
        getCoursesByCategory('yoga', 3),
    ]);

    return (
        <CourseDetailLayout
            course={course as any}
            relatedCourses={relatedCourses as any[]}
            exploreCourses={exploreCourses as any[]}
            yogaCourses={yogaCourses as any[]}
            categoryName={course.category?.name || "Course"}
            categorySlug={category}
            categoryIcon={course.category?.icon || "🎓"}
        />
    );
}
