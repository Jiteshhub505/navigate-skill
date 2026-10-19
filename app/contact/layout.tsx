import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Contact Us | Get in Touch",
    description: "Contact Navigate Skill Academy for queries about our online yoga, fitness, dance, and trading courses. Reach us via WhatsApp, email or our contact form. We're here to help!",
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: "Contact Navigate Skill Academy",
        description: "Reach out to us for course queries, enrollment help, or partnership opportunities.",
        url: 'https://navigateskill.com/contact',
    }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
