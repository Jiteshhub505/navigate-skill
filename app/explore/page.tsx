import { Metadata } from "next";
import { getCoursesByCategory, getCategories } from "@/app/actions/public-courses";
import { ExploreView } from "@/components/explore/ExploreView";

export const revalidate = 10; // Instant cache update (10s)

export const metadata: Metadata = {
    title: "Explore Courses | Online Yoga, Fitness, Dance & Trading Classes",
    description: "Browse all online courses at Navigate Skill Academy. Find expert-led yoga classes, fitness training, dance programs, and stock trading courses. Join thousands of learners in India.",
    alternates: {
        canonical: '/explore',
    },
    keywords: [
        "explore online courses", "skills development programs", "online dance classes India",
        "stock trading certification", "learn yoga online", "fitness certification courses"
    ],
    openGraph: {
        title: "Explore Online Courses — Navigate Skill Academy",
        description: "Browse yoga, fitness, dance and trading courses. Expert-led live classes with certification.",
        url: 'https://navigateskill.com/explore',
    }
};

export default async function ExplorePage({
    searchParams
}: {
    searchParams: Promise<{ category?: string }>
}) {
    const { category = 'all' } = await searchParams;

    // Fetch all courses and categories in parallel
    const [allCourses, categories] = await Promise.all([
        getCoursesByCategory('all'),
        getCategories(),
    ]);

    return (
        <ExploreView
            initialCourses={allCourses as any}
            categories={categories as any}
            activeCategorySlug={category}
        />
    );
}

