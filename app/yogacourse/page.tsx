import { getCourseBySlug, getRelatedCourses, getExploreCourses, getCoursesByCategory } from "@/app/actions/public-courses";
import { CourseDetailLayout } from "@/components/features/courses/CourseDetailLayout";
import { notFound } from "next/navigation";

export default async function YogaCoursePage() {
    // Fetch the yoga course
    const course = await getCourseBySlug('yoga');

    if (!course) {
        notFound();
    }

    const relatedCourses = await getRelatedCourses('fitness', 'yoga', 2);
    const exploreCourses = await getExploreCourses('fitness', 3);
    const yogaCourses = await getCoursesByCategory('yoga', 3);

    return (
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
    );
}
