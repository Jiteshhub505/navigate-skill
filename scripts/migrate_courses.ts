// @ts-nocheck
import { db } from '@/lib/db'
import { courses, categories } from '@/lib/db/schema'
import * as dotenv from 'dotenv'

dotenv.config()

const allCourses = [
    {
        slug: "bollywood-dance",
        title: "Bollywood Dance",
        category: "dance",
        subcategory: "Western Dance",
        description: "Learn the vibrant and energetic moves of Bollywood dance",
        longDescription: "Immerse yourself in the colorful world of Bollywood dance. Learn iconic moves from the latest Hindi films, master expressions, and develop your own style. Our classes cover everything from graceful movements to high-energy choreography.",
        image: "/dance/bollywood dance/bollywood.jpg",
        galleryImages: [
            "/dance/bollywood dance/bollywood.jpg",
            "/dance/bollywood dance/bollywood1",
            "/dance/bollywood dance/bollywood2",
            "/dance/bollywood dance/bollywood3",
        ],
        duration: "1 Hour per Session",
        timings: ["6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM"],
        pricing: {
            oneMonth: { original: 700, discounted: 500 },
            threeMonths: { original: 2100, discounted: 1500 },
            sixMonths: { original: 4200, discounted: 3000 },
            oneYear: { original: 8400, discounted: 6000 },
        },
        features: [
            "Live interactive classes",
            "Learn from Bollywood choreographers",
            "Weekly new choreography",
            "Performance opportunities",
            "Recorded sessions available",
        ],
        instructor: "Expert Dance Instructors",
        level: "All Levels",
    },
    {
        slug: "kids-dance",
        title: "Kids Dance",
        category: "dance",
        subcategory: "Western Dance",
        description: "Fun and engaging dance classes designed for children",
        longDescription: "A fun-filled dance program designed specifically for children. We focus on building coordination, rhythm, and confidence through age-appropriate choreography and games. Perfect for kids aged 5-15 years.",
        image: "/dance/kids dance/kid-dance.avif",
        galleryImages: [
            "/dance/kids dance/kid-dance.avif",
            "/dance/kids dance/kid-dance1.avif",
            "/dance/kids dance/kid-dance2.avif",
            "/dance/kids dance/kid-dance3.jpg",
        ],
        duration: "1 Hour per Session",
        timings: ["6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM"],
        pricing: {
            oneMonth: { original: 700, discounted: 500 },
            threeMonths: { original: 2100, discounted: 1500 },
            sixMonths: { original: 4200, discounted: 3000 },
            oneYear: { original: 8400, discounted: 6000 },
        },
        features: [
            "Age-appropriate choreography",
            "Fun & engaging sessions",
            "Build confidence & coordination",
            "Interactive games included",
            "Performance opportunities",
        ],
        instructor: "Trained Kids Dance Specialists",
        level: "Beginner",
    },
    {
        slug: "hip-hop",
        title: "Hip Hop",
        category: "dance",
        subcategory: "Western Dance",
        description: "Master urban street dance styles and hip hop moves",
        longDescription: "Dive into the world of Hip Hop dance! Learn popping, locking, breaking, and contemporary street dance styles. Our instructors bring authentic hip hop culture and the latest trends to every class.",
        image: "/dance/hip hop/hip-hop1.jpg",
        galleryImages: [
            "/dance/hip hop/hip-hop1.jpg",
            "/dance/hip hop/hip-hop2.jpg",
            "/dance/hip hop/hip-hop3.jpg",
            "/dance/hip hop/hip-hop4.jpg",
        ],
        duration: "1 Hour per Session",
        timings: ["6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM"],
        pricing: {
            oneMonth: { original: 700, discounted: 500 },
            threeMonths: { original: 2100, discounted: 1500 },
            sixMonths: { original: 4200, discounted: 3000 },
            oneYear: { original: 8400, discounted: 6000 },
        },
        features: [
            "Learn popping & locking",
            "Street dance fundamentals",
            "Freestyle sessions",
            "Battle training",
            "Latest trending choreography",
        ],
        instructor: "Professional Hip Hop Dancers",
        level: "All Levels",
    },
    {
        slug: "kathak",
        title: "Kathak Classes",
        category: "dance",
        subcategory: "Classical Dance",
        description: "Traditional North Indian classical dance form",
        longDescription: "Learn the graceful art of Kathak, one of India's most beautiful classical dance forms. Master the intricate footwork, expressive hand gestures, and storytelling techniques that make Kathak unique.",
        image: "/dance/kathak/kathak1.jpeg",
        galleryImages: [
            "/dance/kathak/kathak1.jpeg",
            "/dance/kathak/kathak2.jpeg",
            "/dance/kathak/kathak3.jpeg",
        ],
        duration: "1 Hour per Session",
        timings: ["6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM"],
        pricing: {
            oneMonth: { original: 700, discounted: 500 },
            threeMonths: { original: 2100, discounted: 1500 },
            sixMonths: { original: 4200, discounted: 3000 },
            oneYear: { original: 8400, discounted: 6000 },
        },
        features: [
            "Traditional Kathak curriculum",
            "Learn tatkaar & footwork",
            "Expressive abhinaya training",
            "Theory & history included",
            "Certification available",
        ],
        instructor: "Classical Kathak Gurus",
        level: "All Levels",
    },
    {
        slug: "bharatanatyam",
        title: "Bharatanatyam",
        category: "dance",
        subcategory: "Classical Dance",
        description: "Ancient South Indian classical dance tradition",
        longDescription: "Experience the divine art of Bharatanatyam. This ancient dance form combines precise geometry of movement, intricate rhythms, and spiritual expression. Perfect for those seeking a deeper connection with Indian culture.",
        image: "/dance/Bharatanatyam/bharatanatyam.avif",
        galleryImages: [
            "/dance/Bharatanatyam/bharatanatyam.avif",
            "/dance/Bharatanatyam/bharatanatyam1.avif",
            "/dance/Bharatanatyam/bharatanatyam2.avif",
            "/dance/Bharatanatyam/bharatanatyam3.jpg",
        ],
        duration: "1 Hour per Session",
        timings: ["6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM"],
        pricing: {
            oneMonth: { original: 700, discounted: 500 },
            threeMonths: { original: 2100, discounted: 1500 },
            sixMonths: { original: 4200, discounted: 3000 },
            oneYear: { original: 8400, discounted: 6000 },
        },
        features: [
            "Traditional Bharatanatyam training",
            "Learn adavus & mudras",
            "Spiritual & cultural learning",
            "Performance preparation",
            "Certification available",
        ],
        instructor: "Trained Bharatanatyam Masters",
        level: "All Levels",
    },
    {
        slug: "calisthenics",
        title: "Calisthenics",
        category: "fitness",
        description: "Master bodyweight training and functional fitness",
        longDescription: "Transform your body with calisthenics! Learn to use your own bodyweight to build strength, flexibility, and control. From basic moves to advanced skills like muscle-ups and handstands, we guide you through your fitness journey.",
        image: "/calesthenic/calesthenic4.avif",
        galleryImages: [
            "/calesthenic/calesthenic1.jpg",
            "/calesthenic/calesthenic2.jpg",
            "/calesthenic/calesthenic3.jpg",
            "/calesthenic/calesthenic4.avif",
        ],
        duration: "1 Hour per Session",
        timings: ["6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM"],
        pricing: {
            oneMonth: { original: 700, discounted: 500 },
            threeMonths: { original: 2100, discounted: 1500 },
            sixMonths: { original: 4200, discounted: 3000 },
            oneYear: { original: 8400, discounted: 6000 },
        },
        features: [
            "Progressive skill training",
            "Bodyweight strength building",
            "Flexibility & mobility work",
            "Learn advanced moves",
            "Personalized progression plans",
        ],
        instructor: "Certified Calisthenics Trainers",
        level: "All Levels",
    },
    {
        slug: "trading",
        title: "Trading Masterclass",
        category: "finance",
        description: "Learn stock market trading and investment strategies",
        longDescription: "Master the art of trading with our comprehensive course. Learn technical analysis, fundamental analysis, risk management, and develop your own trading strategies. From basics to advanced trading techniques.",
        image: "/trading/trading.avif",
        galleryImages: [
            "/trading/trading.avif",
            "/trading/trading1.jpg",
            "/trading/trading2.jpg",
            "/trading/trading3.jpg",
        ],
        duration: "1 Hour per Session",
        timings: ["6:00 AM - 7:00 AM", "7:00 AM - 8:00 AM", "5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM"],
        pricing: {
            oneMonth: { original: 700, discounted: 500 },
            threeMonths: { original: 2100, discounted: 1500 },
            sixMonths: { original: 4200, discounted: 3000 },
            oneYear: { original: 8400, discounted: 6000 },
        },
        features: [
            "Technical analysis mastery",
            "Fundamental analysis",
            "Risk management strategies",
            "Live market analysis",
            "Trading psychology",
        ],
        instructor: "Professional Traders",
        level: "All Levels",
    }
];

