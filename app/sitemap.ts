import { MetadataRoute } from 'next';

const BASE_URL = 'https://navigateskill.com';

// Static pages with their SEO priority and change frequency
const staticPages: MetadataRoute.Sitemap = [
    {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
    },
    {
        url: `${BASE_URL}/explore`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
    },
    {
        url: `${BASE_URL}/categories`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    },
    {
        url: `${BASE_URL}/courses/yoga`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    },
    {
        url: `${BASE_URL}/teachers`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    },
    {
        url: `${BASE_URL}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    },
    {
        url: `${BASE_URL}/faq`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    },
    {
        url: `${BASE_URL}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
    },
    {
        url: `${BASE_URL}/fitness/yoga`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    },
    {
        url: `${BASE_URL}/yogacourse`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Try to fetch dynamic pages (categories/courses) from DB
    // If it fails, fall back to static list gracefully
    try {
        const { getCategories, getExploreCourses } = await import('@/app/actions/public-courses');

        const [categories, courses] = await Promise.all([
            getCategories(),
            getExploreCourses('all', 50),
        ]);

        const categoryPages: MetadataRoute.Sitemap = (categories as any[]).map((cat) => ({
            url: `${BASE_URL}/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        const coursePages: MetadataRoute.Sitemap = (courses as any[]).map((course) => ({
            url: `${BASE_URL}/${course.category?.slug || 'explore'}/${course.slug}`,
            lastModified: new Date(course.updatedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));

        return [...staticPages, ...categoryPages, ...coursePages];
    } catch {
        // Fallback to static pages only
        return staticPages;
    }
}
