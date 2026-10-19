import { Metadata } from "next";
import { Hero } from "@/components/site/Hero";
import { FeaturedCourses } from "@/components/site/FeaturedCourses";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { Journey } from "@/components/site/Journey";
import { Stats } from "@/components/site/Stats";
import { MembershipCTA } from "@/components/site/MembershipCTA";
import { FAQ } from "@/components/site/FAQ";
import { Testimonials } from "@/components/site/Testimonials";

export const metadata: Metadata = {
    title: "Online Yoga Classes India | Live Yoga, Weight Loss & Wellness Sessions",
    description: "Join Navigate Skill Academy for live online yoga classes in India. Daily interactive sessions on Google Meet/Zoom for weight loss, back pain, flexibility, prenatal care, and stress relief with certified instructors.",
    keywords: [
        "Online Yoga Classes India", "Best Online Yoga Classes", "Live Yoga Classes", "Yoga Classes Online", "Online Yoga Training",
        "Online Yoga Sessions", "Yoga Classes India", "Online Yoga Instructor", "Certified Yoga Classes", "Online Yoga Academy", "Yoga Course Online", "Online Wellness Classes", "Virtual Yoga Classes", "Yoga From Home", "Yoga Teacher Online",
        "Morning Yoga Routine", "Yoga at Home", "Home Workout Yoga", "Live Yoga on Google Meet", "Daily Yoga Practice", "Stretching Exercises", "Breathwork Classes", "Mobility Exercises", "Mindfulness Meditation", "Office Yoga", "Chair Yoga", "10 Minute Yoga", "15 Minute Yoga", "20 Minute Yoga", "Full Body Stretch", "Yoga for Flexibility", "Functional Yoga", "Online Fitness Classes", "Holistic Wellness",
        "Yoga for Weight Loss", "Weight Loss Yoga Classes", "Fat Loss Yoga", "Belly Fat Yoga", "Yoga to Lose Weight", "Best Yoga for Weight Loss", "Online Weight Loss Program", "Yoga for Obesity", "Yoga for Fitness", "Yoga for Body Transformation",
        "Yoga for Weight Gain", "Weight Gain Yoga", "Healthy Weight Gain Yoga", "Yoga for Muscle Strength", "Strength Building Yoga", "Yoga for Skinny Body", "Yoga for Healthy Lifestyle",
        "Stress Relief Yoga", "Yoga for Anxiety", "Yoga for Depression", "Meditation Classes Online", "Online Meditation Course", "Yoga for Better Sleep", "Yoga for Mental Health", "Breathing Exercises", "Pranayama Classes", "Guided Meditation",
        "Women's Yoga Classes", "Prenatal Yoga", "Pregnancy Yoga", "Post Pregnancy Yoga", "Postnatal Yoga", "Yoga for PCOS", "Yoga for Hormonal Balance", "Yoga for Menopause", "Yoga During Pregnancy",
        "Yoga for Men", "Men's Fitness Yoga", "Strength Yoga", "Flexibility Training", "Core Strength Yoga",
        "Kids Yoga Classes", "Family Yoga", "Yoga for Children", "Teen Yoga", "Online Kids Yoga",
        "Yoga for Senior Citizens", "Gentle Yoga", "Senior Fitness Yoga", "Chair Yoga for Seniors", "Elderly Yoga Classes",
        "Office Yoga", "Yoga for IT Professionals", "Desk Yoga", "Yoga for Corporate Employees", "Work From Home Yoga", "Yoga for Neck Pain", "Yoga for Back Pain", "Yoga for Sitting Jobs",
        "Live Online Yoga Classes", "Online Yoga Classes for Beginners", "Daily Online Yoga", "Yoga on Google Meet", "Yoga on Zoom", "Online Yoga Membership", "Personal Online Yoga Trainer", "Group Yoga Classes Online", "One-on-One Yoga Classes", "Weekend Yoga Classes",
        "Join Online Yoga Classes", "Book Yoga Classes", "Best Online Yoga Classes in India", "Affordable Yoga Classes", "Yoga Membership", "Yoga Trial Class", "Online Yoga Course with Certificate", "Yoga Coaching Online", "Yoga Classes Fees"
    ],
    openGraph: {
        title: "Online Yoga Classes India — Navigate Skill Academy",
        description: "Transform your body and mind with our expert-led live classes. Get fit, lose weight, and reduce stress from home.",
        url: 'https://navigateskill.com',
        siteName: 'Navigate Skill Academy',
        locale: 'en_IN',
        type: 'website',
    }
};

export const revalidate = 10;

export default function Home() {
    return (
        <div className="min-h-screen overflow-hidden bg-[#faf7ff]">
            <Hero />
            <div className="py-6 lg:py-10">
                <Stats />
            </div>
            <div className="py-6 lg:py-10">
                <WhyChooseUs />
            </div>
            <FeaturedCourses />
            <Journey />
            <MembershipCTA />
            <Testimonials />
            <FAQ />
        </div>
    );
}