async function migrate() {
    console.log('Starting migration with Drizzle...')

    try {
        // 1. Migrate Categories first
        const uniqueCategories = Array.from(new Set(allCourses.map(c => c.category)))

        for (const catName of uniqueCategories) {
            console.log(`Migrating category: ${catName}`)
            await db.insert(categories).values({
                name: catName.charAt(0).toUpperCase() + catName.slice(1),
                slug: catName.toLowerCase(),
            }).onConflictDoUpdate({
                target: categories.name,
                set: { name: catName.charAt(0).toUpperCase() + catName.slice(1) }
            })
        }

        // Fetch all categories to get their IDs
        const allCats = await db.select().from(categories)
        const catMap = new Map(allCats.map(c => [c.slug, c.id]))

        // 2. Migrate Courses
        for (const course of allCourses) {
            console.log(`Migrating course: ${course.title}`)
            const categoryId = catMap.get(course.category.toLowerCase())

            await db.insert(courses).values({
                slug: course.slug,
                title: course.title,
                description: course.description,
                longDescription: course.longDescription,
                price: course.pricing.oneMonth.discounted.toString(),
                pricing: course.pricing,
                categoryId: categoryId,
                categoryName: course.category,
                subcategory: course.subcategory,
                imageUrl: course.image,
                galleryImages: course.galleryImages,
                instructor: course.instructor || 'Expert Instructor',
                duration: course.duration,
                timings: course.timings,
                features: course.features,
                level: course.level,
            }).onConflictDoUpdate({
                target: courses.slug,
                set: {
                    title: course.title,
                    description: course.description,
                    longDescription: course.longDescription,
                    price: course.pricing.oneMonth.discounted.toString(),
                    pricing: course.pricing,
                    categoryName: course.category,
                    subcategory: course.subcategory,
                    imageUrl: course.image,
                    galleryImages: course.galleryImages,
                    instructor: course.instructor || 'Expert Instructor',
                    duration: course.duration,
                    timings: course.timings,
                    features: course.features,
                    level: course.level,
                }
            })
        }

        console.log('Migration complete!')
    } catch (error) {
        console.error('Migration failed:', error)
    } finally {
        process.exit()
    }
}

migrate()
